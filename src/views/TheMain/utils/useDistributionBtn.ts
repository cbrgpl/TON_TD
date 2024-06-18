import { watch, ref } from 'vue';
import { useLogStore } from '@components/singletones/ZFeedBackPanel';
import { useToastStore } from '@components/singletones/ZToasts';

import { generateId } from '@libs/generate/index';

import type { IDistributionBtnExposes, IDistributionBtnProps, UDistributionMethods, IChunkContainer } from '../types';
// import { logWhileDebugging } from './logWhileDebugging';

export class ChunkContainersBuffer<T extends IChunkContainer = IChunkContainer> {
  readonly buffer: T[] = [];

  private _onAddHandlers: ((container: T, i: number) => void)[] = [];
  private _onRemoveHandlers: ((i: number) => void)[] = [];

  /** @description return an index of the added container */
  add(container: T) {
    this.buffer.push(container);
    for (let i = 0; i < this._onAddHandlers.length; ++i) {
      this._onAddHandlers[i](container, i);
    }

    return this.buffer.length - 1;
  }

  remove(i: number) {
    this.buffer.splice(i, 1);

    for (let i = 0; i < this._onAddHandlers.length; ++i) {
      this._onRemoveHandlers[i](i);
    }
  }

  onAdd(handler: (container: T, index: number) => Promise<void>) {
    this._onAddHandlers.push(handler);
  }

  onRemove(handler: (i: number) => void) {
    this._onRemoveHandlers.push(handler);
  }
}

export const useDistributionBtn = <T extends IChunkContainer = IChunkContainer>(
  method: UDistributionMethods,
  methodFn: () => void,

  $props: IDistributionBtnProps,
  $emit: ((evt: 'update:distributionMethod', method: UDistributionMethods | null) => void) &
    ((evt: 'setStartingDistributionFn', fn: () => void) => void),

  chunkContainersBuffer: ChunkContainersBuffer<T>,
  getNewChunkContainer: (loadedPromiseResolveWrapper: { resolve: ((v: unknown) => void) | null }) => T,

  loadNextChunk: (chunkContainer: T) => void,
  onChunkLoaded: (chunkContainer: T) => void,

  onDistributionStopped?: () => void,
) => {
  // logWhileDebugging(['chunkContainersBuffer', chunkContainersBuffer]);

  const logStore = useLogStore();
  const toastStore = useToastStore();

  const distributionStatus = ref<null | 'shouldStop' | 'stopped'>();

  const loadChunksInBuffer = async (
    getChunk: (existingChankContainer: T) => Promise<string[] | null>,
    existingChankContainer?: T,
  ): Promise<void> => {
    if (distributionStatus.value === 'shouldStop') {
      // logWhileDebugging(['Прерываю загрузку новых чанков т.к. distStatus shouldStop']);
      return;
    }

    let resolveLoadedPromiseWrapper: { resolve: ((v: unknown) => void) | null } = { resolve: null };
    const chunkContainer: T = existingChankContainer ?? getNewChunkContainer(resolveLoadedPromiseWrapper);

    if (!existingChankContainer) {
      chunkContainer.id = generateId();
      // logWhileDebugging(['Пушу новый чанк контейнер в буффер'], chunkContainer);
      chunkContainersBuffer.add(chunkContainer);
    }

    const chunk = await getChunk(chunkContainer);

    if (chunk === null) {
      const containerInx = chunkContainersBuffer.buffer.findIndex((container) => container.id === chunkContainer.id);
      chunkContainersBuffer.remove(containerInx);
    } else if (chunk.length === 0) {
      loadChunksInBuffer(getChunk, chunkContainer);
    } else if (resolveLoadedPromiseWrapper.resolve) {
      // logWhileDebugging(['Получил чанк и зарезолвил промис контейнера'], chunkContainer);
      chunkContainer.chunk = chunk;
      resolveLoadedPromiseWrapper.resolve(null);
    }
  };

  const distribute = async (chunkContainer: T, i: number) => {
    // logWhileDebugging(['Очередной чанк был добавле в буффер'], chunkContainer);
    const timeBeforeWaiting = Date.now();
    await chunkContainer.loadedPromise;
    const timeAfterWaiting = Date.now();

    if (timeAfterWaiting - timeBeforeWaiting <= 15) {
      // logWhileDebugging(
      //   ['Взятый только что чанк уже загружен!!!!!!!!', timeAfterWaiting - timeBeforeWaiting],
      //   chunkContainer,
      // );
    }
    // logWhileDebugging(['Чанк загрузился'], chunkContainer);

    if (chunkContainer.chunk) {
      onChunkLoaded(chunkContainer);

      // logWhileDebugging(['Отдаю на рассылку'], chunkContainer);
      await new Promise((resolve) => {
        setTimeout(
          () => {
            resolve(null);
          },
          2000 + 4000 * Math.random(),
        );
      });
      // Отдаем на рассылку
      // await distributor.distribute( chunk )
      // logWhileDebugging(['РАССЫЛКУ ОКОНЧИЛ'], chunkContainer);

      loadNextChunk(chunkContainer);
      chunkContainersBuffer.remove(i);

      // logWhileDebugging([`Заменяю контейнер на новый`], chunkContainer);
    }
  };

  chunkContainersBuffer.onAdd(distribute);
  chunkContainersBuffer.onRemove(() => {
    if (distributionStatus.value === 'shouldStop' && chunkContainersBuffer.buffer.length === 0) {
      // logWhileDebugging(['Рассылка должна остановиться, и буффер пуст, поэтому обнуляю состояние']);
      onDistributionStopped?.();
      $emit('update:distributionMethod', null);
      distributionStatus.value = null;
      return;
    }
  });

  const onClick = () => {
    if (distributionStatus.value === 'shouldStop') {
      return;
    }

    if ($props.distributionMethod !== method) {
      $emit('setStartingDistributionFn', () => methodFn());
      $emit('update:distributionMethod', method);
    } else {
      toastStore.show().message({
        title: 'Остановка процедуры рассылки запущена',
        message: 'Как только оставшиеся чанки в буффере обработаются, рассылка будет полностью остановлена',
        life: 12000,
      });

      distributionStatus.value = 'shouldStop';
      const unwatch = watch(
        () => distributionStatus.value,
        (status, oldStatus) => {
          if (oldStatus === 'shouldStop' && status === 'stopped') {
            $emit('update:distributionMethod', null);
            setTimeout(() => unwatch(), 0);
          }
        },
        { immediate: true },
      );
    }
  };

  const exposes: IDistributionBtnExposes = {};

  return {
    $emit,
    $props,
    exposes,

    onClick,
    loadChunksInBuffer,
    distribute,

    distributionStatus,

    logStore,
    toastStore,
  };
};
