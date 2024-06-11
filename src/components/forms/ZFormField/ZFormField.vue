<script lang="ts">
export default {
  name: 'ZFormField',
};
</script>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';

import type { IFormFieldProps } from './types';

const $props = withDefaults(defineProps<IFormFieldProps>(), {
  error: false,
  message: null,
});

const formFieldInputSlotStyles = computed(() => {
  const styles: CSSProperties = {
    borderColor: 'var(--primary-color)',
    borderWidth: '1px',
    padding: '0.25rem',
    background: 'var(--surface-upper-color)',
    color: 'var(--font-main-color)',
    fontSize: '0.875rem',
  };

  if ($props.error) {
    styles.borderColor = 'var(--danger-color)';
  }

  return styles;
});

defineSlots<{
  input(attrs: { styles: CSSProperties; error: boolean }): any;
}>();
</script>

<template>
  <label
    class="form-field"
    :data-error="$props.error"
  >
    <label class="form-field__label">{{ $props.label }}</label>
    <slot
      name="input"
      :styles="formFieldInputSlotStyles"
      :error="$props.error"
    />
    <h5 class="form-field__message">{{ $props.message }}</h5>
  </label>
</template>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
}

.form-field__label {
  font-size: 0.875rem;
}

.form-field__message {
  font-size: 0.875rem;
  font-family: monospace;
}

.form-field[data-error='true'] > .form-field__message {
  color: var(--danger-color);
}
</style>
