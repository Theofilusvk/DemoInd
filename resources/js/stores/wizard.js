import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * State wizard Submission disimpan di Pinia agar tidak hilang saat pengguna berpindah tab.
 */
export const useWizardStore = defineStore('wizard', () => {
  const currentStep = ref(1);
  const maxReachedStep = ref(1);
  const appName = ref('');
  const appDescription = ref('');
  const selectedStackSlug = ref('laravel');
  const uploadedFile = ref(null); // { name: string, size: number } | null
  const validationResult = ref(null);
  const envKeys = ref([]);
  const envValues = ref({});
  const deploying = ref(false);
  const deployStageIndex = ref(-1);

  function setStep(step) {
    if (step >= 1 && step <= 5) {
      currentStep.value = step;
      if (step > maxReachedStep.value) {
        maxReachedStep.value = step;
      }
    }
  }

  function setUploadedFile(file) {
    uploadedFile.value = file ? { name: file.name, size: file.size } : null;
  }

  function setValidationResult(result) {
    validationResult.value = result;
    if (result?.passed && Array.isArray(result.envKeys)) {
      envKeys.value = result.envKeys;
      const nextValues = { ...envValues.value };
      for (const item of result.envKeys) {
        if (nextValues[item.key] === undefined) {
          nextValues[item.key] = item.defaultValue ?? '';
        }
      }
      envValues.value = nextValues;
    }
  }

  function clearValidation() {
    uploadedFile.value = null;
    validationResult.value = null;
  }

  function setEnvValue(key, value) {
    envValues.value = {
      ...envValues.value,
      [key]: value,
    };
  }

  function reset() {
    currentStep.value = 1;
    maxReachedStep.value = 1;
    appName.value = '';
    appDescription.value = '';
    selectedStackSlug.value = 'laravel';
    uploadedFile.value = null;
    validationResult.value = null;
    envKeys.value = [];
    envValues.value = {};
    deploying.value = false;
    deployStageIndex.value = -1;
  }

  return {
    currentStep,
    maxReachedStep,
    appName,
    appDescription,
    selectedStackSlug,
    uploadedFile,
    validationResult,
    envKeys,
    envValues,
    deploying,
    deployStageIndex,
    setStep,
    setUploadedFile,
    setValidationResult,
    clearValidation,
    setEnvValue,
    reset,
  };
});
