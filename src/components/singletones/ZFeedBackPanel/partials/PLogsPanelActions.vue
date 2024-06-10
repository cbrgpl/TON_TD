<script lang="ts">
import ZButton from '@components/buttons/ZButton.vue';

export default {
  name: 'PLogsPanelActions',
};
</script>

<script setup lang="ts">
import { ref } from 'vue';
import { useLogStore } from '../model/logStore';

import { fileManager } from '@libs/fileManager';

const logStore = useLogStore();

const downloadLogsButtonLoading = ref(false);
const downloadLogs = async () => {
  downloadLogsButtonLoading.value = true;

  await new Promise((resolve) => {
    setTimeout(() => resolve(null), 3000 + Math.random() * 3500);
  });

  const currentDate = new Date().toISOString().slice(0, -5);
  fileManager.download(`${currentDate}_ton_ts_logs.json`, 'json', logStore.logs, 2);

  downloadLogsButtonLoading.value = false;
};
</script>

<template>
  <div class="feed-back-panel__actions-panel">
    <ZButton
      icon="download"
      :loading="downloadLogsButtonLoading"
      title="Скачать логи"
      @click="downloadLogs"
    />
  </div>
</template>

<style scoped>
.feed-back-panel__actions-panel {
  display: flex;
  justify-content: space-around;
  padding: 0.4rem 1rem;

  border-top: 1px solid var(--divider-color);
}
</style>
