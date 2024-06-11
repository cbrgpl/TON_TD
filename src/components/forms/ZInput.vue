<script lang="ts">
import ZFormField, { type IFormFieldProps } from './ZFormField';

export default {
  name: 'ZInput',
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
</script>

<template>
  <ZFormField v-bind="$props">
    <template #input="{ styles }">
      <input
        class="input__input"
        :style="styles"
        type="text"
        :placeholder="$props.placeholder"
      />
    </template>
  </ZFormField>
</template>

<style scoped>
.input {
  display: flex;
  flex-direction: column;
}

.input > * {
  margin-bottom: 0.25rem;
}

.input > *:last-child {
  margin-bottom: 0;
}

.input__input {
  border: none;
  border-bottom-style: solid;
}
</style>
