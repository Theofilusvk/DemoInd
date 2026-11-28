import { defineStore } from 'pinia';
import { ref } from 'vue';

let nextToastId = 1;

const MAX_VISIBLE_TOASTS = 2;

export const useToastStore = defineStore('toast', () => {
  const items = ref([]);

  function push({ title, description = '', variant = 'info', duration = 3600 }) {
    const id = nextToastId++;
    items.value = [...items.value.slice(-(MAX_VISIBLE_TOASTS - 1)), { id, title, description, variant }];

    if (duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }

    return id;
  }

  function dismiss(id) {
    items.value = items.value.filter((item) => item.id !== id);
  }

  function clear() {
    items.value = [];
  }

  return {
    items,
    push,
    dismiss,
    clear,
  };
});
