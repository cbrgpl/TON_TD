<script lang="ts">
import ZFeedBackPanel, {
  useLogStore,
  type ULogTypes,
  useTransfersStatisticsStore,
} from '@components/singletones/ZFeedBackPanel';
import ZProgressBar from '@components/ux/ZProgressBar.vue';

import ZToasts from '@components/singletones/ZToasts';

import ZButton from '@components/buttons/ZButton.vue';

export default {
  name: 'TheApp',
  components: {
    ZFeedBackPanel,
    ZProgressBar,
  },
};
</script>

<script setup lang="ts">
import { ref } from 'vue';
import { LoremIpsum } from 'lorem-ipsum';

const lorem = new LoremIpsum({});
const logStore = useLogStore();
const transfersStatisticsStore = useTransfersStatisticsStore();

const buttonLoading = ref(false);
const addToast = async () => {
  const seed = Math.floor(Math.random() * 100);
  const wordsQnt = 20 + seed;

  const toastTypesDict: Record<number, ULogTypes> = {
    0: 'error',
    1: 'message',
    2: 'warn',
  };
  const type = toastTypesDict[seed % 3];
  const fixed = Math.floor(Math.random() * 100) % 10 >= 9.5;

  transfersStatisticsStore.updateStatistics({
    failed: seed % 2,
    successful: seed % 9,
  });

  logStore.log({
    content: lorem.generateWords(wordsQnt),
    type,
    fixed,
  });
};
</script>

<template>
  <div class="app">
    <ZToasts />
    <div class="app__inner">
      <div class="app__content">
        <ZButton
          :loading="buttonLoading"
          icon="warn"
          tip="Добавить тоаст"
          @click="addToast"
        >
          dasdas
        </ZButton>
      </div>
      <ZFeedBackPanel class="app__feed-back-panel" />
    </div>
  </div>
</template>

<style>
.app__inner {
  display: flex;

  width: 100vw;
  height: 100vh;
}

.app__content {
  flex-grow: 1;
}

.app__feed-back-panel {
  flex-shrink: 0;
  width: 40rem;
}
</style>
