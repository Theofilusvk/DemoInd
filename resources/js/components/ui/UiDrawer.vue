<script setup>
import { onBeforeUnmount, watch, ref, nextTick } from 'vue';
import { X } from 'lucide-vue-next';

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['close']);
const closeBtnRef = ref(null);
let previouslyFocused = null;

function handleKeydown(event) {
  if (event.key === 'Escape' && props.open) {
    emit('close');
  }
}

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      window.addEventListener('keydown', handleKeydown);
      document.body.style.overflow = 'hidden';
      await nextTick();
      closeBtnRef.value?.focus();
    } else {
      window.removeEventListener('keydown', handleKeydown);
      document.body.style.overflow = '';
      await nextTick();
      previouslyFocused?.focus?.();
      previouslyFocused = null;
    }
  },
);

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex justify-end">
      <!-- Backdrop flat tanpa blur/glassmorphism -->
      <div
        aria-hidden="true"
        class="fixed inset-0 bg-[#1C2417]/40"
        @click="emit('close')"
      />

      <aside
        role="dialog"
        aria-modal="true"
        :aria-label="title || 'Panel detail'"
        class="relative z-10 flex h-full w-full max-w-xl flex-col bg-[var(--card)] border-l border-[var(--border)]"
      >
        <header class="flex items-start justify-between gap-4 border-b border-[var(--border)] px-5 py-4 bg-[#fafbf5]">
          <div class="min-w-0">
            <h2 class="text-base font-semibold text-[var(--ink-900)] truncate">
              {{ title }}
            </h2>
            <p v-if="subtitle" class="mt-0.5 text-xs text-[var(--ink-500)] font-mono truncate">
              {{ subtitle }}
            </p>
          </div>

          <button
            ref="closeBtnRef"
            type="button"
            aria-label="Tutup panel"
            class="h-8 w-8 shrink-0 inline-flex items-center justify-center rounded-[4px] border border-[var(--border)] bg-[var(--card)] text-[var(--ink-700)] hover:text-[var(--ink-900)] hover:border-[var(--ink-500)] transition-colors cursor-pointer"
            @click="emit('close')"
          >
            <X class="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        <div class="flex-1 overflow-y-auto p-5">
          <slot />
        </div>

        <footer
          v-if="$slots.footer"
          class="border-t border-[var(--border)] bg-[#fafbf5] px-5 py-3.5 flex items-center justify-end gap-2"
        >
          <slot name="footer" />
        </footer>
      </aside>
    </div>
  </Teleport>
</template>
