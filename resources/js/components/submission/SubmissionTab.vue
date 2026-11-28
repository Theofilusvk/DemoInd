<script setup>
import { computed, onMounted, ref } from 'vue';
import { AlertCircle, RefreshCw, RotateCcw } from 'lucide-vue-next';
import { UiButton, UiStepper } from '@/components/ui';
import { api } from '@/services/api';
import { useDeploymentsStore } from '@/stores/deployments';
import { useToastStore } from '@/stores/toast';
import { useWizardStore } from '@/stores/wizard';
import { DEPLOY_PIPELINE_STEPS, SUBMISSION_STEPS } from '@/utils/submissionHelpers';
import StepAppInfo from './StepAppInfo.vue';
import StepEnvDeploy from './StepEnvDeploy.vue';
import StepFolderGuide from './StepFolderGuide.vue';
import StepSelectStack from './StepSelectStack.vue';
import StepUploadValidate from './StepUploadValidate.vue';

const emit = defineEmits(['deployed']);

const wizardStore = useWizardStore();
const deploymentsStore = useDeploymentsStore();
const toastStore = useToastStore();

const stacks = ref([]);
const folderGuides = ref([]);
const validationRules = ref([]);
const loadingReference = ref(false);
const referenceError = ref('');

const hasDraftData = computed(
  () =>
    Boolean(wizardStore.appName.trim()) ||
    Boolean(wizardStore.appDescription.trim()) ||
    Boolean(wizardStore.uploadedFile) ||
    wizardStore.currentStep > 1,
);

async function loadReferenceData() {
  loadingReference.value = true;
  referenceError.value = '';
  try {
    const [stackList, guideList, ruleList, defaultEnvKeys] = await Promise.all([
      api.getStacks(),
      api.getFolderGuides('laravel'),
      api.getValidationRules('laravel'),
      api.getEnvExampleKeys('laravel'),
    ]);
    stacks.value = stackList;
    folderGuides.value = guideList;
    validationRules.value = ruleList;
    if (wizardStore.envKeys.length === 0) {
      wizardStore.envKeys = defaultEnvKeys;
    }
  } catch {
    referenceError.value = 'Gagal memuat data panduan stack dan aturan validasi. Coba muat ulang.';
  } finally {
    loadingReference.value = false;
  }
}

onMounted(() => {
  loadReferenceData();
});

function handleStepperSelect(stepNumber) {
  if (wizardStore.deploying) return;
  // Pengguna bebas melompat kembali ke langkah yang sudah pernah dicapai
  if (stepNumber <= wizardStore.maxReachedStep) {
    wizardStore.setStep(stepNumber);
  }
}

function handleTemplateDownloaded(fileName) {
  toastStore.push({
    title: 'Template folder berhasil diunduh',
    description: `Berkas ${fileName} siap diekstrak sebagai panduan struktur proyek Laravel Anda.`,
    variant: 'success',
  });
}

function handleResetDraft() {
  wizardStore.reset();
  toastStore.push({
    title: 'Draft wizard direset',
    description: 'Formulir submission dikembalikan ke Langkah 1.',
    variant: 'info',
  });
}

async function handleDeploy() {
  if (wizardStore.deploying) return;
  wizardStore.deploying = true;
  wizardStore.deployStageIndex = 0;

  try {
    for (let i = 0; i < DEPLOY_PIPELINE_STEPS.length; i += 1) {
      wizardStore.deployStageIndex = i;
      await new Promise((resolve) => setTimeout(resolve, 260));
    }

    wizardStore.deployStageIndex = DEPLOY_PIPELINE_STEPS.length;
    await new Promise((resolve) => setTimeout(resolve, 220));

    const created = await deploymentsStore.createDeployment({
      name: wizardStore.appName,
      description: wizardStore.appDescription,
      stack: 'Laravel',
      fileName: wizardStore.uploadedFile?.name || 'proyek-laravel.zip',
    });

    if (created.ok && created.deployment) {
      const deployedApp = created.deployment;
      wizardStore.reset();
      toastStore.push({
        title: `${deployedApp.name} berhasil online`,
        description: `Versi ${deployedApp.active_version} aktif di ${deployedApp.url.replace(/^https?:\/\//, '')}.`,
        variant: 'success',
      });
      emit('deployed', deployedApp);
    } else {
      toastStore.push({
        title: 'Deployment gagal diproses',
        description: 'Silakan coba jalankan ulang beberapa saat lagi.',
        variant: 'error',
      });
    }
  } catch {
    toastStore.push({
      title: 'Terjadi gangguan jaringan',
      description: 'Proses deployment terhenti sebelum selesai. Coba tekan Simpan dan deploy kembali.',
      variant: 'error',
    });
  } finally {
    wizardStore.deploying = false;
    wizardStore.deployStageIndex = -1;
  }
}
</script>

<template>
  <section aria-label="Tab Submission" class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div class="space-y-1">
        <h1 class="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--ink-900)]">
          Submission Aplikasi Baru
        </h1>
        <p class="text-sm text-[var(--ink-500)]">
          Ikuti 5 langkah terpandu dari penyiapan struktur folder hingga aplikasi Laravel Anda tayang.
        </p>
      </div>

      <button
        v-if="hasDraftData && !wizardStore.deploying"
        type="button"
        class="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-[4px] border border-[var(--border)] bg-[var(--card)] text-xs font-medium text-[var(--ink-700)] hover:text-[var(--ink-900)] hover:border-[var(--ink-500)] whitespace-nowrap shrink-0 cursor-pointer transition-colors"
        @click="handleResetDraft"
      >
        <RotateCcw class="h-3.5 w-3.5" aria-hidden="true" />
        <span>Reset draft</span>
      </button>
    </div>

    <div
      v-if="referenceError"
      role="alert"
      class="rounded-[4px] border border-[var(--status-error-text)]/35 bg-[var(--status-error-bg)] px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
    >
      <div class="flex items-start gap-2.5 text-sm text-[var(--status-error-text)]">
        <AlertCircle class="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
        <span>{{ referenceError }}</span>
      </div>
      <UiButton variant="outline" size="sm" @click="loadReferenceData">
        <RefreshCw class="h-3.5 w-3.5" aria-hidden="true" />
        <span>Muat ulang panduan</span>
      </UiButton>
    </div>

    <UiStepper
      :steps="SUBMISSION_STEPS"
      :current-step="wizardStore.currentStep"
      :interactive="!wizardStore.deploying"
      @select="handleStepperSelect"
    />

    <StepAppInfo
      v-if="wizardStore.currentStep === 1"
      :app-name="wizardStore.appName"
      :app-description="wizardStore.appDescription"
      @update:app-name="(val) => (wizardStore.appName = val)"
      @update:app-description="(val) => (wizardStore.appDescription = val)"
      @next="wizardStore.setStep(2)"
    />

    <StepSelectStack
      v-else-if="wizardStore.currentStep === 2"
      :stacks="stacks"
      :loading="loadingReference"
      :selected-slug="wizardStore.selectedStackSlug"
      @update:selected-slug="(slug) => (wizardStore.selectedStackSlug = slug)"
      @prev="wizardStore.setStep(1)"
      @next="wizardStore.setStep(3)"
    />

    <StepFolderGuide
      v-else-if="wizardStore.currentStep === 3"
      :app-name="wizardStore.appName"
      :folder-guides="folderGuides"
      :validation-rules="validationRules"
      :loading="loadingReference"
      @downloaded="handleTemplateDownloaded"
      @prev="wizardStore.setStep(2)"
      @next="wizardStore.setStep(4)"
    />

    <StepUploadValidate
      v-else-if="wizardStore.currentStep === 4"
      :app-name="wizardStore.appName"
      :uploaded-file="wizardStore.uploadedFile"
      :validation-result="wizardStore.validationResult"
      @file-selected="(file) => wizardStore.setUploadedFile(file)"
      @validated="(res) => wizardStore.setValidationResult(res)"
      @reset-upload="wizardStore.clearValidation()"
      @prev="wizardStore.setStep(3)"
      @next="wizardStore.setStep(5)"
    />

    <StepEnvDeploy
      v-else
      :app-name="wizardStore.appName"
      :env-keys="wizardStore.envKeys"
      :env-values="wizardStore.envValues"
      :deploying="wizardStore.deploying"
      :deploy-stage-index="wizardStore.deployStageIndex"
      @update-env="({ key, value }) => wizardStore.setEnvValue(key, value)"
      @prev="wizardStore.setStep(4)"
      @deploy="handleDeploy"
    />
  </section>
</template>
