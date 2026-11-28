<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { Menu, X } from 'lucide-vue-next';
import { UiButton } from '@/components/ui';

const mobileMenuOpen = ref(false);

function handleKeydown(event) {
  if (event.key === 'Escape' && mobileMenuOpen.value) {
    mobileMenuOpen.value = false;
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown));
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown));
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink-900)]">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-[4px] focus:bg-[var(--ink-900)] focus:px-3.5 focus:py-2 focus:text-xs focus:font-medium focus:text-white"
    >
      Lewati ke konten utama
    </a>

    <header class="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg)]">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        <RouterLink
          to="/"
          class="text-lg font-semibold tracking-tight text-[var(--ink-900)] whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span
            aria-hidden="true"
            class="h-4 w-4 rounded-[2px] bg-[var(--ink-900)] inline-flex items-center justify-center"
          >
            <span class="h-1.5 w-1.5 bg-[var(--yellow-300)]" />
          </span>
          <span>DemoInd</span>
        </RouterLink>

        <nav aria-label="Navigasi utama" class="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--ink-700)]">
          <RouterLink
            to="/#cara-kerja"
            class="hover:text-[var(--ink-900)] hover:underline underline-offset-4 whitespace-nowrap shrink-0 transition-colors"
          >
            Cara Kerja
          </RouterLink>
          <RouterLink
            to="/#fitur"
            class="hover:text-[var(--ink-900)] hover:underline underline-offset-4 whitespace-nowrap shrink-0 transition-colors"
          >
            Fitur
          </RouterLink>
          <RouterLink
            to="/#stack"
            class="hover:text-[var(--ink-900)] hover:underline underline-offset-4 whitespace-nowrap shrink-0 transition-colors"
          >
            Stack
          </RouterLink>
          <RouterLink
            to="/login"
            class="hover:text-[var(--ink-900)] hover:underline underline-offset-4 whitespace-nowrap shrink-0 transition-colors"
          >
            Masuk
          </RouterLink>
        </nav>

        <div class="hidden md:flex items-center shrink-0">
          <UiButton to="/register" variant="primary" size="sm">
            Daftar
          </UiButton>
        </div>

        <button
          type="button"
          class="md:hidden h-10 w-10 inline-flex items-center justify-center rounded-[4px] border border-[var(--border)] bg-[var(--card)] text-[var(--ink-900)] cursor-pointer"
          :aria-expanded="mobileMenuOpen ? 'true' : 'false'"
          aria-label="Buka menu navigasi"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <X v-if="mobileMenuOpen" class="h-5 w-5" aria-hidden="true" />
          <Menu v-else class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <nav
        v-if="mobileMenuOpen"
        aria-label="Navigasi mobile"
        class="md:hidden border-t border-[var(--border)] bg-[var(--card)] px-4 py-4 flex flex-col gap-3"
      >
        <RouterLink
          to="/#cara-kerja"
          class="py-1.5 text-sm font-medium text-[var(--ink-700)] hover:text-[var(--ink-900)]"
          @click="mobileMenuOpen = false"
        >
          Cara Kerja
        </RouterLink>
        <RouterLink
          to="/#fitur"
          class="py-1.5 text-sm font-medium text-[var(--ink-700)] hover:text-[var(--ink-900)]"
          @click="mobileMenuOpen = false"
        >
          Fitur
        </RouterLink>
        <RouterLink
          to="/#stack"
          class="py-1.5 text-sm font-medium text-[var(--ink-700)] hover:text-[var(--ink-900)]"
          @click="mobileMenuOpen = false"
        >
          Stack
        </RouterLink>
        <RouterLink
          to="/login"
          class="py-1.5 text-sm font-medium text-[var(--ink-700)] hover:text-[var(--ink-900)]"
          @click="mobileMenuOpen = false"
        >
          Masuk
        </RouterLink>
        <div class="pt-2 border-t border-[var(--border)]">
          <UiButton to="/register" variant="primary" size="sm" class="w-full" @click="mobileMenuOpen = false">
            Daftar
          </UiButton>
        </div>
      </nav>
    </header>

    <main id="main-content" tabindex="-1" class="flex-1 focus:outline-none">
      <slot />
    </main>

    <footer class="border-t border-[var(--border)] bg-[var(--card)]">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[var(--ink-500)]">
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span class="font-semibold text-[var(--ink-900)]">DemoInd</span>
          <span aria-hidden="true">·</span>
          <span>Platform bantu deployment untuk developer pemula</span>
        </div>
        <div class="flex flex-wrap items-center gap-x-5 gap-y-1">
          <RouterLink to="/#cara-kerja" class="hover:text-[var(--ink-900)]">Cara Kerja</RouterLink>
          <RouterLink to="/#fitur" class="hover:text-[var(--ink-900)]">Fitur</RouterLink>
          <RouterLink to="/#stack" class="hover:text-[var(--ink-900)]">Stack</RouterLink>
          <RouterLink to="/login" class="hover:text-[var(--ink-900)]">Masuk</RouterLink>
          <RouterLink to="/register" class="hover:text-[var(--ink-900)]">Daftar</RouterLink>
        </div>
      </div>
    </footer>
  </div>
</template>
