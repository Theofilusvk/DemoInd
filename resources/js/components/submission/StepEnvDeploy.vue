<script setup>
import { computed, ref } from 'vue';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Loader2,
  Lock,
  Rocket,
  Sparkles,
} from 'lucide-vue-next';
import { UiBadge, UiButton, UiCard, UiInput } from '@/components/ui';
import {
  DEPLOY_PIPELINE_STEPS,
  slugifyAppName,
  validateEnvValues,
} from '@/utils/submissionHelpers';

const props = defineProps({
  appName: {
    type: String,
    default: '',
  },
  envKeys: {
    type: Array,
    default: () => [],
  },
  envValues: {
    type: Object,
    default: () => ({}),
  },
  deploying: {
    type: Boolean,
    default: false,
  },
  deployStageIndex: {
    type: Number,
    default: -1,
  },
});

const emit = defineEmits(['update-env', 'prev', 'deploy']);

const submittedAttempt = ref(false);

const validation = computed(() => validateEnvValues(props.envKeys, props.envValues));
const targetDomain = computed(() => `${slugifyAppName(props.appName) || 'aplikasi-baru'}.domain.com`);

function fillDemoDbValues() {
  const slug = slugifyAppName(props.appName) || 'aplikasi_laravel';
  const dbSlug = slug.replace(/-/g, '_');
  if (!props.envValues.APP_NAME) {
    emit('update-env', { key: 'APP_NAME', value: props.appName || 'DemoInd App' });
  }
  if (!props.envValues.DB_DATABASE) {
    emit('update-env', { key: 'DB_DATABASE', value: `db_${dbSlug}` });
  }
  if (!props.envValues.DB_USERNAME) {
    emit('update-env', { key: 'DB_USERNAME', value: `usr_${dbSlug}` });
  }
  if (!props.envValues.DB_PASSWORD) {
    emit('update-env', { key: 'DB_PASSWORD', value: 'SandiDbDemo2026!' });
  }
}

function handleSubmit() {
  submittedAttempt.value = true;
  if (!validation.value.valid) return;
  emit('deploy');
}

function stepStatus(index) {
  if (props.deployStageIndex > index) return 'done';
  if (props.deployStageIndex === index) return 'running';
  return 'pending';
}
</script>

<template>
  <UiCard v-if="!deploying" padding="lg" class="space-y-5">
    <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[var(--border)] pb-4">
      <div class="space-y-1">
        <h2 class="text-base font-semibold text-[var(--ink-900)]">
          Langkah 5: Environment dan deploy
        </h2>
        <p class="text-sm text-[var(--ink-500)]">
          Isi nilai variabel yang ditemukan pada berkas <code class="font-mono text-xs text-[var(--ink-900)]">.env.example</code> untuk aplikasi <code class="font-mono text-xs text-[var(--ink-900)]">{{ targetDomain }}</code>.
        </p>
      </div>

      <button
        type="button"
        class="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-[4px] border border-[var(--border)] bg-[var(--card)] text-xs font-medium text-[var(--ink-700)] hover:text-[var(--ink-900)] hover:border-[var(--ink-500)] whitespace-nowrap shrink-0 cursor-pointer transition-colors"
        @click="fillDemoDbValues"
      >
        <Sparkles class="h-3.5 w-3.5" aria-hidden="true" />
        <span>Isi contoh nilai database</span>
      </button>
    </div>

    <!-- Catatan keamanan enkripsi -->
    <div class="rounded-[4px] border border-[var(--status-info-text)]/30 bg-[var(--status-info-bg)]/60 px-4 py-3 flex items-start gap-2.5 text-xs text-[var(--ink-900)]">
      <Lock class="h-4 w-4 text-[var(--status-info-text)] shrink-0 mt-0.5" aria-hidden="true" />
      <p class="leading-relaxed">
        <strong class="font-semibold">Keamanan variabel environment:</strong>
        nilai tersimpan terenkripsi dan tidak ditampilkan lagi setelah Anda menekan tombol <em>Simpan dan deploy</em>. Gunakan ikon mata pada masing-masing kolom jika ingin memeriksa ketikan Anda.
      </p>
    </div>

    <form id="submission-env-form" class="divide-y divide-[var(--border)] border border-[var(--border)] rounded-[4px]" novalidate @submit.prevent="handleSubmit">
      <div v-if="envKeys.length === 0" class="p-6 text-center bg-[var(--card)] space-y-1">
        <p class="text-sm font-semibold text-[var(--ink-900)]">
          Tidak ada variabel pada <code class="font-mono text-xs">.env.example</code>
        </p>
        <p class="text-xs text-[var(--ink-500)]">
          Anda dapat langsung melanjutkan proses deployment menggunakan konfigurasi bawaan server.
        </p>
      </div>

      <div
        v-for="item in envKeys"
        :key="item.key"
        class="p-4 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-3 md:gap-6 items-start bg-[var(--card)]"
      >
        <div class="space-y-1 pt-0.5">
          <div class="flex items-center gap-2 flex-wrap">
            <label :for="`env-${item.key}`" class="font-mono text-xs font-semibold text-[var(--ink-900)]">
              {{ item.key }}
            </label>
            <UiBadge :variant="item.required ? 'success' : 'neutral'">
              {{ item.required ? 'Wajib' : 'Opsional' }}
            </UiBadge>
          </div>
          <p class="text-xs text-[var(--ink-500)] leading-relaxed">
            {{ item.hint }}
          </p>
        </div>

        <UiInput
          :id="`env-${item.key}`"
          :name="`env_${item.key}`"
          type="password"
          :password-toggle="true"
          :mono="true"
          :model-value="envValues[item.key] ?? ''"
          :placeholder="item.placeholder"
          :required="item.required"
          :error="submittedAttempt ? validation.errors[item.key] || '' : ''"
          autocomplete="off"
          @update:model-value="emit('update-env', { key: item.key, value: $event })"
        />
      </div>
    </form>

    <div class="flex items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
      <UiButton variant="subtle" size="md" @click="emit('prev')">
        <ArrowLeft class="h-4 w-4" aria-hidden="true" />
        <span>Kembali</span>
      </UiButton>

      <UiButton type="submit" form="submission-env-form" variant="primary" size="md">
        <Rocket class="h-4 w-4" aria-hidden="true" />
        <span>Simpan dan deploy</span>
      </UiButton>
    </div>
  </UiCard>

  <!-- Panel progres langkah deployment -->
  <UiCard v-else padding="lg" class="space-y-5">
    <div class="space-y-1 border-b border-[var(--border)] pb-4">
      <h2 class="text-base font-semibold text-[var(--ink-900)]">
        Menjalankan deployment {{ targetDomain }}
      </h2>
      <p class="text-sm text-[var(--ink-500)]">
        Mohon tunggu sebentar. Setelah cek kesehatan selesai, Anda akan diarahkan otomatis ke tab Deployment.
      </p>
    </div>

    <ol aria-label="Progres tahapan deployment" class="divide-y divide-[var(--border)] border border-[var(--border)] rounded-[4px] bg-[var(--card)]">
      <li
        v-for="(stage, idx) in DEPLOY_PIPELINE_STEPS"
        :key="stage.key"
        :class="[
          'px-4 py-3.5 flex items-start justify-between gap-4 transition-colors',
          stepStatus(idx) === 'running' ? 'bg-[#fafcf2]' : '',
        ]"
      >
        <div class="flex items-start gap-3 min-w-0">
          <span class="mt-0.5 shrink-0">
            <CheckCircle2
              v-if="stepStatus(idx) === 'done'"
              class="h-4 w-4 text-[var(--status-success-text)]"
              aria-hidden="true"
            />
            <Loader2
              v-else-if="stepStatus(idx) === 'running'"
              class="h-4 w-4 text-[var(--ink-900)] animate-spin"
              aria-hidden="true"
            />
            <Clock
              v-else
              class="h-4 w-4 text-[var(--ink-300)]"
              aria-hidden="true"
            />
          </span>

          <div class="min-w-0">
            <p
              :class="[
                'text-sm',
                stepStatus(idx) === 'pending'
                  ? 'text-[var(--ink-500)]'
                  : 'font-semibold text-[var(--ink-900)]',
              ]"
            >
              {{ idx + 1 }}. {{ stage.label }}
            </p>
            <p class="text-xs text-[var(--ink-500)] mt-0.5">
              {{ stage.detail }}
            </p>
          </div>
        </div>

        <UiBadge
          :variant="stepStatus(idx) === 'done' ? 'success' : stepStatus(idx) === 'running' ? 'info' : 'neutral'"
          mono
        >
          {{ stepStatus(idx) === 'done' ? 'selesai' : stepStatus(idx) === 'running' ? 'proses' : 'antre' }}
        </UiBadge>
      </li>
    </ol>
  </UiCard>
</template>
