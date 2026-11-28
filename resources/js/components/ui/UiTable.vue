<script setup>
import { cn } from '@/utils/cn';

defineProps({
  columns: {
    type: Array,
    required: true,
    // [{ key: string, label: string, align?: 'left' | 'right', mono?: boolean }]
  },
  rows: {
    type: Array,
    default: () => [],
  },
  rowKey: {
    type: String,
    default: 'id',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  caption: {
    type: String,
    default: '',
  },
  emptyTitle: {
    type: String,
    default: 'Belum ada data tersedia',
  },
  emptyDescription: {
    type: String,
    default: 'Data akan muncul di tabel ini setelah Anda menambahkan entri pertama.',
  },
  class: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <div :class="cn('w-full rounded-[4px] border border-[var(--border)] bg-[var(--card)] overflow-hidden', $props.class)">
    <div class="w-full overflow-x-auto">
      <table class="w-full border-collapse text-left text-sm">
        <caption v-if="caption" class="sr-only">
          {{ caption }}
        </caption>

        <thead>
          <tr class="border-b border-[var(--border)] bg-[#f7f9ef]">
            <th
              v-for="col in columns"
              :key="col.key"
              scope="col"
              :class="cn(
                'px-2.5 first:pl-4 last:pr-4 py-3 text-xs font-semibold text-[var(--ink-700)] whitespace-nowrap',
                col.align === 'right' ? 'text-right' : 'text-left',
              )"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>

        <tbody v-if="loading" class="divide-y divide-[var(--border)]">
          <tr v-for="n in 4" :key="n">
            <td v-for="col in columns" :key="col.key" class="px-2.5 first:pl-4 last:pr-4 py-3.5">
              <div class="h-4 w-3/4 rounded-[2px] bg-[#edf1e1] animate-pulse" />
            </td>
          </tr>
        </tbody>

        <tbody v-else-if="rows.length === 0">
          <tr>
            <td :colspan="columns.length" class="px-6 py-12 text-center">
              <slot name="empty">
                <p class="text-sm font-semibold text-[var(--ink-900)]">
                  {{ emptyTitle }}
                </p>
                <p class="mt-1 text-sm text-[var(--ink-500)] max-w-md mx-auto">
                  {{ emptyDescription }}
                </p>
              </slot>
            </td>
          </tr>
        </tbody>

        <tbody v-else class="divide-y divide-[var(--border)]">
          <tr
            v-for="(row, rowIndex) in rows"
            :key="row[rowKey] ?? rowIndex"
            class="hover:bg-[#fafcf3] transition-colors"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              :class="cn(
                'px-2.5 first:pl-4 last:pr-4 py-3 text-[var(--ink-900)] align-middle',
                col.align === 'right' ? 'text-right' : 'text-left',
                col.mono ? 'font-mono text-[13px] tabular-nums' : '',
              )"
            >
              <slot
                :name="`cell-${col.key}`"
                :row="row"
                :value="row[col.key]"
              >
                {{ row[col.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
