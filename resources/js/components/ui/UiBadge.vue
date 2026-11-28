<script setup>
import { computed } from 'vue';
import { cva } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-[4px] px-2 py-0.5 text-xs font-medium whitespace-nowrap shrink-0 border leading-5',
  {
    variants: {
      variant: {
        success: 'bg-[var(--status-success-bg)] text-[var(--status-success-text)] border-[var(--status-success-text)]/25',
        warning: 'bg-[var(--status-warning-bg)] text-[var(--status-warning-text)] border-[var(--status-warning-text)]/25',
        error: 'bg-[var(--status-error-bg)] text-[var(--status-error-text)] border-[var(--status-error-text)]/25',
        info: 'bg-[var(--status-info-bg)] text-[var(--status-info-text)] border-[var(--status-info-text)]/25',
        neutral: 'bg-[#f1f4e8] text-[var(--ink-700)] border-[var(--border)]',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  },
);

const props = defineProps({
  variant: {
    type: String,
    default: 'neutral',
  },
  mono: {
    type: Boolean,
    default: false,
  },
  class: {
    type: String,
    default: '',
  },
});

const classes = computed(() =>
  cn(badgeVariants({ variant: props.variant }), props.mono ? 'font-mono text-[11px]' : '', props.class),
);
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>
