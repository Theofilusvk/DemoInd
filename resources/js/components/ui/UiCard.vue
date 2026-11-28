<script setup>
import { computed } from 'vue';
import { cn } from '@/utils/cn';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  padded: {
    type: Boolean,
    default: true,
  },
  class: {
    type: String,
    default: '',
  },
});

const hasHeader = computed(() => Boolean(props.title || props.description));
</script>

<template>
  <section
    :class="cn(
      'rounded-[4px] bg-[var(--card)] border border-[var(--border)]',
      props.class,
    )"
  >
    <header
      v-if="hasHeader || $slots.header"
      class="flex items-start justify-between gap-4 border-b border-[var(--border)] px-5 py-4"
    >
      <slot name="header">
        <div class="min-w-0">
          <h3 v-if="title" class="text-base font-semibold text-[var(--ink-900)]">
            {{ title }}
          </h3>
          <p v-if="description" class="mt-0.5 text-sm text-[var(--ink-500)]">
            {{ description }}
          </p>
        </div>
      </slot>
      <div v-if="$slots.actions" class="shrink-0 flex items-center gap-2">
        <slot name="actions" />
      </div>
    </header>

    <div :class="padded ? 'p-5' : ''">
      <slot />
    </div>

    <footer
      v-if="$slots.footer"
      class="border-t border-[var(--border)] bg-[#fafbf5] px-5 py-3.5 rounded-b-[4px]"
    >
      <slot name="footer" />
    </footer>
  </section>
</template>
