<script setup>
defineProps({
  panelTitle: {
    type: String,
    default: 'Deploy lebih terarah tanpa menebak konfigurasi server',
  },
  panelSubtitle: {
    type: String,
    default: 'DemoInd memeriksa struktur folder proyek Anda sebelum dijalankan, sehingga kesalahan umum dapat diperbaiki lebih awal.',
  },
});
</script>

<template>
  <div class="min-h-screen bg-[var(--bg)] text-[var(--ink-900)] grid grid-cols-1 lg:grid-cols-12">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-[4px] focus:bg-[var(--ink-900)] focus:px-3.5 focus:py-2 focus:text-xs focus:font-medium focus:text-white"
    >
      Lewati ke konten utama
    </a>

    <!-- Kolom kiri: form autentikasi -->
    <div class="lg:col-span-7 flex flex-col justify-between px-4 sm:px-10 lg:px-16 py-8">
      <header class="flex items-center justify-between gap-4">
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

        <RouterLink
          to="/"
          class="text-xs font-medium text-[var(--ink-500)] hover:text-[var(--ink-900)] hover:underline underline-offset-4 whitespace-nowrap"
        >
          Kembali ke beranda
        </RouterLink>
      </header>

      <main id="main-content" tabindex="-1" class="w-full max-w-md my-12 focus:outline-none">
        <slot />
      </main>

      <footer class="text-xs text-[var(--ink-500)]">
        DemoInd · Panduan deployment terstruktur untuk proyek Laravel.
      </footer>
    </div>

    <!-- Kolom kanan: panel info bergaris (bukan kartu melayang) -->
    <aside class="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-[var(--border)] bg-[#f4f7e9] px-6 sm:px-10 lg:px-12 py-10 lg:py-16 flex flex-col justify-between gap-8">
      <div class="space-y-6">
        <div class="h-0.5 w-12 bg-[var(--ink-900)]" aria-hidden="true" />
        <div class="space-y-2">
          <h2 class="text-xl font-semibold text-[var(--ink-900)] leading-snug">
            {{ panelTitle }}
          </h2>
          <p class="text-sm text-[var(--ink-700)] leading-relaxed">
            {{ panelSubtitle }}
          </p>
        </div>

        <slot name="panel">
          <ol class="border-t border-[var(--border)] divide-y divide-[var(--border)] text-sm">
            <li class="py-3.5 flex items-baseline gap-3">
              <span class="font-mono text-xs text-[var(--ink-500)] tabular-nums">01</span>
              <span class="text-[var(--ink-900)]">Susun folder Laravel mengikuti panduan wajib di dashboard.</span>
            </li>
            <li class="py-3.5 flex items-baseline gap-3">
              <span class="font-mono text-xs text-[var(--ink-500)] tabular-nums">02</span>
              <span class="text-[var(--ink-900)]">Unggah arsip <code class="font-mono text-xs">.zip</code> maksimal 50 MB untuk divalidasi otomatis.</span>
            </li>
            <li class="py-3.5 flex items-baseline gap-3">
              <span class="font-mono text-xs text-[var(--ink-500)] tabular-nums">03</span>
              <span class="text-[var(--ink-900)]">Isi variabel environment terenkripsi dan pantau log deployment secara langsung.</span>
            </li>
          </ol>
        </slot>
      </div>

      <div class="border-t border-[var(--border)] pt-4 font-mono text-xs text-[var(--ink-500)]">
        Stack aktif saat ini: Laravel (PHP 8.3 · Composer 2)
      </div>
    </aside>
  </div>
</template>
