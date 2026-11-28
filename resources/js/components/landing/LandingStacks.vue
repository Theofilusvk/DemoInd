<script setup>
import { computed, onMounted, ref } from 'vue';
import { Check, ArrowRight } from 'lucide-vue-next';
import { UiBadge, UiButton } from '@/components/ui';
import { api, MOCK_STACKS } from '@/services/api';

const stacks = ref(MOCK_STACKS);

const activeStack = computed(() => stacks.value.find((item) => item.is_active) || stacks.value[0]);
const upcomingStacks = computed(() => stacks.value.filter((item) => !item.is_active));

const laravelAutomation = [
  'Validasi 10 folder & file wajib sebelum proses build',
  'Menjalankan composer install --no-dev secara otomatis',
  'Migrasi database dan penyimpanan .env terenkripsi',
  'Subdomain aktif otomatis (namaapp.domain.com)',
];

onMounted(async () => {
  stacks.value = await api.getStacks();
});
</script>

<template>
  <section id="stack" aria-labelledby="heading-stack" class="scroll-mt-16 bg-[var(--bg)]">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 py-16 lg:py-20 space-y-12">
      <div class="max-w-2xl space-y-2.5">
        <p class="font-mono text-xs text-[var(--ink-500)]">Dukungan Stack</p>
        <h2 id="heading-stack" class="text-2xl sm:text-3xl font-semibold text-[var(--ink-900)]">
          Fokus pada Laravel terlebih dahulu, stack lain menyusul bertahap
        </h2>
        <p class="text-sm sm:text-base text-[var(--ink-700)] leading-relaxed">
          Setiap stack memiliki aturan folder dan pemeriksaan khusus agar panduan tetap akurat dan relevan bagi pemula.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <!-- Stack aktif: Laravel -->
        <div
          v-if="activeStack"
          class="lg:col-span-5 rounded-[4px] border border-[var(--ink-900)] bg-[var(--card)] p-6 flex flex-col justify-between gap-6"
        >
          <div class="space-y-4">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="text-xl font-semibold text-[var(--ink-900)]">
                  {{ activeStack.name }}
                </h3>
                <p class="mt-0.5 font-mono text-xs text-[var(--ink-500)]">
                  {{ activeStack.version }}
                </p>
              </div>
              <UiBadge variant="success">Aktif</UiBadge>
            </div>

            <p class="text-sm text-[var(--ink-700)] leading-relaxed">
              {{ activeStack.description }}
            </p>

            <ul class="border-t border-[var(--border)] pt-4 space-y-2.5 text-sm text-[var(--ink-900)]">
              <li
                v-for="point in laravelAutomation"
                :key="point"
                class="flex items-start gap-2.5"
              >
                <Check class="h-4 w-4 text-[var(--status-success-text)] shrink-0 mt-0.5" aria-hidden="true" />
                <span>{{ point }}</span>
              </li>
            </ul>
          </div>

          <div class="pt-2">
            <UiButton to="/register" variant="primary" class="w-full sm:w-auto">
              <span>Mulai deploy Laravel</span>
              <ArrowRight class="h-4 w-4" aria-hidden="true" />
            </UiButton>
          </div>
        </div>

        <!-- Stack lainnya: Segera -->
        <div class="lg:col-span-7 rounded-[4px] border border-[var(--border)] bg-[var(--card)] divide-y divide-[var(--border)] flex flex-col justify-between">
          <div class="px-6 py-4 bg-[#f7f9ef] flex items-center justify-between gap-3">
            <h3 class="text-sm font-semibold text-[var(--ink-900)]">
              Stack dalam persiapan
            </h3>
            <span class="font-mono text-xs text-[var(--ink-500)] tabular-nums">
              {{ upcomingStacks.length }} stack
            </span>
          </div>

          <ul class="divide-y divide-[var(--border)] flex-1">
            <li
              v-for="stack in upcomingStacks"
              :key="stack.id"
              class="px-6 py-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
            >
              <div class="space-y-1 min-w-0">
                <div class="flex items-baseline gap-2.5 flex-wrap">
                  <p class="text-base font-semibold text-[var(--ink-700)]">
                    {{ stack.name }}
                  </p>
                  <span class="font-mono text-xs text-[var(--ink-500)]">
                    {{ stack.version }}
                  </span>
                </div>
                <p class="text-sm text-[var(--ink-500)] leading-relaxed">
                  {{ stack.description }}
                </p>
              </div>
              <UiBadge variant="neutral" class="self-start">Segera</UiBadge>
            </li>
          </ul>
        </div>
      </div>

      <!-- Strip konversi akhir yang tenang dan rata kiri -->
      <div class="rounded-[4px] border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div class="space-y-1.5 max-w-xl">
          <h3 class="text-lg font-semibold text-[var(--ink-900)]">
            Siap mencoba deployment pertama Anda?
          </h3>
          <p class="text-sm text-[var(--ink-700)]">
            Buat akun untuk mengakses panduan struktur folder, validator arsip .zip, dan dashboard deployment DemoInd.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3 shrink-0">
          <UiButton to="/register" variant="primary">
            Daftar sekarang
          </UiButton>
          <UiButton to="/login" variant="outline">
            Masuk
          </UiButton>
        </div>
      </div>
    </div>
  </section>
</template>
