<script lang="ts">
import PTopBar from './partials/PTopBar.vue';
import PLogsPanel from './partials/PLogsPanel.vue';
import PLogsPanelActions from './partials/PLogsPanelActions.vue';

export default {
  name: 'ZFeedBackPanel',
  components: {
    PTopBar,
    PLogsPanel,
    PLogsPanelActions,
  },
};
</script>

<script setup lang="ts"></script>

<template>
  <div class="feed-back-panel">
    <PTopBar class="feed-back-panel__auxiliary-area" />
    <PLogsPanel class="feed-back-panel__main-area" />
    <PLogsPanelActions cllass="feed-back-panel__auxiliary-area " />
  </div>
</template>

<style scoped>
.feed-back-panel {
  display: flex;
  flex-direction: column;

  --feed-back-background: var(--surface-upper-color);

  border: 1px solid var(--divider-color);
  background: var(--surface-color);
}

.feed-back-panel__main-area {
  flex-grow: 1;
}

.feed-back-panel__auxiliary-area {
  flex-shrink: 0;
}
</style>
