<script lang="ts">
import ZButton from '@components/buttons/ZButton.vue';

export default {
  name: 'PParsingDistributionBtn',
};
</script>
<script setup lang="ts">
import { inject } from 'vue';
import { EThreadEvents } from '@/../threadEvents';

import type { WalletsScanner, ChunkSizeStatisticsChecker } from '@/core/ton';

import type { IDistributionBtnEmits, IDistributionBtnProps, IChunkContainer } from '../types';
import { useDistributionBtn, ChunkContainersBuffer } from '../utils/useDistributionBtn';

const $props = defineProps<IDistributionBtnProps>();
const $emit = defineEmits<IDistributionBtnEmits>();

const MAX_CHUNKS_IN_BUFFER = 3;

const chunkContainersBuffer = new ChunkContainersBuffer();
const { onClick, distributionStatus, logStore, exposes, loadChunksInBuffer } = useDistributionBtn(
  'Parsing',
  distributeFromParsing,

  $props,
  $emit,

  chunkContainersBuffer,
  (loadedPromiseResolveWrapper) => ({
    id: null,
    chunk: null,
    loadedPromise: new Promise((resolve) => {
      loadedPromiseResolveWrapper.resolve = resolve;
    }),
  }),

  loadNextChunk,
  (chunkContainer: IChunkContainer) => {
    if (chunkContainer.chunk) {
      chunkSizeChecker.onChunkFetched(chunkContainer.chunk.length);
      window.ipcRenderer.send(EThreadEvents.SAVE_CHUNK, chunkContainer.chunk);
    }
  },
);

const walletsScanner = inject('walletsScanner') as InstanceType<typeof WalletsScanner>;
const chunkSizeChecker = inject('chunkSizeChecker') as InstanceType<typeof ChunkSizeStatisticsChecker>;

// eslint-disable-next-line func-style
function loadNextChunk(): Promise<void> {
  return loadChunksInBuffer(() => {
    return walletsScanner.scan();
  });
}

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

const loadChunksOnStarting = () => {
  for (let i = 0; i < MAX_CHUNKS_IN_BUFFER; ++i) {
    loadNextChunk();
  }
};

// eslint-disable-next-line func-style
async function distributeFromParsing() {
  loadChunksOnStarting();
}

defineExpose(exposes);
</script>

<template>
  <ZButton
    icon="network"
    @click="onClick"
    :class="{
      [`${$props.onAbortingClasses}`]: distributionStatus === 'shouldStop',
    }"
    :loading="$props.distributionMethod === 'Parsing'"
    :disabled="$props.distributionMethod !== null && $props.distributionMethod !== 'Parsing'"
    tip="Из парсера"
  />
</template>

<style scoped></style>
