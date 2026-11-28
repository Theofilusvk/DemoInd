<script setup>
import { Plus, Search, X } from 'lucide-vue-next';
import { UiButton } from '@/components/ui';
import { DEPLOYMENT_STATUS_ORDER } from '@/utils/deploymentHelpers';

const props = defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
  statusFilter: {
    type: String,
    default: 'all',
  },
  statusCounts: {
    type: Object,
    required: true,
  },
  totalCount: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits([
  'update:searchQuery',
  'update:statusFilter',
  'go-submission',
]);

const STATUS_LABELS = {
  all: 'Semua',
  success: 'success',
  running: 'running',
  queued: 'queued',
  failed: 'failed',
  stopped: 'stopped',
};
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div class="space-y-1">
        <h1 class="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--ink-900)]">
          Daftar Deployment
        </h1>
        <p class="text-sm text-[var(--ink-500)]">
          Pantau status aplikasi, baca log deployment, unggah rilis baru, atau kembalikan ke versi sebelumnya.
        </p>
      </div>

      <UiButton
        variant="primary"
        size="md"
        @click="emit('go-submission')"
      >
        <Plus class="h-4 w-4" aria-hidden="true" />
        <span>Deploy aplikasi baru</span>
      </UiButton>
    </div>

    <div
      v-if="totalCount > 0"
      class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-t border-[var(--border)] pt-4"
    >
      <div
        role="group"
        aria-label="Filter status deployment"
        class="flex flex-wrap items-center gap-1.5"
      >
        <button
          v-for="statusKey in DEPLOYMENT_STATUS_ORDER"
          :key="statusKey"
          type="button"
          :aria-pressed="statusFilter === statusKey ? 'true' : 'false'"
          :class="[
            'h-8 px-2.5 inline-flex items-center gap-1.5 rounded-[4px] border text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer',
            statusKey !== 'all' ? 'font-mono' : '',
            statusFilter === statusKey
              ? 'bg-[var(--ink-900)] text-white border-[var(--ink-900)]'
              : 'bg-[var(--card)] text-[var(--ink-700)] border-[var(--border)] hover:border-[var(--ink-500)] hover:text-[var(--ink-900)]',
          ]"
          @click="emit('update:statusFilter', statusKey)"
        >
          <span>{{ STATUS_LABELS[statusKey] }}</span>
          <span
            :class="[
              'font-mono text-[11px] tabular-nums',
              statusFilter === statusKey ? 'text-[var(--yellow-300)]' : 'text-[var(--ink-500)]',
            ]"
          >
            {{ statusCounts[statusKey] ?? 0 }}
          </span>
        </button>
      </div>

      <div class="relative w-full lg:w-72 shrink-0">
        <Search
          class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ink-500)]"
          aria-hidden="true"
        />
        <input
          type="search"
          :value="searchQuery"
          aria-label="Cari aplikasi deployment"
          placeholder="Cari nama aplikasi atau URL..."
          class="w-full h-9 rounded-[4px] border border-[var(--border)] bg-[var(--card)] pl-9 pr-8 text-sm text-[var(--ink-900)] placeholder:text-[var(--ink-300)] hover:border-[var(--ink-500)] focus:border-[var(--ink-900)] transition-colors"
          @input="emit('update:searchQuery', $event.target.value)"
        />
        <button
          v-if="searchQuery"
          type="button"
          aria-label="Hapus kata kunci pencarian"
          class="absolute right-1.5 top-1/2 -translate-y-1/2 h-6 w-6 inline-flex items-center justify-center rounded-[4px] text-[var(--ink-500)] hover:text-[var(--ink-900)] cursor-pointer"
          @click="emit('update:searchQuery', '')"
        >
          <X class="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
</template>
