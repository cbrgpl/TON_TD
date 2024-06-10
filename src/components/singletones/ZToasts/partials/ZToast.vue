<script lang="ts">
import ZProgressBar from '@components/ux/ZProgressBar.vue';

export default {
  name: 'ZToast',
};
</script>

<script setup lang="ts">
import { ref } from 'vue';
import { useToastStore, type IToast } from '../model';

const $props = defineProps<{
  toast: IToast;
}>();

const toastStore = useToastStore();

const removeSelf = (id: number) => {
  toastStore.removeToast(id);
};

const toastHovered = ref(false);
</script>

<template>
  <li
    class="toasts__toast"
    @click="removeSelf($props.toast.id)"
    @mouseenter="toastHovered = true"
    @mouseleave="toastHovered = false"
  >
    <div class="toasts__toast-content">
      <h5
        class="toasts__toast-title"
        :class="{ 'toasts__toast-title--bordered': $props.toast.message }"
      >
        {{ $props.toast.title }}
      </h5>
      <div
        v-if="$props.toast.message"
        class="toasts__toast-message"
      >
        {{ $props.toast.message }}
      </div>
    </div>
    <ZProgressBar
      :time="$props.toast.life"
      :paused="toastHovered"
      :height="4"
      @finished="removeSelf($props.toast.id)"
    />
  </li>
</template>

<style scoped>
.toasts__toast {
  width: 25rem;
  text-align: left;
  pointer-events: all;
  cursor: pointer;
  user-select: none;
  margin-bottom: 0.5rem;

  background: var(--surface-upper-color);
  box-shadow: 0 0 5px rgb(0 0 0 / 20%);
}

.toasts__toast:last-child {
  margin-bottom: 0;
}

.toasts__toast-content {
  padding: 0.25rem 0.5rem;
}

.toasts__toast-title {
  font-size: 1.125rem;
  font-style: italic;
}

.toasts__toast-title--bordered {
  border-bottom: 1px solid var(--divider-color);
}
</style>
