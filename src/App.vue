<script lang="ts">
import ZFeedBackPanel from '@components/singletones/ZFeedBackPanel';
import ZToasts from '@components/singletones/ZToasts';

import TheMain from './views/TheMain.vue';

export default {
  name: 'TheApp',
  components: {
    ZFeedBackPanel,
    ZToasts,
    TheMain,
  },
};
</script>

<script setup lang="ts"></script>

<template>
  <div class="app">
    <ZToasts />
    <div class="app__inner">
      <div class="app__content">
        <TheMain />
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
