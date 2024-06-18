import { ref, type Ref } from 'vue';

import { EThreadEvents } from '@/../threadEvents';

import { generateId } from '@libs/generate';
import { useLogStore } from '@components/singletones/ZFeedBackPanel';

type ILoadRequest = {
  id: number;
  resolve: ((v: unknown) => void) | null;
  chunk: string[] | null;
};

const getFirstNotAnsweredReq = (requestsBuffer: ILoadRequest[]) => {
  for (let i = 0; i < requestsBuffer.length; ++i) {
    if (requestsBuffer[i].chunk === null) {
      return requestsBuffer[i];
    }
  }

  return null;
};

export const useStoreDistributionBtn = (isDistributionWorking: Ref<boolean>) => {
  const logStore = useLogStore();
  const chunksStoreEmpty = ref(false);
  const loadRequestsBuffer: ILoadRequest[] = [];

  window.ipcRenderer.on(EThreadEvents.CHUNK_READ, (event, chunk: string[] | string | null) => {
    if (!isDistributionWorking.value) {
      return;
    }

    if (chunksStoreEmpty.value === null) {
      chunksStoreEmpty.value = false;
    }

    if (Array.isArray(chunk)) {
      const notAnsweredRequest = getFirstNotAnsweredReq(loadRequestsBuffer);
      if (notAnsweredRequest) {
        notAnsweredRequest.chunk = chunk;
        notAnsweredRequest.resolve?.(null);
      } else {
        logStore.log({
          type: 'error',
          content: `В буффере запросов на получение чанка из хранилища отсутствуют невыполненные запросы. Это некорректная работа логики, которая привела к потере транзакций, которые надо выполнить.`,
        });
      }
    } else if (chunk === null) {
      logStore.log({
        type: 'message',
        content: 'В кеше закончились чанки',
      });

      chunksStoreEmpty.value = true;
      loadRequestsBuffer.forEach((request) => request.resolve?.(null));
    } else {
      logStore.log({
        type: 'error',
        content: `При попытке прочесть чанк из хранилища была получена ошибка:
  ${chunk}`,
      });
    }
  });

  const loadChunkFromStore = async () => {
    const requestId = generateId();
    const loadRequest: ILoadRequest = {
      id: requestId,
      resolve: null,
      chunk: null,
    };

    loadRequestsBuffer.push(loadRequest);
    window.ipcRenderer.send(EThreadEvents.READ_CHUNK);
    await new Promise((resolve) => {
      loadRequest.resolve = resolve;
    });

    const requestInx = loadRequestsBuffer.findIndex((request) => request.id === requestId);
    loadRequestsBuffer.splice(requestInx, 1);

    return loadRequest.chunk;
  };

  return {
    loadChunkFromStore,
    chunksStoreEmpty,
  };
};
