<script lang="ts">
import ZLoader from '@/components/ux/ZLoader.vue';
import ZIcon from '@components/icons';

export default {
  name: 'ZButton',
};
</script>

<script setup lang="ts">
import type { UIcons } from '@components/icons';

const $props = withDefaults(
  defineProps<{
    loading?: boolean;
    tip?: string;
    icon?: UIcons | null;
    variant?: 'default' | 'danger';
  }>(),
  {
    tip: '',
    icon: null,
    variant: 'default',
  },
);
</script>

<template>
  <button
    class="button"
    :class="{
      'button--danger': $props.variant === 'danger',
    }"
    :data-loading="$props.loading"
    :title="$props.tip"
  >
    <div
      class="button__content"
      :class="{
        'button__content--hidden': $props.loading,
      }"
    >
      <ZIcon
        class="button__icon"
        v-if="$props.icon"
        :name="$props.icon"
      />
      <slot />
    </div>
    <ZLoader
      class="button__loader"
      v-if="loading"
    />
  </button>
</template>

<style scoped>
.button {
  border: 1px solid var(--divider-color);

  color: var(--font-main-color);
  background: transparent;

  position: relative;

  cursor: pointer;
  padding: 0.2rem;
}

.button--danger {
  color: var(--danger-color);
}

.button:hover {
  text-decoration: underline;
}

.button[data-loading='true'] {
  cursor: progress;
  pointer-events: none;
}

.button__content {
  display: flex;
  align-items: center;
  justify-content: center;

  flex-wrap: nowrap;
}

.button:active > .button__content {
  transform: scale(0.95);
}

.button__content--hidden {
  visibility: hidden;
}

.button__loader {
  font-size: 0.625rem;
}
</style>
