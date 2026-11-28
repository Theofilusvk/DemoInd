<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { LogOut } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { useDeploymentsStore } from '@/stores/deployments';
import { useToastStore } from '@/stores/toast';
import { useWizardStore } from '@/stores/wizard';
import { UiTabs } from '@/components/ui';

const props = defineProps({
  activeTab: {
    type: String,
    default: 'deployment',
  },
  deploymentCount: {
    type: Number,
    default: undefined,
  },
});

const emit = defineEmits(['update:activeTab']);

const router = useRouter();
const authStore = useAuthStore();
const deploymentsStore = useDeploymentsStore();
const wizardStore = useWizardStore();
const toastStore = useToastStore();

const tabs = computed(() => [
  {
    value: 'deployment',
    label: 'Deployment',
    count: props.deploymentCount,
  },
  {
    value: 'submission',
    label: 'Submission',
  },
]);

function handleTabChange(nextTab) {
  emit('update:activeTab', nextTab);
}

function handleLogout() {
  authStore.logout();
  deploymentsStore.resetState();
  wizardStore.reset();
  toastStore.push({
    title: 'Berhasil keluar',
    description: 'Sesi Anda telah diakhiri. Silakan masuk kembali untuk mengelola aplikasi.',
    variant: 'info',
  });
  router.push('/login');
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink-900)]">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-[4px] focus:bg-[var(--ink-900)] focus:px-3.5 focus:py-2 focus:text-xs focus:font-medium focus:text-white"
    >
      Lewati ke konten utama
    </a>

    <header class="border-b border-[var(--border)] bg-[var(--card)]">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <RouterLink
          to="/app"
          class="text-base font-semibold tracking-tight text-[var(--ink-900)] whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span
            aria-hidden="true"
            class="h-4 w-4 rounded-[2px] bg-[var(--ink-900)] inline-flex items-center justify-center"
          >
            <span class="h-1.5 w-1.5 bg-[var(--yellow-300)]" />
          </span>
          <span>DemoInd</span>
        </RouterLink>

        <div class="flex items-center gap-3 sm:gap-4 shrink-0 min-w-0">
          <span class="text-sm font-medium text-[var(--ink-900)] truncate max-w-[130px] sm:max-w-none">
            {{ authStore.user?.name || 'Pengguna Demo' }}
          </span>
          <span aria-hidden="true" class="h-4 w-px bg-[var(--border)] shrink-0" />
          <button
            type="button"
            class="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--ink-700)] hover:text-[var(--ink-900)] whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            @click="handleLogout"
          >
            <LogOut class="h-4 w-4" aria-hidden="true" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      <div class="mx-auto max-w-7xl px-4 sm:px-6 border-t border-[var(--border)]/60">
        <UiTabs
          :model-value="activeTab"
          :tabs="tabs"
          :borderless="true"
          aria-label="Tab dashboard DemoInd"
          @update:model-value="handleTabChange"
        />
      </div>
    </header>

    <main id="main-content" tabindex="-1" class="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-8 focus:outline-none">
      <slot />
    </main>
  </div>
</template>
