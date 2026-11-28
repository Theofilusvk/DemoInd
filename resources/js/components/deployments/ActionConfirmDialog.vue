<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { AlertTriangle, X } from 'lucide-vue-next';
import { UiButton } from '@/components/ui';

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  confirmLabel: {
    type: String,
    default: 'Lanjutkan',
  },
  confirmVariant: {
    type: String,
    default: 'primary',
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['confirm', 'cancel']);
const cancelBtnRef = ref(null);
let previouslyFocused = null;

function onKeydown(event) {
  if (event.key === 'Escape' && props.open && !props.loading) {
    emit('cancel');
  }
}

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      window.addEventListener('keydown', onKeydown);
      await nextTick();
      cancelBtnRef.value?.focus();
    } else {
      window.removeEventListener('keydown', onKeydown);
      await nextTick();
      previouslyFocused?.focus?.();
      previouslyFocused = null;
    }
  },
);

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        aria-hidden="true"
        class="fixed inset-0 bg-[#1C2417]/40"
        @click="!loading && emit('cancel')"
      />

      <div
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        class="relative z-10 w-full max-w-md rounded-[4px] border border-[var(--border)] bg-[var(--card)]"
      >
        <div class="flex items-start justify-between gap-3 border-b border-[var(--border)] px-5 py-4 bg-[#fafbf5]">
          <div class="flex items-center gap-2.5">
            <AlertTriangle
              class="h-4 w-4 shrink-0"
              :class="confirmVariant === 'danger' ? 'text-[var(--status-error-text)]' : 'text-[var(--status-warning-text)]'"
              aria-hidden="true"
            />
            <h2 class="text-sm font-semibold text-[var(--ink-900)]">
              {{ title }}
            </h2>
          </div>

          <button
            type="button"
            aria-label="Tutup dialog konfirmasi"
            :disabled="loading"
            class="h-7 w-7 inline-flex items-center justify-center rounded-[4px] text-[var(--ink-500)] hover:text-[var(--ink-900)] cursor-pointer disabled:opacity-50"
            @click="emit('cancel')"
          >
            <X class="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div class="px-5 py-4">
          <p class="text-sm text-[var(--ink-700)] leading-relaxed">
            {{ description }}
          </p>
        </div>

        <div class="flex items-center justify-end gap-2 border-t border-[var(--border)] bg-[#fafbf5] px-5 py-3">
          <button
            ref="cancelBtnRef"
            type="button"
            :disabled="loading"
            class="h-9 px-3.5 rounded-[4px] border border-[var(--border)] bg-[var(--card)] text-xs font-medium text-[var(--ink-900)] hover:border-[var(--ink-500)] transition-colors cursor-pointer disabled:opacity-50"
            @click="emit('cancel')"
          >
            Batal
          </button>

          <UiButton
            :variant="confirmVariant"
            size="sm"
            :loading="loading"
            @click="emit('confirm')"
          >
            {{ confirmLabel }}
          </UiButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>
