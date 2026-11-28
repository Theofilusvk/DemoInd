<script setup>
import {
  ArrowRight,
  ExternalLink,
  FileText,
  FolderGit2,
  RotateCcw,
  Square,
  Upload,
} from 'lucide-vue-next';
import { UiButton, UiTable } from '@/components/ui';
import { canStopDeployment, getPreviousRollbackTarget } from '@/utils/deploymentHelpers';
import DeploymentStatusBadge from './DeploymentStatusBadge.vue';

defineProps({
  rows: {
    type: Array,
    default: () => [],
  },
  totalCount: {
    type: Number,
    default: 0,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  actionLoadingId: {
    type: [Number, String, null],
    default: null,
  },
});

const emit = defineEmits([
  'detail',
  'upload',
  'rollback',
  'stop',
  'go-submission',
  'reset-filters',
]);

const columns = [
  { key: 'name', label: 'Nama' },
  { key: 'stack', label: 'Stack' },
  { key: 'active_version', label: 'Versi aktif', mono: true },
  { key: 'status', label: 'Status' },
  { key: 'url', label: 'URL', mono: true },
  { key: 'last_deployed_at', label: 'Deploy terakhir', mono: true },
  { key: 'actions', label: 'Aksi', align: 'right' },
];

function stripProtocol(url) {
  return String(url ?? '').replace(/^https?:\/\//, '');
}
</script>

<template>
  <div class="space-y-2">
    <p
      v-if="rows.length > 0 && !loading"
      class="md:hidden text-xs text-[var(--ink-500)]"
    >
      Geser tabel ke samping untuk melihat status, URL, dan tombol aksi.
    </p>

    <UiTable
      :columns="columns"
      :rows="rows"
      :loading="loading"
      caption="Daftar aplikasi yang di-deploy pada akun DemoInd Anda"
    >
    <template #cell-name="{ row }">
      <div class="min-w-[130px] max-w-[172px]">
        <button
          type="button"
          class="font-mono text-[13px] font-semibold text-[var(--ink-900)] hover:underline underline-offset-2 text-left cursor-pointer"
          @click="emit('detail', row)"
        >
          {{ row.name }}
        </button>
        <p class="mt-0.5 text-xs text-[var(--ink-500)] truncate" :title="row.description">
          {{ row.description }}
        </p>
      </div>
    </template>

    <template #cell-stack="{ row }">
      <span class="text-sm text-[var(--ink-700)] whitespace-nowrap">
        {{ row.stack }}
      </span>
    </template>

    <template #cell-active_version="{ row }">
      <span class="font-mono text-xs font-medium text-[var(--ink-900)] tabular-nums whitespace-nowrap">
        {{ row.active_version }}
      </span>
    </template>

    <template #cell-status="{ row }">
      <DeploymentStatusBadge :status="row.status" />
    </template>

    <template #cell-url="{ row }">
      <a
        v-if="row.status === 'success'"
        :href="row.url"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1 font-mono text-xs text-[var(--ink-900)] underline decoration-[var(--ink-300)] underline-offset-2 hover:decoration-[var(--ink-900)] max-w-[168px]"
        :title="row.url"
      >
        <span class="truncate">{{ stripProtocol(row.url) }}</span>
        <ExternalLink class="h-3 w-3 shrink-0 text-[var(--ink-500)]" aria-hidden="true" />
      </a>
      <span
        v-else
        class="block font-mono text-xs text-[var(--ink-500)] max-w-[168px] truncate"
        :title="row.url"
      >
        {{ stripProtocol(row.url) }}
      </span>
    </template>

    <template #cell-last_deployed_at="{ row }">
      <span class="font-mono text-xs text-[var(--ink-700)] tabular-nums whitespace-nowrap">
        {{ row.last_deployed_at }}
      </span>
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-end gap-1 flex-nowrap">
        <button
          type="button"
          :aria-label="`Detail ${row.name}`"
          class="h-7 px-2 inline-flex items-center gap-1 rounded-[4px] border border-[var(--border)] bg-[var(--card)] text-xs font-medium text-[var(--ink-900)] hover:border-[var(--ink-900)] whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          @click="emit('detail', row)"
        >
          <FileText class="h-3 w-3 text-[var(--ink-700)]" aria-hidden="true" />
          <span>Detail</span>
        </button>

        <button
          type="button"
          :aria-label="`Upload versi baru ${row.name}`"
          :disabled="actionLoadingId === row.id"
          class="h-7 px-2 inline-flex items-center gap-1 rounded-[4px] border border-[var(--border)] bg-[var(--card)] text-xs font-medium text-[var(--ink-900)] hover:border-[var(--ink-900)] whitespace-nowrap shrink-0 transition-colors cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
          @click="emit('upload', row)"
        >
          <Upload class="h-3 w-3 text-[var(--ink-700)]" aria-hidden="true" />
          <span>Upload versi baru</span>
        </button>

        <button
          type="button"
          :aria-label="`Rollback ${row.name}`"
          :disabled="!getPreviousRollbackTarget(row) || actionLoadingId === row.id"
          :title="
            getPreviousRollbackTarget(row)
              ? `Kembalikan ke ${getPreviousRollbackTarget(row).version}`
              : 'Belum ada versi sebelumnya untuk rollback'
          "
          class="h-7 px-2 inline-flex items-center gap-1 rounded-[4px] border border-[var(--border)] bg-[var(--card)] text-xs font-medium text-[var(--ink-900)] hover:border-[var(--ink-900)] whitespace-nowrap shrink-0 transition-colors cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
          @click="emit('rollback', row)"
        >
          <RotateCcw class="h-3 w-3 text-[var(--ink-700)]" aria-hidden="true" />
          <span>Rollback</span>
        </button>

        <button
          type="button"
          :aria-label="`Hentikan ${row.name}`"
          :disabled="!canStopDeployment(row.status) || actionLoadingId === row.id"
          :title="
            canStopDeployment(row.status)
              ? 'Hentikan layanan sementara'
              : 'Layanan tidak sedang aktif berjalan'
          "
          class="h-7 px-2 inline-flex items-center gap-1 rounded-[4px] border border-[var(--status-error-text)]/35 bg-[var(--status-error-bg)] text-xs font-medium text-[var(--status-error-text)] hover:bg-[#f6d3d0] whitespace-nowrap shrink-0 transition-colors cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
          @click="emit('stop', row)"
        >
          <Square class="h-3 w-3" aria-hidden="true" />
          <span>Hentikan</span>
        </button>
      </div>
    </template>

    <template #empty>
      <div v-if="totalCount === 0" class="py-6 max-w-md mx-auto text-center space-y-4">
        <div class="mx-auto h-11 w-11 rounded-[4px] border border-[var(--border)] bg-[var(--bg)] flex items-center justify-center text-[var(--ink-700)]">
          <FolderGit2 class="h-5 w-5" aria-hidden="true" />
        </div>
        <div class="space-y-1.5">
          <h2 class="text-base font-semibold text-[var(--ink-900)]">
            Belum ada aplikasi yang di-deploy
          </h2>
          <p class="text-sm text-[var(--ink-500)] leading-relaxed">
            Mulai dari tab Submission untuk menyusun struktur folder Laravel, memvalidasi arsip <span class="font-mono text-xs text-[var(--ink-700)]">.zip</span>, dan menayangkan proyek pertama Anda.
          </p>
        </div>
        <div class="pt-1">
          <UiButton variant="primary" size="md" @click="emit('go-submission')">
            <span>Mulai di tab Submission</span>
            <ArrowRight class="h-4 w-4" aria-hidden="true" />
          </UiButton>
        </div>
      </div>

      <div v-else class="py-4 max-w-md mx-auto text-center space-y-3">
        <div class="space-y-1">
          <p class="text-sm font-semibold text-[var(--ink-900)]">
            Tidak ada aplikasi yang cocok dengan filter saat ini
          </p>
          <p class="text-xs text-[var(--ink-500)]">
            Coba ubah kata kunci pencarian atau tampilkan semua status deployment.
          </p>
        </div>
        <UiButton variant="outline" size="sm" @click="emit('reset-filters')">
          Reset filter
        </UiButton>
      </div>
    </template>
  </UiTable>
  </div>
</template>
