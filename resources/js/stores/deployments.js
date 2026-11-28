import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import { filterDeployments } from '@/utils/deploymentHelpers';

export const useDeploymentsStore = defineStore('deployments', () => {
  const items = ref([]);
  const loading = ref(false);
  const error = ref('');
  const actionLoadingId = ref(null);
  const searchQuery = ref('');
  const statusFilter = ref('all');
  const loadedForUserId = ref(null);

  const authStore = useAuthStore();

  const filteredItems = computed(() =>
    filterDeployments(items.value, {
      query: searchQuery.value,
      status: statusFilter.value,
    }),
  );

  const statusCounts = computed(() => {
    const counts = {
      all: items.value.length,
      success: 0,
      running: 0,
      queued: 0,
      failed: 0,
      stopped: 0,
    };
    for (const item of items.value) {
      if (item.status in counts) {
        counts[item.status] += 1;
      }
    }
    return counts;
  });

  function currentUserId() {
    return authStore.user?.id ?? 1;
  }

  function replaceItem(updated) {
    items.value = items.value.map((item) => (item.id === updated.id ? updated : item));
  }

  async function fetchDeployments(force = false) {
    const uid = currentUserId();
    if (!force && loadedForUserId.value === uid && items.value.length > 0) {
      return;
    }

    loading.value = true;
    error.value = '';
    try {
      items.value = await api.getDeployments(uid);
      loadedForUserId.value = uid;
    } catch {
      error.value = 'Gagal memuat daftar deployment. Coba muat ulang beberapa saat lagi.';
    } finally {
      loading.value = false;
    }
  }

  async function stopDeployment(id) {
    actionLoadingId.value = id;
    try {
      const result = await api.stopDeployment(id, currentUserId());
      if (result.ok && result.deployment) {
        replaceItem(result.deployment);
      }
      return result;
    } finally {
      actionLoadingId.value = null;
    }
  }

  async function rollbackDeployment(id, targetVersion = null) {
    actionLoadingId.value = id;
    try {
      const result = await api.rollbackDeployment(id, targetVersion, currentUserId());
      if (result.ok && result.deployment) {
        replaceItem(result.deployment);
      }
      return result;
    } finally {
      actionLoadingId.value = null;
    }
  }

  async function uploadNewVersion(id, payload) {
    actionLoadingId.value = id;
    try {
      const result = await api.uploadNewVersion(id, payload, currentUserId());
      if (result.ok && result.deployment) {
        replaceItem(result.deployment);
      }
      return result;
    } finally {
      actionLoadingId.value = null;
    }
  }

  async function createDeployment(payload) {
    const result = await api.createDeployment(payload, currentUserId());
    if (result.ok && result.deployment) {
      items.value = [result.deployment, ...items.value];
      loadedForUserId.value = currentUserId();
    }
    return result;
  }

  function resetFilters() {
    searchQuery.value = '';
    statusFilter.value = 'all';
  }

  function resetState() {
    items.value = [];
    loadedForUserId.value = null;
    resetFilters();
  }

  return {
    items,
    loading,
    error,
    actionLoadingId,
    searchQuery,
    statusFilter,
    filteredItems,
    statusCounts,
    fetchDeployments,
    stopDeployment,
    rollbackDeployment,
    uploadNewVersion,
    createDeployment,
    resetFilters,
    resetState,
  };
});
