<script lang="ts">
import ZError from './partials/ZError.vue';
import ZMessage from './partials/ZMessage.vue';
import ZWarn from './partials/ZWarn.vue';
import ZDownload from './partials/ZDownload.vue';
import ZUpload from './partials/ZUpload.vue';

export default {
  name: 'ZIcon',
  components: {
    ZError,
    ZMessage,
    ZWarn,
    ZDownload,
    ZUpload,
  },
};
</script>

<script setup lang="ts">
import { computed } from 'vue';

import { type UIcons } from './types';

const props = defineProps<{
  name: UIcons | null;
}>();

const iconComponentName = computed(() => {
  return props.name ? `Z${props.name.substring(0, 1).toUpperCase() + props.name.substring(1)}` : null;
});
</script>

<template>
  <component
    class="icon"
    :is="iconComponentName"
  ></component>
</template>

<style scoped>
.icon {
  width: 1.5rem;
  height: 1.5rem;
}
</style>
