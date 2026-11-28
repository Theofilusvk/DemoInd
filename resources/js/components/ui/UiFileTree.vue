<script setup>
import { Folder, FileText } from 'lucide-vue-next';
import { cn } from '@/utils/cn';
import UiBadge from './UiBadge.vue';

const props = defineProps({
  rootLabel: {
    type: String,
    default: 'proyek-laravel/',
  },
  items: {
    type: Array,
    required: true,
    // [{ path: string, description?: string, is_required?: boolean, type?: 'dir' | 'file', step_order?: number }]
  },
  variant: {
    type: String,
    default: 'light', // 'light' | 'terminal'
  },
  showRequirement: {
    type: Boolean,
    default: true,
  },
  class: {
    type: String,
    default: '',
  },
});

function isFolder(item) {
  if (item.type) return item.type === 'dir';
  return item.path.endsWith('/');
}
</script>

<template>
  <div
    :class="cn(
      'rounded-[4px] border overflow-hidden',
      variant === 'terminal'
        ? 'bg-[var(--terminal-bg)] border-[var(--terminal-border)] text-[var(--terminal-text)]'
        : 'bg-[var(--card)] border-[var(--border)] text-[var(--ink-900)]',
      props.class,
    )"
  >
    <div
      :class="cn(
        'flex items-center justify-between gap-3 px-4 py-2.5 border-b font-mono text-xs',
        variant === 'terminal'
          ? 'border-[var(--terminal-border)] text-[var(--terminal-muted)] bg-[#11170e]'
          : 'border-[var(--border)] text-[var(--ink-500)] bg-[#f7f9ef]',
      )"
    >
      <span class="font-medium truncate">{{ rootLabel }}</span>
      <span class="tabular-nums shrink-0">{{ items.length }} item</span>
    </div>

    <ul class="divide-y" :class="variant === 'terminal' ? 'divide-[#232d1d]' : 'divide-[var(--border)]/70'">
      <li
        v-for="(item, index) in items"
        :key="item.path"
        :class="cn(
          'px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm',
          variant === 'terminal' ? 'hover:bg-[#1e2718]' : 'hover:bg-[#fafcf3]',
        )"
      >
        <div class="flex items-start sm:items-center gap-2.5 min-w-0">
          <span
            aria-hidden="true"
            :class="cn(
              'font-mono text-xs select-none shrink-0',
              variant === 'terminal' ? 'text-[#6c7b61]' : 'text-[var(--ink-300)]',
            )"
          >
            {{ index === items.length - 1 ? '└──' : '├──' }}
          </span>

          <Folder
            v-if="isFolder(item)"
            :class="cn(
              'h-4 w-4 shrink-0 mt-0.5 sm:mt-0',
              variant === 'terminal' ? 'text-[var(--yellow-300)]' : 'text-[var(--ink-700)]',
            )"
            aria-hidden="true"
          />
          <FileText
            v-else
            :class="cn(
              'h-4 w-4 shrink-0 mt-0.5 sm:mt-0',
              variant === 'terminal' ? 'text-[var(--green-300)]' : 'text-[var(--ink-500)]',
            )"
            aria-hidden="true"
          />

          <div class="min-w-0 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
            <code
              :class="cn(
                'font-mono text-[13px] font-medium shrink-0',
                variant === 'terminal' ? 'text-[#f2f7ec]' : 'text-[var(--ink-900)]',
              )"
            >
              {{ item.path }}
            </code>
            <span
              v-if="item.description"
              :class="cn(
                'text-xs leading-relaxed',
                variant === 'terminal' ? 'text-[var(--terminal-muted)]' : 'text-[var(--ink-500)]',
              )"
            >
              {{ item.description }}
            </span>
          </div>
        </div>

        <div v-if="showRequirement && item.is_required !== undefined" class="shrink-0 pl-8 sm:pl-0">
          <UiBadge
            v-if="variant === 'light'"
            :variant="item.is_required ? 'success' : 'neutral'"
          >
            {{ item.is_required ? 'Wajib' : 'Opsional' }}
          </UiBadge>
          <span
            v-else
            class="font-mono text-[11px] px-1.5 py-0.5 rounded-[2px] border"
            :class="item.is_required
              ? 'border-[#3e5232] text-[var(--green-300)] bg-[#1e2a17]'
              : 'border-[#333f2c] text-[var(--terminal-muted)]'"
          >
            {{ item.is_required ? 'wajib' : 'opsional' }}
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>
