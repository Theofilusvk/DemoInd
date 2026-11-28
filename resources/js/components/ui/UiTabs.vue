<script setup>
import { nextTick, ref, useId } from 'vue';
import { cn } from '@/utils/cn';

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  tabs: {
    type: Array,
    required: true,
    // [{ value: string, label: string, count?: number, disabled?: boolean }]
  },
  ariaLabel: {
    type: String,
    default: 'Navigasi tab',
  },
  borderless: {
    type: Boolean,
    default: false,
  },
  class: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);
const uid = useId();
const tabButtons = ref([]);

function selectTab(value, disabled) {
  if (disabled) return;
  emit('update:modelValue', value);
}

async function activateAndFocus(targetTab) {
  if (!targetTab) return;
  emit('update:modelValue', targetTab.value);
  await nextTick();
  const targetIndex = props.tabs.findIndex((t) => t.value === targetTab.value);
  tabButtons.value[targetIndex]?.focus();
}

function handleKeydown(event, index) {
  const enabledTabs = props.tabs.filter((t) => !t.disabled);
  if (!enabledTabs.length) return;

  const currentTab = props.tabs[index];
  const enabledIndex = enabledTabs.findIndex((t) => t.value === currentTab.value);

  if (event.key === 'ArrowRight') {
    event.preventDefault();
    const next = enabledTabs[(enabledIndex + 1) % enabledTabs.length];
    activateAndFocus(next);
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault();
    const prev = enabledTabs[(enabledIndex - 1 + enabledTabs.length) % enabledTabs.length];
    activateAndFocus(prev);
  } else if (event.key === 'Home') {
    event.preventDefault();
    activateAndFocus(enabledTabs[0]);
  } else if (event.key === 'End') {
    event.preventDefault();
    activateAndFocus(enabledTabs[enabledTabs.length - 1]);
  }
}
</script>

<template>
  <div :class="cn('w-full', props.class)">
    <div
      role="tablist"
      :aria-label="ariaLabel"
      :class="cn(
        'flex items-end gap-6 overflow-x-auto',
        borderless ? '' : 'border-b border-[var(--border)]',
      )"
    >
      <button
        v-for="(tab, index) in tabs"
        :id="`tab-${uid}-${tab.value}`"
        :key="tab.value"
        :ref="(el) => { if (el) tabButtons[index] = el; }"
        type="button"
        role="tab"
        :aria-selected="modelValue === tab.value ? 'true' : 'false'"
        :aria-controls="$slots.default ? `panel-${uid}-${tab.value}` : undefined"
        :tabindex="modelValue === tab.value ? 0 : -1"
        :disabled="tab.disabled"
        :class="cn(
          'relative pb-3 pt-2 text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed flex items-center gap-2',
          modelValue === tab.value
            ? 'text-[var(--ink-900)] font-semibold'
            : 'text-[var(--ink-500)] hover:text-[var(--ink-900)]',
        )"
        @click="selectTab(tab.value, tab.disabled)"
        @keydown="handleKeydown($event, index)"
      >
        <span>{{ tab.label }}</span>
        <span
          v-if="tab.count !== undefined"
          class="font-mono text-xs tabular-nums text-[var(--ink-500)]"
        >
          ({{ tab.count }})
        </span>
        <!-- Garis aksen 4px gradient kuning ke hijau khusus tab aktif -->
        <span
          v-if="modelValue === tab.value"
          aria-hidden="true"
          class="demoind-accent-bar absolute inset-x-0 bottom-0 h-[4px]"
        />
      </button>
    </div>

    <div
      v-if="$slots.default"
      :id="`panel-${uid}-${modelValue}`"
      role="tabpanel"
      :aria-labelledby="`tab-${uid}-${modelValue}`"
      class="pt-5"
    >
      <slot />
    </div>
  </div>
</template>
