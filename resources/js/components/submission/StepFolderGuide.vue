<script setup>
import { computed } from 'vue';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Ban,
  CheckSquare,
  Download,
  FileCode2,
  FolderCheck,
  HardDrive,
} from 'lucide-vue-next';
import { UiBadge, UiButton, UiCard, UiFileTree } from '@/components/ui';
import { groupValidationRules, slugifyAppName } from '@/utils/submissionHelpers';
import { buildLaravelTemplateZip } from '@/utils/zipTemplateBuilder';

const props = defineProps({
  appName: {
    type: String,
    default: '',
  },
  folderGuides: {
    type: Array,
    default: () => [],
  },
  validationRules: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['prev', 'next', 'downloaded']);

const rootLabel = computed(() => `${slugifyAppName(props.appName) || 'proyek-laravel'}/`);
const groupedRules = computed(() => groupValidationRules(props.validationRules));

function handleDownloadTemplate() {
  const { fileName, bytes } = buildLaravelTemplateZip(props.appName || 'proyek-laravel');
  const blob = new Blob([bytes], { type: 'application/zip' });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  emit('downloaded', fileName);
}
</script>

<template>
  <div class="space-y-5">
    <UiCard padding="lg" class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div class="space-y-1">
          <h2 class="text-base font-semibold text-[var(--ink-900)]">
            Langkah 3: Susunan folder Laravel
          </h2>
          <p class="text-sm text-[var(--ink-500)]">
            Pastikan struktur proyek Anda sesuai panduan berikut sebelum dikompres menjadi arsip <code class="font-mono text-xs text-[var(--ink-900)]">.zip</code>.
          </p>
        </div>

        <UiButton variant="secondary" size="md" @click="handleDownloadTemplate">
          <Download class="h-4 w-4" aria-hidden="true" />
          <span>Unduh template folder (zip)</span>
        </UiButton>
      </div>

      <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6">
        <div class="h-80 rounded-[4px] border border-[var(--border)] bg-[#f7f9ef] animate-pulse" />
        <div class="h-80 rounded-[4px] border border-[var(--border)] bg-[#f7f9ef] animate-pulse" />
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6 items-start">
        <div class="space-y-2.5">
          <p class="text-xs font-semibold uppercase tracking-wide text-[var(--ink-500)]">
            Struktur direktori panduan
          </p>
          <UiFileTree
            :root-label="rootLabel"
            :items="folderGuides"
            variant="light"
            :show-requirement="true"
          />
        </div>

        <aside class="space-y-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-[var(--ink-500)]">
            Checklist aturan validasi
          </p>

          <!-- File wajib -->
          <div class="rounded-[4px] border border-[var(--border)] bg-[var(--card)] p-4 space-y-2.5">
            <div class="flex items-center gap-2 text-xs font-semibold text-[var(--ink-900)]">
              <FileCode2 class="h-4 w-4 text-[var(--status-success-text)]" aria-hidden="true" />
              <span>File wajib di root ({{ groupedRules.requiredFiles.length }})</span>
            </div>
            <ul class="space-y-1.5">
              <li
                v-for="rule in groupedRules.requiredFiles"
                :key="rule.id"
                class="flex items-start justify-between gap-2 text-xs"
              >
                <span class="inline-flex items-start gap-2 text-[var(--ink-700)]">
                  <CheckSquare class="h-3.5 w-3.5 text-[var(--status-success-text)] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    <code class="font-mono font-semibold text-[var(--ink-900)]">{{ rule.value }}</code>
                    — {{ rule.label }}
                  </span>
                </span>
              </li>
            </ul>
          </div>

          <!-- Folder wajib -->
          <div class="rounded-[4px] border border-[var(--border)] bg-[var(--card)] p-4 space-y-2.5">
            <div class="flex items-center gap-2 text-xs font-semibold text-[var(--ink-900)]">
              <FolderCheck class="h-4 w-4 text-[var(--status-success-text)]" aria-hidden="true" />
              <span>Folder wajib ({{ groupedRules.requiredDirs.length }})</span>
            </div>
            <div class="flex flex-wrap gap-1.5">
              <code
                v-for="rule in groupedRules.requiredDirs"
                :key="rule.id"
                class="rounded-[4px] border border-[var(--border)] bg-[#f7f9ef] px-2 py-0.5 font-mono text-xs text-[var(--ink-900)]"
              >
                {{ rule.value }}/
              </code>
            </div>
          </div>

          <!-- Yang dilarang -->
          <div class="rounded-[4px] border border-[var(--border)] bg-[var(--card)] p-4 space-y-2.5">
            <div class="flex items-center gap-2 text-xs font-semibold text-[var(--ink-900)]">
              <Ban class="h-4 w-4 text-[var(--status-error-text)]" aria-hidden="true" />
              <span>Yang dilarang &amp; sebaiknya dikecualikan</span>
            </div>
            <ul class="space-y-2">
              <li
                v-for="rule in groupedRules.forbiddenPaths"
                :key="rule.id"
                class="flex items-start justify-between gap-2 text-xs"
              >
                <span class="inline-flex items-start gap-2 text-[var(--ink-700)]">
                  <AlertTriangle
                    class="h-3.5 w-3.5 shrink-0 mt-0.5"
                    :class="rule.severity === 'error' ? 'text-[var(--status-error-text)]' : 'text-[var(--status-warning-text)]'"
                    aria-hidden="true"
                  />
                  <span>
                    <code class="font-mono font-semibold text-[var(--ink-900)]">{{ rule.value }}</code>
                    — {{ rule.label }}
                  </span>
                </span>
                <UiBadge :variant="rule.severity === 'error' ? 'error' : 'warning'" class="shrink-0">
                  {{ rule.severity === 'error' ? 'Dilarang' : 'Peringatan' }}
                </UiBadge>
              </li>
            </ul>
          </div>

          <!-- Ukuran maksimal -->
          <div
            v-if="groupedRules.maxSizeRule"
            class="rounded-[4px] border border-[var(--border)] bg-[#f7f9ef] px-4 py-3 flex items-center justify-between gap-3 text-xs"
          >
            <span class="inline-flex items-center gap-2 font-medium text-[var(--ink-900)]">
              <HardDrive class="h-4 w-4 text-[var(--ink-700)]" aria-hidden="true" />
              <span>{{ groupedRules.maxSizeRule.label }}</span>
            </span>
            <span class="font-mono font-semibold text-[var(--ink-900)] tabular-nums shrink-0">
              <= {{ groupedRules.maxSizeRule.value }} MB
            </span>
          </div>
        </aside>
      </div>

      <div class="flex items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
        <UiButton variant="subtle" size="md" @click="emit('prev')">
          <ArrowLeft class="h-4 w-4" aria-hidden="true" />
          <span>Kembali</span>
        </UiButton>

        <UiButton variant="primary" size="md" @click="emit('next')">
          <span>Lanjut ke upload &amp; validasi</span>
          <ArrowRight class="h-4 w-4" aria-hidden="true" />
        </UiButton>
      </div>
    </UiCard>
  </div>
</template>
