<script lang="ts">
import ZToast from './partials/ZToast.vue';

export default {
  name: 'ZToasts',
};
</script>

<script setup lang="ts">
import { useToastStore } from './model';

const toastStore = useToastStore();
</script>

<template>
  <div class="toasts">
    <TransitionGroup
      name="toasts__list-animation"
      tag="ul"
    >
      <ZToast
        v-for="toast of toastStore.toasts"
        :key="toast.id"
        :toast="toast"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toasts {
  display: flex;
  justify-content: flex-end;

  position: fixed;
  right: 0;
  top: 0;
  z-index: 1000000;

  min-height: 100vh;
  width: 100vw;
  overflow-x: hidden;

  pointer-events: none;
  padding-right: 0.1rem;
}

.toasts__list-animation-move,
.toasts__list-animation-enter-active,
.toasts__list-animation-leave-active {
  transition: all 220ms;
}

.toasts__list-animation-enter-from,
.toasts__list-animation-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toasts__list-animation-leave-active {
  position: absolute;
}
</style>
