<script setup>
import { computed, ref } from 'vue';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileArchive,
  RefreshCw,
  Wrench,
  XCircle,
} from 'lucide-vue-next';
import { UiBadge, UiButton, UiCard, UiDropzone } from '@/components/ui';
import { api } from '@/services/api';
import { formatValidationSummary, slugifyAppName } from '@/utils/submissionHelpers';

const props = defineProps({
  appName: {
    type: String,
    default: '',
  },
  uploadedFile: {
    type: Object,
    default: null,
  },
  validationResult: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits([
  'file-selected',
  'validated',
  'reset-upload',
  'prev',
  'next',
]);

const uploading = ref(false);
const progress = ref(0);
const dropzoneError = ref('');

const summaryText = computed(() =>
  props.validationResult ? formatValidationSummary(props.validationResult.summary) : '',
);

async function runUploadAndValidate(fileMeta, forceMode = 'auto') {
  dropzoneError.value = '';
  emit('file-selected', fileMeta);
  uploading.value = true;
  progress.value = 18;

  try {
    await new Promise((resolve) => setTimeout(resolve, 140));
    progress.value = 54;

    await new Promise((resolve) => setTimeout(resolve, 140));
    progress.value = 88;

    const result = await api.validateSubmissionArchive(fileMeta.name, {
      forceMode,
      appName: props.appName,
    });

    progress.value = 100;
    emit('validated', result);
  } catch {
    progress.value = 0;
    dropzoneError.value = 'Gagal memproses validasi arsip .zip. Periksa koneksi Anda lalu coba unggah kembali.';
  } finally {
    uploading.value = false;
  }
}

function handleFileSelect(file) {
  runUploadAndValidate({ name: file.name, size: file.size }, 'auto');
}

function handleUseSample(mode) {
  const slug = slugifyAppName(props.appName) || 'proyek-laravel';
  const fileName = mode === 'fail' ? `${slug}-dengan-env-gagal.zip` : `${slug}-siap-deploy.zip`;
  const size = mode === 'fail' ? 8_420_000 : 4_180_000;
  runUploadAndValidate({ name: fileName, size }, mode);
}

function handleReupload() {
  progress.value = 0;
  dropzoneError.value = '';
  emit('reset-upload');
}
</script>

<template>
  <UiCard padding="lg" class="space-y-5">
    <div class="space-y-1 border-b border-[var(--border)] pb-4">
      <h2 class="text-base font-semibold text-[var(--ink-900)]">
        Langkah 4: Upload dan validasi arsip .zip
      </h2>
      <p class="text-sm text-[var(--ink-500)]">
        Unggah arsip proyek Laravel Anda. DemoInd akan memeriksa seluruh file wajib, folder inti, dan berkas sensitif sebelum proses deploy.
      </p>
    </div>

    <div class="space-y-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <p class="text-xs font-medium text-[var(--ink-700)]">
          Unggah file <code class="font-mono text-[var(--ink-900)]">.zip</code> lokal Anda atau jalankan simulasi arsip:
        </p>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            :disabled="uploading"
            class="h-7 px-2.5 inline-flex items-center gap-1.5 rounded-[4px] border border-[var(--border)] bg-[var(--card)] text-xs font-medium text-[var(--ink-900)] hover:border-[var(--ink-900)] transition-colors cursor-pointer disabled:opacity-50"
            @click="handleUseSample('pass')"
          >
            <FileArchive class="h-3.5 w-3.5 text-[var(--status-success-text)]" aria-hidden="true" />
            <span>Simulasi arsip valid</span>
          </button>

          <button
            type="button"
            :disabled="uploading"
            class="h-7 px-2.5 inline-flex items-center gap-1.5 rounded-[4px] border border-[var(--border)] bg-[var(--card)] text-xs font-medium text-[var(--ink-900)] hover:border-[var(--ink-900)] transition-colors cursor-pointer disabled:opacity-50"
            @click="handleUseSample('fail')"
          >
            <FileArchive class="h-3.5 w-3.5 text-[var(--status-error-text)]" aria-hidden="true" />
            <span>Simulasi arsip gagal (.env)</span>
          </button>
        </div>
      </div>

      <UiDropzone
        :selected-file="uploadedFile"
        :uploading="uploading"
        :progress="progress"
        :error-message="dropzoneError"
        @select="handleFileSelect"
        @clear="handleReupload"
        @error="(msg) => (dropzoneError = msg)"
      />
    </div>

    <!-- Panel hasil validasi -->
    <section
      v-if="validationResult && !uploading"
      aria-label="Hasil validasi arsip"
      class="rounded-[4px] border border-[var(--border)] overflow-hidden"
    >
      <div
        :class="[
          'px-4 py-3 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-2',
          validationResult.passed ? 'bg-[var(--status-success-bg)]/55' : 'bg-[var(--status-error-bg)]/65',
        ]"
      >
        <div class="flex items-center gap-2.5">
          <CheckCircle2
            v-if="validationResult.passed"
            class="h-4 w-4 text-[var(--status-success-text)] shrink-0"
            aria-hidden="true"
          />
          <XCircle
            v-else
            class="h-4 w-4 text-[var(--status-error-text)] shrink-0"
            aria-hidden="true"
          />
          <p class="text-sm font-semibold text-[var(--ink-900)]">
            {{ validationResult.passed ? 'Validasi struktur lulus' : 'Validasi menemukan masalah yang wajib diperbaiki' }}
          </p>
        </div>

        <span class="font-mono text-xs font-semibold text-[var(--ink-900)] tabular-nums">
          {{ summaryText }}
        </span>
      </div>

      <ul class="divide-y divide-[var(--border)] bg-[var(--card)]">
        <li
          v-for="(item, index) in validationResult.items"
          :key="`${item.rule_type}-${index}`"
          class="p-4 space-y-2"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-start gap-2.5 min-w-0">
              <CheckCircle2
                v-if="item.status === 'passed'"
                class="h-4 w-4 text-[var(--status-success-text)] shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <XCircle
                v-else-if="item.status === 'error'"
                class="h-4 w-4 text-[var(--status-error-text)] shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <AlertTriangle
                v-else
                class="h-4 w-4 text-[var(--status-warning-text)] shrink-0 mt-0.5"
                aria-hidden="true"
              />

              <div class="min-w-0 space-y-0.5">
                <p class="font-mono text-xs font-semibold text-[var(--ink-900)] break-words">
                  {{ item.target }}
                </p>
                <p class="text-sm text-[var(--ink-700)] leading-relaxed">
                  {{ item.message }}
                </p>
              </div>
            </div>

            <UiBadge
              :variant="item.status === 'passed' ? 'success' : item.status === 'error' ? 'error' : 'warning'"
              class="shrink-0"
            >
              {{ item.status === 'passed' ? 'Lulus' : item.status === 'error' ? 'Gagal' : 'Peringatan' }}
            </UiBadge>
          </div>

          <div
            v-if="item.suggestion"
            class="ml-6 rounded-[4px] border border-[var(--border)] bg-[#fafbf5] px-3 py-2 text-xs text-[var(--ink-700)] flex items-start gap-2"
          >
            <Wrench class="h-3.5 w-3.5 text-[var(--ink-700)] shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              <strong class="font-semibold text-[var(--ink-900)]">Saran perbaikan:</strong>
              {{ item.suggestion }}
            </span>
          </div>
        </li>
      </ul>
    </section>

    <div class="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
      <UiButton variant="subtle" size="md" :disabled="uploading" @click="emit('prev')">
        <ArrowLeft class="h-4 w-4" aria-hidden="true" />
        <span>Kembali</span>
      </UiButton>

      <div class="flex items-center gap-2.5">
        <UiButton
          v-if="validationResult && !validationResult.passed"
          variant="outline"
          size="md"
          @click="handleReupload"
        >
          <RefreshCw class="h-4 w-4" aria-hidden="true" />
          <span>Upload ulang</span>
        </UiButton>

        <UiButton
          v-else-if="validationResult && validationResult.passed"
          variant="subtle"
          size="md"
          @click="handleReupload"
        >
          <RefreshCw class="h-4 w-4" aria-hidden="true" />
          <span>Upload ulang</span>
        </UiButton>

        <UiButton
          variant="primary"
          size="md"
          :disabled="!validationResult?.passed || uploading"
          @click="emit('next')"
        >
          <span>Lanjut</span>
          <ArrowRight class="h-4 w-4" aria-hidden="true" />
        </UiButton>
      </div>
    </div>
  </UiCard>
</template>
