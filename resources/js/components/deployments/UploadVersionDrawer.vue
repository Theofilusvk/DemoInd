<script setup>
import { computed, ref, watch } from 'vue';
import { ArrowRight, FileArchive, Upload } from 'lucide-vue-next';
import { UiButton, UiDrawer, UiDropzone, UiInput } from '@/components/ui';
import { bumpMinorVersion } from '@/utils/deploymentHelpers';

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  deployment: {
    type: Object,
    default: null,
  },
  submitting: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'submit']);

const selectedFile = ref(null);
const note = ref('');
const errorMessage = ref('');
const progress = ref(0);
const uploading = ref(false);

const nextVersion = computed(() =>
  props.deployment ? bumpMinorVersion(props.deployment.active_version) : 'v1.0.1',
);

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      selectedFile.value = null;
      note.value = '';
      errorMessage.value = '';
      progress.value = 0;
      uploading.value = false;
    }
  },
);

function handleSelect(file) {
  errorMessage.value = '';
  selectedFile.value = {
    name: file.name,
    size: file.size,
  };
}

function handleUseSampleArchive() {
  if (!props.deployment) return;
  errorMessage.value = '';
  selectedFile.value = {
    name: `${props.deployment.name}-${nextVersion.value}.zip`,
    size: 4_520_960,
  };
  if (!note.value.trim()) {
    note.value = `Pembaruan rilis ${nextVersion.value}`;
  }
}

function handleClear() {
  selectedFile.value = null;
  errorMessage.value = '';
  progress.value = 0;
}

async function handleSubmit() {
  if (!selectedFile.value) {
    errorMessage.value = 'Pilih file arsip .zip terlebih dahulu sebelum mengunggah.';
    return;
  }

  errorMessage.value = '';
  uploading.value = true;
  progress.value = 25;

  await new Promise((resolve) => setTimeout(resolve, 140));
  progress.value = 68;

  await new Promise((resolve) => setTimeout(resolve, 140));
  progress.value = 100;

  emit('submit', {
    id: props.deployment.id,
    fileName: selectedFile.value.name,
    note: note.value.trim(),
  });
}
</script>

<template>
  <UiDrawer
    :open="open && Boolean(deployment)"
    title="Upload Versi Baru"
    :subtitle="deployment ? `${deployment.name} · ${deployment.stack}` : ''"
    @close="emit('close')"
  >
    <form v-if="deployment" id="upload-version-form" class="space-y-5" @submit.prevent="handleSubmit">
      <div class="rounded-[4px] border border-[var(--border)] bg-[#f7f9ef] p-3.5 flex items-center justify-between gap-3">
        <div>
          <p class="text-xs text-[var(--ink-500)]">Target kenaikan versi</p>
          <p class="mt-0.5 font-mono text-sm font-semibold text-[var(--ink-900)] inline-flex items-center gap-2 tabular-nums">
            <span>{{ deployment.active_version }}</span>
            <ArrowRight class="h-3.5 w-3.5 text-[var(--ink-500)]" aria-hidden="true" />
            <span>{{ nextVersion }}</span>
          </p>
        </div>
        <span class="font-mono text-xs text-[var(--ink-500)]">
          {{ deployment.stack }}
        </span>
      </div>

      <div class="space-y-2">
        <div class="flex items-center justify-between gap-2">
          <p class="text-sm font-medium text-[var(--ink-900)]">
            Arsip proyek (<span class="font-mono text-xs">.zip</span>)
          </p>
          <button
            v-if="!selectedFile"
            type="button"
            class="inline-flex items-center gap-1 text-xs font-medium text-[var(--ink-700)] underline decoration-[var(--ink-300)] underline-offset-2 hover:text-[var(--ink-900)] cursor-pointer"
            @click="handleUseSampleArchive"
          >
            <FileArchive class="h-3.5 w-3.5" aria-hidden="true" />
            <span>Pakai arsip contoh</span>
          </button>
        </div>

        <UiDropzone
          :selected-file="selectedFile"
          :uploading="uploading || submitting"
          :progress="progress"
          :error-message="errorMessage"
          @select="handleSelect"
          @clear="handleClear"
          @error="(msg) => (errorMessage = msg)"
        />
      </div>

      <UiInput
        v-model="note"
        label="Catatan rilis (opsional)"
        name="release_note"
        placeholder="Contoh: Perbaikan halaman cetak struk harian"
        hint="Catatan singkat ini akan tampil di riwayat versi untuk memudahkan rollback bila diperlukan."
        :disabled="uploading || submitting"
      />
    </form>

    <template #footer>
      <UiButton
        variant="subtle"
        size="sm"
        :disabled="uploading || submitting"
        @click="emit('close')"
      >
        Batal
      </UiButton>
      <UiButton
        type="submit"
        form="upload-version-form"
        variant="primary"
        size="sm"
        :loading="uploading || submitting"
        :disabled="!selectedFile"
      >
        <Upload class="h-3.5 w-3.5" aria-hidden="true" />
        <span>Unggah dan deploy {{ nextVersion }}</span>
      </UiButton>
    </template>
  </UiDrawer>
</template>
