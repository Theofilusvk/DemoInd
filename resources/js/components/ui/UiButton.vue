<script setup>
import { computed } from 'vue';
import { cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-vue-next';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-[4px] font-medium whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--ink-900)] text-white hover:bg-[var(--ink-700)] border border-[var(--ink-900)]',
        secondary: 'bg-[var(--yellow-300)] text-[var(--ink-900)] hover:bg-[var(--yellow-500)] border border-[var(--ink-900)]/15',
        outline: 'bg-transparent text-[var(--ink-900)] border border-[var(--ink-900)] hover:bg-[var(--green-100)]/60',
        subtle: 'bg-[var(--card)] text-[var(--ink-900)] border border-[var(--border)] hover:border-[var(--ink-500)]',
        ghost: 'bg-transparent text-[var(--ink-700)] border border-transparent hover:bg-[var(--border)]/45 hover:text-[var(--ink-900)]',
        danger: 'bg-[var(--status-error-bg)] text-[var(--status-error-text)] border border-[var(--status-error-text)]/35 hover:bg-[#f6d3d0]',
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
  },
  size: {
    type: String,
    default: 'md',
  },
  type: {
    type: String,
    default: 'button',
  },
  as: {
    type: [String, Object],
    default: 'button',
  },
  to: {
    type: [String, Object],
    default: undefined,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  class: {
    type: String,
    default: '',
  },
});

const classes = computed(() =>
  cn(buttonVariants({ variant: props.variant, size: props.size }), props.class),
);
</script>

<template>
  <component
    :is="to ? 'RouterLink' : as"
    :to="to"
    :type="!to && as === 'button' ? type : undefined"
    :disabled="!to ? disabled || loading : undefined"
    :aria-busy="loading ? 'true' : undefined"
    :class="classes"
  >
    <Loader2 v-if="loading" class="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
    <slot />
  </component>
</template>
