<script lang="ts">
import ZButton from '@components/buttons/ZButton.vue';

export default {
  name: 'PStoreAndParsingDistributionBtn',
};
</script>
<script setup lang="ts">
import { computed, inject } from 'vue';
import { EThreadEvents } from '@/../threadEvents';

import type { WalletsScanner, ChunkSizeStatisticsChecker } from '@/core/ton';

import type { IDistributionBtnEmits, IDistributionBtnProps, IChunkContainer } from '../types';
import { useDistributionBtn, ChunkContainersBuffer } from '../utils/useDistributionBtn';
import { useStoreDistributionBtn } from '../utils/useStoreDistributionBtn';

const $props = defineProps<IDistributionBtnProps>();
const $emit = defineEmits<IDistributionBtnEmits>();

const MAX_CHUNKS_IN_BUFFER = 4;

const isDistributionWorking = computed(() => {
  return $props.distributionMethod === 'StoreAndParsing';
});

const chunkContainersBuffer = new ChunkContainersBuffer<IExtendedChunkContainer>();
type IExtendedChunkContainer = {
  nextChunkOrigin: (() => void) | null;
} & IChunkContainer;
const { loadChunkFromStore, chunksStoreEmpty } = useStoreDistributionBtn(isDistributionWorking);
const { onClick, distributionStatus, logStore, exposes, loadChunksInBuffer } =
  useDistributionBtn<IExtendedChunkContainer>(
    'StoreAndParsing',
    distributeFromParsing,

    $props,
    $emit,

    chunkContainersBuffer,
    (loadedPromiseResolveWrapper) => ({
      chunk: null,
      id: null,
      nextChunkOrigin: null,
      loadedPromise: new Promise((resolve) => {
        loadedPromiseResolveWrapper.resolve = resolve;
      }),
    }),

    (chunkContainer: IExtendedChunkContainer) => {
      if (!chunkContainer.nextChunkOrigin) {
        throw new Error('У chunkContainer отсуствует функция "nextChunkOrigin"');
      }

      return chunkContainer.nextChunkOrigin();
    },

    (chunkContainer: IExtendedChunkContainer) => {
      if (chunkContainer.nextChunkOrigin === loanChunkFromWalletsScanner && chunkContainer.chunk) {
        chunkSizeChecker.onChunkFetched(chunkContainer.chunk.length);
        window.ipcRenderer.send(EThreadEvents.SAVE_CHUNK, chunkContainer.chunk);
      }
    },

    () => {
      chunksStoreEmpty.value = false;
    },
  );

const walletsScanner = inject('walletsScanner') as InstanceType<typeof WalletsScanner>;
const chunkSizeChecker = inject('chunkSizeChecker') as InstanceType<typeof ChunkSizeStatisticsChecker>;

window.ipcRenderer.on(EThreadEvents.CHUNK_SAVED, (event, errorMessage?: string) => {
  if (errorMessage) {
    logStore.log({
      content: `При сохранении чанка произошла ошибка;
<strong>Содержимое:</strong>
${errorMessage}`,
      type: 'error',
    });
  }
});

const loanChunkFromWalletsScanner = () => {
  return loadChunksInBuffer((existingChankContainer: IExtendedChunkContainer) => {
    existingChankContainer.nextChunkOrigin = loadStoreChunksUsingComposable;
    return walletsScanner.scan();
  });
};

const loadStoreChunksUsingComposable = () => {
  if (chunksStoreEmpty.value) {
    if (distributionStatus.value !== 'shouldStop') {
      distributionStatus.value = 'shouldStop';
    }

    return;
  }

  return loadChunksInBuffer((existingChankContainer: IExtendedChunkContainer) => {
    existingChankContainer.nextChunkOrigin = loanChunkFromWalletsScanner;
    return loadChunkFromStore();
  });
};

const loadChunkContainersOnStart = () => {
  for (let i = 0; i < MAX_CHUNKS_IN_BUFFER; ++i) {
    if (i % 2 === 0) {
      loanChunkFromWalletsScanner();
    } else {
      loadStoreChunksUsingComposable();
    }
  }
};

// eslint-disable-next-line func-style
async function distributeFromParsing() {
  loadChunkContainersOnStart();
}

defineExpose(exposes);
</script>

<template>
  <ZButton
    icon="branchesOutline"
    @click="onClick"
    :class="{
      [`${$props.onAbortingClasses}`]: distributionStatus === 'shouldStop',
    }"
    :loading="$props.distributionMethod === 'StoreAndParsing'"
    :disabled="$props.distributionMethod !== null && $props.distributionMethod !== 'StoreAndParsing'"
    tip="Из хранилища и парсераs"
  />
</template>

<style scoped></style>
