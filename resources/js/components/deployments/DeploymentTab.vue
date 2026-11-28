<script setup>
import { computed, ref } from 'vue';
import { AlertCircle, RefreshCw } from 'lucide-vue-next';
import { UiButton } from '@/components/ui';
import { useDeploymentsStore } from '@/stores/deployments';
import { useToastStore } from '@/stores/toast';
import { getPreviousRollbackTarget } from '@/utils/deploymentHelpers';
import ActionConfirmDialog from './ActionConfirmDialog.vue';
import DeploymentDetailDrawer from './DeploymentDetailDrawer.vue';
import DeploymentTable from './DeploymentTable.vue';
import DeploymentToolbar from './DeploymentToolbar.vue';
import UploadVersionDrawer from './UploadVersionDrawer.vue';

const emit = defineEmits(['go-submission']);

const deploymentsStore = useDeploymentsStore();
const toastStore = useToastStore();

const detailId = ref(null);
const uploadId = ref(null);
const confirmState = ref({
  open: false,
  action: null, // 'rollback' | 'stop'
  deployment: null,
  targetVersion: null,
});

const selectedDetail = computed(() =>
  deploymentsStore.items.find((item) => item.id === detailId.value) || null,
);

const selectedUpload = computed(() =>
  deploymentsStore.items.find((item) => item.id === uploadId.value) || null,
);

const confirmMeta = computed(() => {
  const { action, deployment, targetVersion } = confirmState.value;
  if (!deployment) {
    return { title: '', description: '', confirmLabel: 'Lanjutkan', confirmVariant: 'primary' };
  }
  if (action === 'stop') {
    return {
      title: `Hentikan ${deployment.name}?`,
      description: `Layanan ${deployment.name} (${deployment.active_version}) akan dihentikan sementara sehingga URL tidak dapat diakses sampai Anda menjalankan ulang atau mengunggah versi baru.`,
      confirmLabel: 'Ya, hentikan layanan',
      confirmVariant: 'danger',
    };
  }
  return {
    title: `Rollback ${deployment.name} ke ${targetVersion}?`,
    description: `Aplikasi akan dikembalikan dari ${deployment.active_version} ke snapshot ${targetVersion}. Konfigurasi cache akan dimuat ulang otomatis.`,
    confirmLabel: `Rollback ke ${targetVersion}`,
    confirmVariant: 'primary',
  };
});

function openDetail(row) {
  detailId.value = row.id;
}

function openUpload(row) {
  uploadId.value = row.id;
}

function requestRollback(payload) {
  const deployment = payload.deployment || payload;
  const targetVersion = payload.version || getPreviousRollbackTarget(deployment)?.version;
  if (!targetVersion) return;

  confirmState.value = {
    open: true,
    action: 'rollback',
    deployment,
    targetVersion,
  };
}

function requestStop(deployment) {
  confirmState.value = {
    open: true,
    action: 'stop',
    deployment,
    targetVersion: null,
  };
}

function closeConfirm() {
  confirmState.value = {
    open: false,
    action: null,
    deployment: null,
    targetVersion: null,
  };
}

async function handleConfirmAction() {
  const { action, deployment, targetVersion } = confirmState.value;
  if (!deployment) return;

  if (action === 'stop') {
    const res = await deploymentsStore.stopDeployment(deployment.id);
    closeConfirm();
    if (res.ok) {
      toastStore.push({
        title: `${deployment.name} dihentikan`,
        description: 'Status layanan diperbarui menjadi stopped.',
        variant: 'info',
      });
    } else {
      toastStore.push({
        title: 'Gagal menghentikan aplikasi',
        description: res.message || 'Silakan coba beberapa saat lagi.',
        variant: 'error',
      });
    }
    return;
  }

  if (action === 'rollback') {
    const res = await deploymentsStore.rollbackDeployment(deployment.id, targetVersion);
    closeConfirm();
    if (res.ok) {
      toastStore.push({
        title: `Rollback ${deployment.name} selesai`,
        description: `Versi ${targetVersion} kini aktif kembali.`,
        variant: 'success',
      });
    } else {
      toastStore.push({
        title: 'Rollback gagal',
        description: res.message || 'Versi sebelumnya tidak dapat diaktifkan.',
        variant: 'error',
      });
    }
  }
}

async function handleUploadVersion({ id, fileName, note }) {
  const res = await deploymentsStore.uploadNewVersion(id, { fileName, note });
  if (res.ok && res.deployment) {
    uploadId.value = null;
    toastStore.push({
      title: `Versi ${res.deployment.active_version} berhasil di-deploy`,
      description: `Aplikasi ${res.deployment.name} aktif dengan arsip ${fileName}.`,
      variant: 'success',
    });
  } else {
    toastStore.push({
      title: 'Gagal mengunggah versi baru',
      description: res.message || 'Periksa kembali arsip .zip Anda.',
      variant: 'error',
    });
  }
}
</script>

<template>
  <section aria-label="Tab Deployment" class="space-y-5">
    <DeploymentToolbar
      :search-query="deploymentsStore.searchQuery"
      :status-filter="deploymentsStore.statusFilter"
      :status-counts="deploymentsStore.statusCounts"
      :total-count="deploymentsStore.items.length"
      @update:search-query="(val) => (deploymentsStore.searchQuery = val)"
      @update:status-filter="(val) => (deploymentsStore.statusFilter = val)"
      @go-submission="emit('go-submission')"
    />

    <div
      v-if="deploymentsStore.error"
      role="alert"
      class="rounded-[4px] border border-[var(--status-error-text)]/35 bg-[var(--status-error-bg)] px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
    >
      <div class="flex items-start gap-2.5 text-sm text-[var(--status-error-text)]">
        <AlertCircle class="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
        <span>{{ deploymentsStore.error }}</span>
      </div>
      <UiButton
        variant="outline"
        size="sm"
        @click="deploymentsStore.fetchDeployments(true)"
      >
        <RefreshCw class="h-3.5 w-3.5" aria-hidden="true" />
        <span>Muat ulang</span>
      </UiButton>
    </div>

    <DeploymentTable
      :rows="deploymentsStore.filteredItems"
      :total-count="deploymentsStore.items.length"
      :loading="deploymentsStore.loading"
      :action-loading-id="deploymentsStore.actionLoadingId"
      @detail="openDetail"
      @upload="openUpload"
      @rollback="requestRollback"
      @stop="requestStop"
      @go-submission="emit('go-submission')"
      @reset-filters="deploymentsStore.resetFilters()"
    />

    <DeploymentDetailDrawer
      :open="Boolean(selectedDetail)"
      :deployment="selectedDetail"
      :busy="Boolean(selectedDetail && deploymentsStore.actionLoadingId === selectedDetail.id)"
      @close="detailId = null"
      @upload="openUpload"
      @rollback="requestRollback"
      @stop="requestStop"
    />

    <UploadVersionDrawer
      :open="Boolean(selectedUpload)"
      :deployment="selectedUpload"
      :submitting="Boolean(selectedUpload && deploymentsStore.actionLoadingId === selectedUpload.id)"
      @close="uploadId = null"
      @submit="handleUploadVersion"
    />

    <ActionConfirmDialog
      :open="confirmState.open"
      :title="confirmMeta.title"
      :description="confirmMeta.description"
      :confirm-label="confirmMeta.confirmLabel"
      :confirm-variant="confirmMeta.confirmVariant"
      :loading="Boolean(confirmState.deployment && deploymentsStore.actionLoadingId === confirmState.deployment.id)"
      @confirm="handleConfirmAction"
      @cancel="closeConfirm"
    />
  </section>
</template>
