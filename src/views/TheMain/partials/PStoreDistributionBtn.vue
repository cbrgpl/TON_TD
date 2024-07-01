<script lang="ts">
import ZButton from '@components/buttons/ZButton.vue';

export default {
  name: 'PStoreDistributionBtn',
};
</script>
<script setup lang="ts">
import { computed } from 'vue';

import type { IDistributionBtnEmits, IDistributionBtnProps } from '../types';
import { useDistributionBtn, ChunkContainersBuffer } from '../utils/useDistributionBtn';
import { useStoreDistributionBtn } from '../utils/useStoreDistributionBtn';

const $props = defineProps<IDistributionBtnProps>();
const $emit = defineEmits<IDistributionBtnEmits>();

const MAX_CHUNKS_QNT_IN_BUFFER = 2;

const isDistributionWorking = computed(() => {
  return $props.distributionMethod === 'Store';
});

const chunkContainersBuffer = new ChunkContainersBuffer();
const { loadChunkFromStore, chunksStoreEmpty } = useStoreDistributionBtn(isDistributionWorking);
const { onClick, distributionStatus, exposes, loadChunksInBuffer } = useDistributionBtn(
  'Store',
  distributeFromStore,

  $props,
  $emit,

  chunkContainersBuffer,
  (loadedPromiseResolveWrapper) => ({
    chunk: null,
    id: null,
    loadedPromise: new Promise((resolve) => {
      loadedPromiseResolveWrapper.resolve = resolve;
    }),
  }),

  loadStoreChunksUsingComposable,
  () => {},

  () => {
    chunksStoreEmpty.value = false;
  },
);

// eslint-disable-next-line func-style
function loadStoreChunksUsingComposable(): void | Promise<void> {
  if (chunksStoreEmpty.value) {
    if (distributionStatus.value !== 'shouldStop') {
      distributionStatus.value = 'shouldStop';
    }

    return;
  }

  return loadChunksInBuffer(() => {
    return loadChunkFromStore();
  });
}

const loadChunksOnInit = () => {
  for (let i = 0; i < MAX_CHUNKS_QNT_IN_BUFFER; ++i) {
    loadStoreChunksUsingComposable();
  }
};

// eslint-disable-next-line func-style
function distributeFromStore() {
  loadChunksOnInit();
}

defineExpose(exposes);
</script>

<template>
  <ZButton
    icon="database"
    @click="onClick"
    :loading="$props.distributionMethod === 'Store'"
    :class="{
      [`${$props.onAbortingClasses}`]: distributionStatus === 'shouldStop',
    }"
    :disabled="$props.distributionMethod !== null && $props.distributionMethod !== 'Store'"
    tip="Из хранилища"
  />
</template>
