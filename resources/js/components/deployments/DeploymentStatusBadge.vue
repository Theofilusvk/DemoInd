<script setup>
import { computed } from 'vue';
import {
  CheckCircle2,
  Clock,
  PauseCircle,
  PlayCircle,
  XCircle,
} from 'lucide-vue-next';
import { UiBadge } from '@/components/ui';
import { getStatusMeta } from '@/utils/deploymentHelpers';

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
});

const ICON_MAP = {
  success: CheckCircle2,
  running: PlayCircle,
  queued: Clock,
  failed: XCircle,
  stopped: PauseCircle,
};

const meta = computed(() => getStatusMeta(props.status));
const StatusIcon = computed(() => ICON_MAP[props.status] || PauseCircle);
</script>

<template>
  <UiBadge :variant="meta.variant" mono :title="meta.description">
    <component :is="StatusIcon" class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
    <span>{{ meta.label }}</span>
  </UiBadge>
</template>
