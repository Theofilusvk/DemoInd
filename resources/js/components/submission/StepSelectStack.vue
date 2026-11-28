<script setup>
import { ArrowLeft, ArrowRight, Check, Layers } from 'lucide-vue-next';
import { UiBadge, UiButton, UiCard } from '@/components/ui';

defineProps({
  stacks: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  selectedSlug: {
    type: String,
    default: 'laravel',
  },
});

const emit = defineEmits(['update:selectedSlug', 'prev', 'next']);

function selectStack(stack) {
  if (!stack.is_active) return;
  emit('update:selectedSlug', stack.slug);
}
</script>

<template>
  <UiCard padding="lg" class="space-y-5">
    <div class="space-y-1 border-b border-[var(--border)] pb-4">
      <h2 class="text-base font-semibold text-[var(--ink-900)]">
        Langkah 2: Pilih stack teknologi
      </h2>
      <p class="text-sm text-[var(--ink-500)]">
        Pilih framework yang digunakan proyek Anda agar DemoInd menyiapkan panduan folder dan aturan validasi yang tepat.
      </p>
    </div>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="n in 4"
        :key="n"
        class="h-32 rounded-[4px] border border-[var(--border)] bg-[#f7f9ef] animate-pulse"
      />
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4" role="radiogroup" aria-label="Pilihan stack aplikasi">
      <button
        v-for="stack in stacks"
        :key="stack.slug"
        type="button"
        role="radio"
        :aria-checked="selectedSlug === stack.slug ? 'true' : 'false'"
        :disabled="!stack.is_active"
        :class="[
          'text-left rounded-[4px] border p-4 transition-colors flex flex-col justify-between gap-3',
          stack.is_active
            ? selectedSlug === stack.slug
              ? 'border-[var(--ink-900)] bg-[#fafcf2] cursor-pointer'
              : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--ink-500)] cursor-pointer'
            : 'border-[var(--border)] bg-[#f5f7ee] opacity-65 cursor-not-allowed',
        ]"
        @click="selectStack(stack)"
      >
        <div class="space-y-2">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-2.5 min-w-0">
              <span
                :class="[
                  'h-8 w-8 shrink-0 rounded-[4px] border flex items-center justify-center',
                  selectedSlug === stack.slug && stack.is_active
                    ? 'bg-[var(--ink-900)] text-[var(--yellow-300)] border-[var(--ink-900)]'
                    : 'bg-[var(--bg)] text-[var(--ink-700)] border-[var(--border)]',
                ]"
              >
                <Check v-if="selectedSlug === stack.slug && stack.is_active" class="h-4 w-4" aria-hidden="true" />
                <Layers v-else class="h-4 w-4" aria-hidden="true" />
              </span>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-[var(--ink-900)] truncate">
                  {{ stack.name }}
                </p>
                <p class="font-mono text-xs text-[var(--ink-500)] truncate">
                  {{ stack.version }}
                </p>
              </div>
            </div>

            <UiBadge :variant="stack.is_active ? 'success' : 'neutral'">
              {{ stack.is_active ? 'Aktif' : 'Segera' }}
            </UiBadge>
          </div>

          <p class="text-xs text-[var(--ink-700)] leading-relaxed">
            {{ stack.description }}
          </p>
        </div>

        <p v-if="!stack.is_active" class="text-[11px] font-medium text-[var(--ink-500)]">
          Dukungan stack ini sedang disiapkan dan belum dapat dipilih.
        </p>
        <p v-else class="text-[11px] font-medium text-[var(--status-success-text)]">
          {{ selectedSlug === stack.slug ? 'Dipilih untuk deployment ini' : 'Klik untuk memilih stack ini' }}
        </p>
      </button>
    </div>

    <div class="flex items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
      <UiButton variant="subtle" size="md" @click="emit('prev')">
        <ArrowLeft class="h-4 w-4" aria-hidden="true" />
        <span>Kembali</span>
      </UiButton>

      <UiButton variant="primary" size="md" :disabled="!selectedSlug" @click="emit('next')">
        <span>Lanjut ke susunan folder</span>
        <ArrowRight class="h-4 w-4" aria-hidden="true" />
      </UiButton>
    </div>
  </UiCard>
</template>
