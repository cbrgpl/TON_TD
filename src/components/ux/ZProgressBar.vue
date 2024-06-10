<script lang="ts">
export default {
  name: 'ZProgressBar',
};
</script>

<script setup lang="ts">
import { computed } from 'vue';

const $props = withDefaults(
  defineProps<{
    time: number;
    paused?: boolean;
    color?: 'primary' | 'safety' | 'danger' | 'warn';
    height?: 2 | 4 | 6;
    tip?: string | null;
  }>(),
  {
    tip: null,
    height: 2,
    color: 'primary',
    paused: false,
  },
);

const $emit = defineEmits<{
  finished: [];
}>();

const stylesHeight = computed(() => $props.height / 16 + 'rem');
const stylesTime = computed(() => $props.time + 'ms');
</script>

<template>
  <div class="progress-bar">
    <div
      class="progress-bar__progress"
      :class="{
        'progress-bar__progress--primary': $props.color === 'primary',
        'progress-bar__progress--danger': $props.color === 'danger',
        'progress-bar__progress--safety': $props.color === 'safety',
        'progress-bar__progress--warn': $props.color === 'warn',
      }"
      @animationend="$emit('finished')"
      :data-paused="$props.paused"
    />
    <span class="progress-bar__tip">
      {{ $props.tip }}
    </span>
  </div>
</template>

<style scoped>
.progress-bar {
  width: 100%;
  height: v-bind(stylesHeight);

  position: relative;
  background: var(--surface-upper-color);
  box-shadow: 0 1px 2rem rgb(0 0 0 / 30%);
}

.progress-bar__progress {
  height: 100%;

  animation-name: progress-bar-animation;
  animation-duration: v-bind(stylesTime);
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

.progress-bar__progress--primary {
  background: var(--primary-color);
}

.progress-bar__progress--safety {
  background: var(--safety-color);
}

.progress-bar__progress--danger {
  background: var(--danger-color);
}

.progress-bar__progress--warn {
  background: var(--warn-color);
}

.progress-bar__progress[data-paused='true'] {
  animation-play-state: paused;
}

@keyframes progress-bar-animation {
  0% {
    width: 0;
  }

  100% {
    width: 100%;
  }
}

.progress-bar__tip {
  position: absolute;
  right: 50%;
  top: 100%;
  transform: translateX(50%) translateY(0.25rem);
}
</style>
