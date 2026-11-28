<script setup>
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-vue-next';
import { useToastStore } from '@/stores/toast';

const toastStore = useToastStore();

const variantMeta = {
  success: {
    icon: CheckCircle2,
    iconClass: 'text-[var(--status-success-text)]',
    bgClass: 'bg-[var(--status-success-bg)]',
    borderClass: 'border-[var(--status-success-text)]/35',
  },
  warning: {
    icon: AlertTriangle,
    iconClass: 'text-[var(--status-warning-text)]',
    bgClass: 'bg-[var(--status-warning-bg)]',
    borderClass: 'border-[var(--status-warning-text)]/35',
  },
  error: {
    icon: XCircle,
    iconClass: 'text-[var(--status-error-text)]',
    bgClass: 'bg-[var(--status-error-bg)]',
    borderClass: 'border-[var(--status-error-text)]/35',
  },
  info: {
    icon: Info,
    iconClass: 'text-[var(--status-info-text)]',
    bgClass: 'bg-[var(--status-info-bg)]',
    borderClass: 'border-[var(--status-info-text)]/35',
  },
};

function getMeta(variant) {
  return variantMeta[variant] || variantMeta.info;
}
</script>

<template>
  <div
    aria-live="polite"
    aria-atomic="false"
    class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-[calc(100vw-2rem)] max-w-sm pointer-events-none"
  >
    <div
      v-for="item in toastStore.items"
      :key="item.id"
      role="status"
      :class="[
        'pointer-events-auto rounded-[4px] border bg-[var(--card)] p-3.5 flex items-start gap-3',
        getMeta(item.variant).borderClass,
      ]"
    >
      <div
        :class="[
          'h-7 w-7 shrink-0 rounded-[4px] flex items-center justify-center',
          getMeta(item.variant).bgClass,
          getMeta(item.variant).iconClass,
        ]"
      >
        <component :is="getMeta(item.variant).icon" class="h-4 w-4" aria-hidden="true" />
      </div>

      <div class="min-w-0 flex-1">
        <p class="text-sm font-semibold text-[var(--ink-900)] leading-snug">
          {{ item.title }}
        </p>
        <p v-if="item.description" class="mt-0.5 text-xs text-[var(--ink-500)] leading-relaxed">
          {{ item.description }}
        </p>
      </div>

      <button
        type="button"
        aria-label="Tutup notifikasi"
        class="h-7 w-7 shrink-0 inline-flex items-center justify-center rounded-[4px] text-[var(--ink-500)] hover:text-[var(--ink-900)] hover:bg-[var(--bg)] transition-colors cursor-pointer"
        @click="toastStore.dismiss(item.id)"
      >
        <X class="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>
