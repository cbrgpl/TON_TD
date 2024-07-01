<script lang="ts">
import ZFormField, { type IFormFieldProps } from './ZFormField';

export default {
  name: 'ZTextarea',
  components: {
    ZFormField,
  },
};
</script>

<script setup lang="ts">
const $props = withDefaults(
  defineProps<
    {
      modelValue: string | null;
      placeholder?: string;
    } & IFormFieldProps
  >(),
  {
    placeholder: '',
  },
);

const $emit = defineEmits<{
  'update:modelValue': [v: string];
}>();
</script>

<template>
  <ZFormField v-bind="$props">
    <template #input="{ styles }">
      <textarea
        class="textarea__textarea"
        :style="styles"
        :value="$props.modelValue"
        @input="$emit('update:modelValue', ($event.target as any).value)"
        rows="8"
        :placeholder="$props.placeholder"
      />
    </template>
  </ZFormField>
</template>

<style scoped>
.textarea__textarea {
  border: none;
  border-bottom-style: solid;
}
</style>
