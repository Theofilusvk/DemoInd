<script setup>
import { computed, reactive } from 'vue';
import { ArrowRight, Globe, Info } from 'lucide-vue-next';
import { UiButton, UiCard, UiInput } from '@/components/ui';
import { slugifyAppName, validateStepOne } from '@/utils/submissionHelpers';

const props = defineProps({
  appName: {
    type: String,
    default: '',
  },
  appDescription: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:appName', 'update:appDescription', 'next']);

const touched = reactive({
  appName: false,
  appDescription: false,
});

const validation = computed(() =>
  validateStepOne({
    appName: props.appName,
    appDescription: props.appDescription,
  }),
);

const previewSlug = computed(() => slugifyAppName(props.appName) || 'nama-aplikasi');

function handleSubmit() {
  touched.appName = true;
  touched.appDescription = true;
  if (!validation.value.valid) return;
  emit('next');
}
</script>

<template>
  <form class="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start" novalidate @submit.prevent="handleSubmit">
    <UiCard padding="lg" class="space-y-5">
      <div class="space-y-1 border-b border-[var(--border)] pb-4">
        <h2 class="text-base font-semibold text-[var(--ink-900)]">
          Langkah 1: Data aplikasi
        </h2>
        <p class="text-sm text-[var(--ink-500)]">
          Tentukan nama proyek dan deskripsi singkat agar aplikasi mudah dikenali di daftar deployment Anda.
        </p>
      </div>

      <UiInput
        :model-value="appName"
        label="Nama aplikasi"
        name="app_name"
        placeholder="Contoh: kasir-warung atau Portal Skripsi"
        hint="Huruf, angka, dan tanda hubung akan otomatis dirapikan menjadi alamat subdomain."
        :error="touched.appName ? validation.errors.appName : ''"
        required
        @update:model-value="emit('update:appName', $event)"
        @blur="touched.appName = true"
      />

      <div class="flex flex-col gap-1.5">
        <label
          for="submission-app-description"
          class="text-sm font-medium text-[var(--ink-900)] flex items-center gap-1"
        >
          <span>Deskripsi singkat</span>
          <span class="text-[var(--status-error-text)]" aria-hidden="true">*</span>
        </label>

        <textarea
          id="submission-app-description"
          name="app_description"
          rows="4"
          :value="appDescription"
          placeholder="Contoh: Aplikasi pencatatan transaksi harian, stok barang, dan laporan kas untuk warung kelontong."
          :aria-invalid="touched.appDescription && validation.errors.appDescription ? 'true' : undefined"
          :class="[
            'w-full rounded-[4px] bg-[var(--card)] px-3 py-2.5 text-sm text-[var(--ink-900)] placeholder:text-[var(--ink-300)] border transition-colors duration-150 resize-y',
            touched.appDescription && validation.errors.appDescription
              ? 'border-[var(--status-error-text)]'
              : 'border-[var(--border)] hover:border-[var(--ink-500)] focus:border-[var(--ink-900)]',
          ]"
          @input="emit('update:appDescription', $event.target.value)"
          @blur="touched.appDescription = true"
        />

        <p
          v-if="touched.appDescription && validation.errors.appDescription"
          role="alert"
          class="text-xs text-[var(--status-error-text)] font-medium"
        >
          {{ validation.errors.appDescription }}
        </p>
        <p v-else class="text-xs text-[var(--ink-500)]">
          Minimal 10 karakter. Deskripsi ini akan tampil pada daftar deployment dan panel detail.
        </p>
      </div>

      <div class="flex items-center justify-end border-t border-[var(--border)] pt-4">
        <UiButton type="submit" variant="primary" size="md">
          <span>Lanjut pilih stack</span>
          <ArrowRight class="h-4 w-4" aria-hidden="true" />
        </UiButton>
      </div>
    </UiCard>

    <aside class="rounded-[4px] border border-[var(--border)] bg-[#f7f9ef] p-5 space-y-4">
      <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--ink-700)]">
        <Globe class="h-4 w-4 text-[var(--ink-900)]" aria-hidden="true" />
        <span>Pratinjau alamat URL</span>
      </div>

      <div class="rounded-[4px] border border-[var(--border)] bg-[var(--card)] p-3.5 space-y-1">
        <p class="text-xs text-[var(--ink-500)]">Subdomain yang akan didaftarkan</p>
        <p class="font-mono text-sm font-semibold text-[var(--ink-900)] break-all">
          https://{{ previewSlug }}.domain.com
        </p>
      </div>

      <div class="space-y-2 border-t border-[var(--border)] pt-4 text-xs text-[var(--ink-700)] leading-relaxed">
        <p class="font-semibold text-[var(--ink-900)] inline-flex items-center gap-1.5">
          <Info class="h-3.5 w-3.5 text-[var(--ink-700)]" aria-hidden="true" />
          <span>Tips penamaan proyek</span>
        </p>
        <ul class="space-y-1.5 list-disc pl-4">
          <li>Gunakan nama singkat yang menggambarkan fungsi aplikasi, misalnya <code class="font-mono text-[var(--ink-900)]">kasir-warung</code>.</li>
          <li>Progres wizard otomatis tersimpan jika Anda perlu melihat tab Deployment terlebih dahulu.</li>
        </ul>
      </div>
    </aside>
  </form>
</template>
