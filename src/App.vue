<script lang="ts">
import ZFeedBackPanel, { useLogStore } from '@components/singletones/ZFeedBackPanel';
import ZToasts from '@components/singletones/ZToasts';

import TheMain from './views/TheMain/TheMain.vue';

export default {
  name: 'TheApp',
  components: {
    ZFeedBackPanel,
    ZToasts,
    TheMain,
  },
};
</script>

<script setup lang="ts">
import { EThreadEvents } from '@/../threadEvents';
import type { IpcRendererEvent } from 'electron';
const logStore = useLogStore();

window.ipcRenderer.on(EThreadEvents.MAIN_PROCESS_ERROR, (event: IpcRendererEvent, error: string) => {
  logStore.log({
    type: 'error',
    content: `Произошла внутреняя ошибка в работе программы:
<strong>${error}</strong>`,
  });
});
</script>

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
