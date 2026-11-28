<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import DeploymentTab from '@/components/deployments/DeploymentTab.vue';
import SubmissionTab from '@/components/submission/SubmissionTab.vue';
import { useAuthStore } from '@/stores/auth';
import { useDeploymentsStore } from '@/stores/deployments';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const deploymentsStore = useDeploymentsStore();

function resolveTab(rawTab) {
  return rawTab === 'submission' ? 'submission' : 'deployment';
}

const activeTab = ref(resolveTab(route.query.tab));

watch(
  () => route.query.tab,
  (nextTab) => {
    const resolved = resolveTab(nextTab);
    if (resolved !== activeTab.value) {
      activeTab.value = resolved;
    }
  },
);

watch(activeTab, (nextTab) => {
  if (route.query.tab !== nextTab) {
    router.replace({ query: { ...route.query, tab: nextTab } });
  }
});

onMounted(() => {
  deploymentsStore.fetchDeployments();
});

watch(
  () => authStore.user?.id,
  (nextId, prevId) => {
    if (nextId && nextId !== prevId) {
      deploymentsStore.fetchDeployments(true);
    }
  },
);
</script>

<template>
  <DashboardLayout
    v-model:active-tab="activeTab"
    :deployment-count="deploymentsStore.items.length"
  >
    <DeploymentTab
      v-if="activeTab === 'deployment'"
      @go-submission="activeTab = 'submission'"
    />

    <SubmissionTab
      v-else
      @deployed="activeTab = 'deployment'"
    />
  </DashboardLayout>
</template>
