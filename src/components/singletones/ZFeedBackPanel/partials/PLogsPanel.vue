<script lang="ts">
import PLog from './PLog.vue';

export default {
  name: 'PLogsPanel',
};
</script>

<script setup lang="ts">
import { useLogStore } from '../model';

const logStore = useLogStore();
</script>

<template>
  <section class="feed-back-panel__logs-panel">
    <PLog
      v-for="log of logStore.logs"
      :key="log.id"
      :id="log.id"
      :content="log.content"
      :type="log.type"
      :fixed="log.fixed"
    />
  </section>
</template>

<style scoped>
.feed-back-panel__logs-panel {
  display: flex;
  flex-direction: column;

  overflow: auto;
}
</style>
