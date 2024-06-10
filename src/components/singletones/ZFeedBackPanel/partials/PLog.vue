<script lang="ts">
import ZIcon from '@components/icons';
import ZLoader from '@components/ux/ZLoader.vue';

export default {
  name: 'PLog',
};
</script>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ULogTypes } from '../model/logStore';

import { useToastStore } from '@components/singletones/ZToasts';

const $props = withDefaults(
  defineProps<{
    id: number;
    content: string;
    type: ULogTypes;
    fixed?: boolean;
  }>(),
  {
    fixed: false,
  },
);

const toastStore = useToastStore();

const iconName = computed(() => {
  switch ($props.type) {
    case 'error':
      return 'error';
    case 'message':
      return 'message';
    case 'warn':
      return 'warn';
    default:
      return null;
  }
});

const copyingInProccess = ref(false);

const copyLog = async () => {
  copyingInProccess.value = true;
  await navigator.clipboard.writeText($props.content);
  copyingInProccess.value = false;

  toastStore.show().message({
    title: 'Содержимое лога скопировано!',
    life: 2500,
  });
};
</script>

<template>
  <div
    @click="copyLog"
    class="feed-back-panel__log"
    :data-copying-in-process="copyingInProccess"
    :class="{
      'feed-back-panel__log--fixed': $props.fixed,
      'feed-back-panel__log--error': $props.type === 'error',
      'feed-back-panel__log--warn': $props.type === 'warn',
      'feed-back-panel__log--message': $props.type === 'message',
    }"
  >
    <h4 class="feed-back-panel__log-header">
      <ZIcon
        class="feed-back-panel__log-icon"
        :name="iconName"
      />
      <span>
        id: <span class="feed-back-panel__log-id"> {{ $props.id }} </span>
      </span>
    </h4>
    <div class="feed-back-panel__log-body">
      <span class="feed-back-panel__log-text-wrapper">
        {{ $props.content }}
      </span>
    </div>
    <ZLoader v-if="copyingInProccess" />
  </div>
</template>

<style scoped>
.feed-back-panel__log {
  border-bottom: 1px solid var(--divider-color);
  transition: border-botom-color 200ms ease-in;
  text-align: left;

  background: var(--feed-back-background);

  cursor: pointer;
  user-select: none;

  position: relative;

  --log-padding-x: 0.5rem;
  --log-padding-y: 0.5rem;
}

.feed-back-panel__log[data-copying-in-process='true'] {
  border-bottom: 1px solid var(--divider-color);
  cursor: default;
}

.feed-back-panel__log:last-child {
  border-bottom: none;
}

.feed-back-panel__log--fixed {
  position: sticky;
}

.feed-back-panel__log-header {
  display: flex;
  align-items: center;
  padding: var(--log-padding-y) var(--log-padding-x) 0.2rem;
  font-style: italic;
}

.feed-back-panel__log--warn {
  border-bottom-color: var(--warn-color);
}

.feed-back-panel__log--warn > .feed-back-panel__log-header {
  color: var(--warn-color);
}

.feed-back-panel__log--error {
  border-bottom-color: var(--danger-color);
}

.feed-back-panel__log--error > .feed-back-panel__log-header {
  color: var(--danger-color);
}

.feed-back-panel__log:hover > .feed-back-panel__log-header {
  text-decoration: underline;
}

.feed-back-panel__log-icon {
  margin-right: 0.5rem;
  width: 2rem !important;
  height: 2rem !important;
}

.feed-back-panel__log-id {
  font-weight: 600;
}

.feed-back-panel__log-body {
  padding: 0.5rem var(--log-padding-x) var(--log-padding-y) var(--log-padding-x);
  font-family: monospace;
}

.feed-back-panel__log-text-wrapper {
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
