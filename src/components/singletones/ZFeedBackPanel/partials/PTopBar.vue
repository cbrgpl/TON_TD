<script lang="ts">
export default {
  name: 'PTopBar',
};
</script>

<script setup lang="ts">
import { useTransfersStatisticsStore } from '../model';
const transfersStatisticsStore = useTransfersStatisticsStore();
</script>

<template>
  <section class="feed-back-panel__top-bar">
    <div class="feed-back-panel__counts-wrapper">
      <span
        class="feed-back-panel__count feed-back-panel__count--successful"
        title="Количество успешных транзакций"
      >
        {{ transfersStatisticsStore.transfersStatistics.successful }}
      </span>
      <span class="feed-back-panel__count-splitter"> / </span>
      <span
        class="feed-back-panel__count feed-back-panel__count--failed"
        title="Количество неуспешных транзакций"
      >
        {{ transfersStatisticsStore.transfersStatistics.failed }}
      </span>
      <span class="feed-back-panel__count-splitter"> / </span>
      <span
        class="feed-back-panel__count feed-back-panel__count--total"
        title="Общее количество транзакций"
      >
        {{ transfersStatisticsStore.transfersStatistics.total }}
      </span>
    </div>
  </section>
</template>

<style scoped>
.feed-back-panel__top-bar {
  border-bottom: 2px solid var(--divider-color);
  background: var(--feed-back-background);
  user-select: none;
}

.feed-back-panel__counts-wrapper {
  width: 35%;
  margin: auto;

  display: flex;
  align-items: center;
  justify-content: center;
}

.feed-back-panel__count {
  font-weight: 600;
  font-size: 1rem;
  min-width: 3.75rem;
  text-align: center;
}

.feed-back-panel__count-splitter {
  padding: 0 0.75rem;
  font-weight: 600;
  font-size: 1.5rem;
}

.feed-back-panel__count--successful {
  color: var(--safety-color);
}

.feed-back-panel__count--failed {
  color: var(--danger-color);
}

.feed-back-panel__count--total {
  color: var(--divider-color);
}
</style>
