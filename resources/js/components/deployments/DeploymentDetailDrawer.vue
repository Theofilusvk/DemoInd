<script setup>
import { computed, ref } from 'vue';
import {
  Check,
  Copy,
  ExternalLink,
  RotateCcw,
  Square,
  Terminal,
  Upload,
} from 'lucide-vue-next';
import { UiBadge, UiButton, UiDrawer } from '@/components/ui';
import { canStopDeployment, getPreviousRollbackTarget } from '@/utils/deploymentHelpers';
import DeploymentStatusBadge from './DeploymentStatusBadge.vue';

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  deployment: {
    type: Object,
    default: null,
  },
  busy: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'upload', 'rollback', 'stop']);

const copied = ref(false);

const rollbackTarget = computed(() => getPreviousRollbackTarget(props.deployment));
const stoppable = computed(() =>
  props.deployment ? canStopDeployment(props.deployment.status) : false,
);

function lineClass(line) {
  const text = String(line ?? '');
  if (text.includes('ERROR:') || text.includes('Gagal')) {
    return 'text-[#ffb4ab]';
  }
  if (text.includes('Saran:')) {
    return 'text-[var(--yellow-300)]';
  }
  if (text.includes('200 OK') || text.includes('selesai dan aktif') || text.includes('kini aktif')) {
    return 'text-[var(--green-300)]';
  }
  return 'text-[var(--terminal-text)]';
}

async function copyLogs() {
  if (!props.deployment?.logs?.length) return;
  const content = props.deployment.logs.join('\n');
  try {
    await navigator.clipboard?.writeText(content);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 1800);
  } catch {
    copied.value = false;
  }
}
</script>

<template>
  <UiDrawer
    :open="open && Boolean(deployment)"
    :title="deployment?.name || ''"
    :subtitle="deployment?.url || ''"
    @close="emit('close')"
  >
    <div v-if="deployment" class="space-y-6">
      <!-- Ringkasan aplikasi -->
      <section aria-labelledby="detail-info-heading" class="space-y-3">
        <div class="flex items-center justify-between gap-3">
          <h3 id="detail-info-heading" class="text-xs font-semibold uppercase tracking-wide text-[var(--ink-500)]">
            Informasi Aplikasi
          </h3>
          <DeploymentStatusBadge :status="deployment.status" />
        </div>

        <p class="text-sm text-[var(--ink-700)] leading-relaxed">
          {{ deployment.description }}
        </p>

        <dl class="grid grid-cols-2 gap-px bg-[var(--border)] border border-[var(--border)] rounded-[4px] overflow-hidden">
          <div class="bg-[var(--card)] p-3">
            <dt class="text-xs text-[var(--ink-500)]">Stack</dt>
            <dd class="mt-0.5 text-sm font-medium text-[var(--ink-900)]">
              {{ deployment.stack }}
            </dd>
          </div>
          <div class="bg-[var(--card)] p-3">
            <dt class="text-xs text-[var(--ink-500)]">Versi aktif</dt>
            <dd class="mt-0.5 font-mono text-sm font-semibold text-[var(--ink-900)] tabular-nums">
              {{ deployment.active_version }}
            </dd>
          </div>
          <div class="bg-[var(--card)] p-3">
            <dt class="text-xs text-[var(--ink-500)]">Deploy terakhir</dt>
            <dd class="mt-0.5 font-mono text-xs text-[var(--ink-900)] tabular-nums">
              {{ deployment.last_deployed_at }}
            </dd>
          </div>
          <div class="bg-[var(--card)] p-3">
            <dt class="text-xs text-[var(--ink-500)]">Alamat URL</dt>
            <dd class="mt-0.5 truncate">
              <a
                v-if="deployment.status === 'success'"
                :href="deployment.url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 font-mono text-xs text-[var(--ink-900)] underline underline-offset-2"
              >
                <span class="truncate">{{ deployment.url.replace(/^https?:\/\//, '') }}</span>
                <ExternalLink class="h-3 w-3 shrink-0" aria-hidden="true" />
              </a>
              <span v-else class="font-mono text-xs text-[var(--ink-500)]">
                {{ deployment.url.replace(/^https?:\/\//, '') }}
              </span>
            </dd>
          </div>
        </dl>

        <div class="flex flex-wrap items-center gap-2 pt-1">
          <UiButton
            variant="primary"
            size="sm"
            :disabled="busy"
            @click="emit('upload', deployment)"
          >
            <Upload class="h-3.5 w-3.5" aria-hidden="true" />
            <span>Upload versi baru</span>
          </UiButton>

          <UiButton
            variant="outline"
            size="sm"
            :disabled="!rollbackTarget || busy"
            @click="emit('rollback', { deployment, version: rollbackTarget?.version })"
          >
            <RotateCcw class="h-3.5 w-3.5" aria-hidden="true" />
            <span>{{ rollbackTarget ? `Rollback ke ${rollbackTarget.version}` : 'Rollback' }}</span>
          </UiButton>

          <UiButton
            variant="danger"
            size="sm"
            :disabled="!stoppable || busy"
            @click="emit('stop', deployment)"
          >
            <Square class="h-3 w-3" aria-hidden="true" />
            <span>Hentikan</span>
          </UiButton>
        </div>
      </section>

      <!-- Riwayat versi -->
      <section aria-labelledby="detail-versions-heading" class="space-y-3 border-t border-[var(--border)] pt-5">
        <div class="flex items-center justify-between gap-2">
          <h3 id="detail-versions-heading" class="text-xs font-semibold uppercase tracking-wide text-[var(--ink-500)]">
            Riwayat Versi
          </h3>
          <span class="font-mono text-xs text-[var(--ink-500)] tabular-nums">
            {{ deployment.versions?.length || 0 }} rilis
          </span>
        </div>

        <ul class="divide-y divide-[var(--border)] border border-[var(--border)] rounded-[4px] bg-[var(--card)]">
          <li
            v-for="ver in deployment.versions"
            :key="`${ver.version}-${ver.deployed_at}`"
            class="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div class="min-w-0 space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="font-mono text-sm font-semibold text-[var(--ink-900)] tabular-nums">
                  {{ ver.version }}
                </span>
                <UiBadge v-if="ver.version === deployment.active_version" variant="info" mono>
                  aktif
                </UiBadge>
                <DeploymentStatusBadge :status="ver.status" />
              </div>
              <p class="text-xs text-[var(--ink-700)]">
                {{ ver.note }}
              </p>
              <p class="font-mono text-[11px] text-[var(--ink-500)] tabular-nums">
                {{ ver.deployed_at }}
              </p>
            </div>

            <UiButton
              v-if="ver.version !== deployment.active_version"
              variant="subtle"
              size="sm"
              :disabled="busy"
              @click="emit('rollback', { deployment, version: ver.version })"
            >
              <RotateCcw class="h-3.5 w-3.5" aria-hidden="true" />
              <span>Rollback</span>
            </UiButton>
          </li>
        </ul>
      </section>

      <!-- Log deployment -->
      <section aria-labelledby="detail-logs-heading" class="space-y-2.5 border-t border-[var(--border)] pt-5">
        <div class="flex items-center justify-between gap-2">
          <h3
            id="detail-logs-heading"
            class="text-xs font-semibold uppercase tracking-wide text-[var(--ink-500)] inline-flex items-center gap-1.5"
          >
            <Terminal class="h-3.5 w-3.5 text-[var(--ink-700)]" aria-hidden="true" />
            <span>Log Deployment</span>
          </h3>

          <button
            type="button"
            class="h-7 px-2 inline-flex items-center gap-1.5 rounded-[4px] border border-[var(--border)] bg-[var(--card)] text-xs font-medium text-[var(--ink-700)] hover:text-[var(--ink-900)] hover:border-[var(--ink-500)] transition-colors cursor-pointer"
            @click="copyLogs"
          >
            <Check v-if="copied" class="h-3.5 w-3.5 text-[var(--status-success-text)]" aria-hidden="true" />
            <Copy v-else class="h-3.5 w-3.5" aria-hidden="true" />
            <span>{{ copied ? 'Tersalin' : 'Salin log' }}</span>
          </button>
        </div>

        <div class="rounded-[4px] border border-[var(--ink-900)] bg-[var(--terminal-bg)] overflow-hidden">
          <div class="flex items-center justify-between px-3.5 py-2 border-b border-white/10 text-[11px] font-mono text-[var(--terminal-muted)]">
            <span>{{ deployment.name }} · {{ deployment.active_version }}</span>
            <span class="tabular-nums">{{ deployment.logs?.length || 0 }} baris</span>
          </div>

          <div
            role="log"
            aria-label="Log proses deployment"
            class="p-3.5 max-h-72 overflow-y-auto font-mono text-xs leading-6 space-y-1"
          >
            <p
              v-for="(line, index) in deployment.logs"
              :key="index"
              :class="['break-words', lineClass(line)]"
            >
              <span class="select-none text-[var(--terminal-muted)] mr-2 tabular-nums">
                {{ String(index + 1).padStart(2, '0') }}
              </span>
              <span>{{ line }}</span>
            </p>
          </div>
        </div>
      </section>
    </div>

    <template #footer>
      <UiButton variant="subtle" size="sm" @click="emit('close')">
        Tutup panel
      </UiButton>
    </template>
  </UiDrawer>
</template>
