<script setup>
import { computed, ref, useId } from 'vue';
import { Eye, EyeOff } from 'lucide-vue-next';
import { cn } from '@/utils/cn';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  hint: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  mono: {
    type: Boolean,
    default: false,
  },
  passwordToggle: {
    type: Boolean,
    default: false,
  },
  autocomplete: {
    type: String,
    default: undefined,
  },
  class: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'blur', 'focus']);

const generatedId = useId();
const inputId = computed(() => props.id || `input-${generatedId}`);
const helpId = computed(() => `${inputId.value}-help`);
const errorId = computed(() => `${inputId.value}-error`);
const showPassword = ref(false);

const resolvedType = computed(() => {
  if (props.type === 'password' && props.passwordToggle) {
    return showPassword.value ? 'text' : 'password';
  }
  return props.type;
});

const describedBy = computed(() => {
  const ids = [];
  if (props.error) ids.push(errorId.value);
  if (props.hint) ids.push(helpId.value);
  return ids.length ? ids.join(' ') : undefined;
});
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label
      v-if="label"
      :for="inputId"
      class="text-sm font-medium text-[var(--ink-900)] flex items-center gap-1"
    >
      <span>{{ label }}</span>
      <span v-if="required" class="text-[var(--status-error-text)]" aria-hidden="true">*</span>
    </label>

    <div class="relative">
      <input
        :id="inputId"
        :name="name || undefined"
        :type="resolvedType"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="describedBy"
        :class="cn(
          'w-full h-10 rounded-[4px] bg-[var(--card)] px-3 text-sm text-[var(--ink-900)] placeholder:text-[var(--ink-300)] border transition-colors duration-150 disabled:bg-[#f2f4ea] disabled:text-[var(--ink-500)] disabled:cursor-not-allowed',
          error
            ? 'border-[var(--status-error-text)]'
            : 'border-[var(--border)] hover:border-[var(--ink-500)] focus:border-[var(--ink-900)]',
          mono ? 'font-mono text-[13px]' : 'font-sans',
          type === 'password' && passwordToggle ? 'pr-10' : '',
          props.class,
        )"
        @input="emit('update:modelValue', $event.target.value)"
        @blur="emit('blur', $event)"
        @focus="emit('focus', $event)"
      />

      <button
        v-if="type === 'password' && passwordToggle"
        type="button"
        :aria-label="showPassword ? 'Sembunyikan nilai' : 'Lihat nilai'"
        :aria-pressed="showPassword ? 'true' : 'false'"
        class="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 inline-flex items-center justify-center rounded-[4px] text-[var(--ink-500)] hover:text-[var(--ink-900)] hover:bg-[var(--bg)] transition-colors cursor-pointer"
        @click="showPassword = !showPassword"
      >
        <EyeOff v-if="showPassword" class="h-4 w-4" aria-hidden="true" />
        <Eye v-else class="h-4 w-4" aria-hidden="true" />
      </button>
    </div>

    <p v-if="error" :id="errorId" role="alert" class="text-xs text-[var(--status-error-text)] font-medium">
      {{ error }}
    </p>
    <p v-else-if="hint" :id="helpId" class="text-xs text-[var(--ink-500)]">
      {{ hint }}
    </p>
  </div>
</template>
