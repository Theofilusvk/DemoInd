<script setup>
import { Check } from 'lucide-vue-next';
import { cn } from '@/utils/cn';

const props = defineProps({
  steps: {
    type: Array,
    required: true,
    // [{ number: number, title: string, subtitle?: string }]
  },
  currentStep: {
    type: Number,
    required: true,
  },
  interactive: {
    type: Boolean,
    default: false,
  },
  class: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['select']);

function getState(stepNumber) {
  if (stepNumber < props.currentStep) return 'completed';
  if (stepNumber === props.currentStep) return 'active';
  return 'upcoming';
}

function handleSelect(stepNumber) {
  if (!props.interactive) return;
  emit('select', stepNumber);
}
</script>

<template>
  <nav aria-label="Tahapan wizard" :class="cn('w-full', props.class)">
    <ol class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border border-[var(--border)] rounded-[4px] bg-[var(--card)] divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)] overflow-hidden">
      <li
        v-for="step in steps"
        :key="step.number"
        class="relative"
      >
        <component
          :is="interactive ? 'button' : 'div'"
          :type="interactive ? 'button' : undefined"
          :aria-current="getState(step.number) === 'active' ? 'step' : undefined"
          :class="cn(
            'w-full text-left px-4 py-3.5 flex items-start gap-3 transition-colors h-full',
            getState(step.number) === 'active' ? 'bg-[#fafcf2]' : 'bg-[var(--card)]',
            interactive ? 'cursor-pointer hover:bg-[#f6f9ec]' : '',
          )"
          @click="handleSelect(step.number)"
        >
          <span
            :class="cn(
              'h-6 w-6 shrink-0 rounded-[4px] border flex items-center justify-center font-mono text-xs font-semibold tabular-nums mt-0.5',
              getState(step.number) === 'completed'
                ? 'bg-[var(--status-success-bg)] text-[var(--status-success-text)] border-[var(--status-success-text)]/35'
                : getState(step.number) === 'active'
                  ? 'bg-[var(--ink-900)] text-white border-[var(--ink-900)]'
                  : 'bg-[var(--bg)] text-[var(--ink-500)] border-[var(--border)]',
            )"
          >
            <Check v-if="getState(step.number) === 'completed'" class="h-3.5 w-3.5" aria-hidden="true" />
            <span v-else>{{ step.number }}</span>
          </span>

          <span class="min-w-0 flex-1">
            <span
              :class="cn(
                'block text-sm leading-snug',
                getState(step.number) === 'active'
                  ? 'font-semibold text-[var(--ink-900)]'
                  : getState(step.number) === 'completed'
                    ? 'font-medium text-[var(--ink-700)]'
                    : 'font-normal text-[var(--ink-500)]',
              )"
            >
              {{ step.title }}
            </span>
            <span
              v-if="step.subtitle"
              class="block text-xs text-[var(--ink-500)] mt-0.5 truncate"
            >
              {{ step.subtitle }}
            </span>
          </span>
        </component>

        <!-- Garis aksen 4px gradient kuning ke hijau khusus langkah aktif -->
        <span
          v-if="getState(step.number) === 'active'"
          aria-hidden="true"
          class="demoind-accent-bar absolute inset-x-0 bottom-0 h-[4px]"
        />
      </li>
    </ol>
  </nav>
</template>
