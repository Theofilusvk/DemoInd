<script setup>
import { ref, useId } from 'vue';
import { FileArchive, Upload, X, AlertCircle } from 'lucide-vue-next';
import { cn } from '@/utils/cn';
import { formatBytes, MAX_ZIP_SIZE_MB, validateZipFile } from '@/utils/fileValidation';
import UiButton from './UiButton.vue';

const props = defineProps({
  accept: {
    type: String,
    default: '.zip,application/zip',
  },
  maxSizeMb: {
    type: Number,
    default: MAX_ZIP_SIZE_MB,
  },
  progress: {
    type: Number,
    default: 0,
  },
  uploading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  selectedFile: {
    type: Object,
    default: null,
    // { name: string, size: number }
  },
  errorMessage: {
    type: String,
    default: '',
  },
  class: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['select', 'clear', 'error']);

const inputRef = ref(null);
const isDragging = ref(false);
const localError = ref('');
const uid = useId();

function openFileDialog() {
  if (props.disabled || props.uploading) return;
  inputRef.value?.click();
}

function processFile(file) {
  localError.value = '';
  const result = validateZipFile(file, props.maxSizeMb);
  if (!result.valid) {
    localError.value = result.error;
    emit('error', result.error);
    return;
  }
  emit('select', file);
}

function onInputChange(event) {
  const file = event.target.files?.[0];
  if (file) {
    processFile(file);
  }
  event.target.value = '';
}

function onDragOver(event) {
  event.preventDefault();
  if (props.disabled || props.uploading) return;
  isDragging.value = true;
}

function onDragLeave() {
  isDragging.value = false;
}

function onDrop(event) {
  event.preventDefault();
  isDragging.value = false;
  if (props.disabled || props.uploading) return;
  const file = event.dataTransfer?.files?.[0];
  if (file) {
    processFile(file);
  }
}

function clearFile() {
  localError.value = '';
  emit('clear');
}
</script>

<template>
  <div :class="cn('w-full', props.class)">
    <input
      :id="`dropzone-${uid}`"
      ref="inputRef"
      type="file"
      :accept="accept"
      :disabled="disabled || uploading"
      tabindex="-1"
      aria-hidden="true"
      class="hidden"
      @change="onInputChange"
    />

    <div
      :class="cn(
        'rounded-[4px] border border-dashed p-6 transition-colors bg-[var(--card)]',
        isDragging
          ? 'border-[var(--ink-900)] bg-[var(--green-100)]/45'
          : (localError || errorMessage)
            ? 'border-[var(--status-error-text)] bg-[#fffafa]'
            : 'border-[var(--ink-300)] hover:border-[var(--ink-700)]',
        disabled ? 'opacity-60 cursor-not-allowed' : '',
      )"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <div v-if="!selectedFile" class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-start gap-3.5">
          <div class="h-10 w-10 shrink-0 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] flex items-center justify-center text-[var(--ink-700)]">
            <Upload class="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <p class="text-sm font-semibold text-[var(--ink-900)]">
              Seret arsip proyek <span class="font-mono">.zip</span> ke area ini
            </p>
            <p class="mt-0.5 text-xs text-[var(--ink-500)]">
              Ukuran maksimal {{ maxSizeMb }} MB. Sertakan <span class="font-mono">.env.example</span> dan pastikan folder <span class="font-mono">vendor/</span> tidak ikut terkompres.
            </p>
          </div>
        </div>

        <UiButton
          variant="outline"
          size="sm"
          :disabled="disabled || uploading"
          @click="openFileDialog"
        >
          Pilih file .zip
        </UiButton>
      </div>

      <div v-else class="space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <div class="h-10 w-10 shrink-0 rounded-[4px] border border-[var(--border)] bg-[var(--green-100)] flex items-center justify-center text-[var(--ink-900)]">
              <FileArchive class="h-4 w-4" aria-hidden="true" />
            </div>
            <div class="min-w-0">
              <p class="font-mono text-sm font-medium text-[var(--ink-900)] truncate">
                {{ selectedFile.name }}
              </p>
              <p class="font-mono text-xs text-[var(--ink-500)] tabular-nums">
                {{ formatBytes(selectedFile.size) }}
                <span v-if="uploading"> · Mengunggah {{ progress }}%</span>
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <UiButton
              variant="subtle"
              size="sm"
              :disabled="uploading"
              @click="openFileDialog"
            >
              Ganti file
            </UiButton>
            <button
              type="button"
              :disabled="uploading"
              aria-label="Hapus file terpilih"
              class="h-9 w-9 inline-flex items-center justify-center rounded-[4px] border border-[var(--border)] text-[var(--ink-500)] hover:text-[var(--ink-900)] hover:border-[var(--ink-500)] transition-colors cursor-pointer disabled:opacity-50"
              @click="clearFile"
            >
              <X class="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div v-if="uploading || progress > 0" class="space-y-1">
          <div
            role="progressbar"
            :aria-valuenow="progress"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label="Progres upload arsip"
            class="h-2 w-full rounded-[2px] bg-[var(--border)] overflow-hidden"
          >
            <div
              class="h-full bg-[var(--ink-900)] transition-all duration-150"
              :style="{ width: `${Math.min(100, Math.max(0, progress))}%` }"
            />
          </div>
        </div>
      </div>
    </div>

    <p
      v-if="localError || errorMessage"
      role="alert"
      class="mt-2 flex items-start gap-1.5 text-xs font-medium text-[var(--status-error-text)]"
    >
      <AlertCircle class="h-3.5 w-3.5 shrink-0 mt-0.5" aria-hidden="true" />
      <span>{{ localError || errorMessage }}</span>
    </p>
  </div>
</template>
