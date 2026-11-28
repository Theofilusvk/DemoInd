<script setup>
const steps = [
  {
    number: '01',
    title: 'Pilih stack',
    description:
      'Tentukan jenis proyek yang ingin Anda jalankan. Untuk saat ini panduan dan runner otomatis tersedia penuh bagi Laravel.',
    detail: 'Laravel · PHP 8.3 · Composer 2',
  },
  {
    number: '02',
    title: 'Susun folder',
    description:
      'Cocokkan folder proyek dengan daftar wajib DemoInd atau unduh template struktur folder untuk memastikan file penting ada di root.',
    detail: 'app/, public/index.php, artisan, .env.example',
  },
  {
    number: '03',
    title: 'Upload zip',
    description:
      'Kompres folder proyek menjadi satu arsip .zip maksimal 50 MB tanpa menyertakan file rahasia .env maupun folder vendor/.',
    detail: 'Arsip .zip · Maksimal 50 MB',
  },
  {
    number: '04',
    title: 'Validasi dan deploy',
    description:
      'Sistem memeriksa aturan struktur, menampilkan saran bila ada kesalahan, lalu mengisi variabel environment terenkripsi hingga URL aktif.',
    detail: 'namaapp.domain.com aktif otomatis',
  },
];
</script>

<template>
  <section id="cara-kerja" aria-labelledby="heading-cara-kerja" class="scroll-mt-16 border-b border-[var(--border)] bg-[var(--bg)]">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 py-16 lg:py-20 space-y-10">
      <div class="max-w-2xl space-y-2.5">
        <p class="font-mono text-xs text-[var(--ink-500)]">Cara Kerja</p>
        <h2 id="heading-cara-kerja" class="text-2xl sm:text-3xl font-semibold text-[var(--ink-900)]">
          Empat langkah terukur dari folder lokal sampai aplikasi bisa diakses
        </h2>
        <p class="text-sm sm:text-base text-[var(--ink-700)] leading-relaxed">
          Setiap tahap memiliki pemeriksaan yang jelas sehingga Anda tahu persis bagian mana yang perlu diperbaiki sebelum server membangun proyek.
        </p>
      </div>

      <ol class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border)] border border-[var(--border)] rounded-[4px] overflow-hidden">
        <li
          v-for="step in steps"
          :key="step.number"
          class="bg-[var(--card)] p-6 flex flex-col justify-between gap-6"
        >
          <div class="space-y-3">
            <span class="inline-block font-mono text-sm font-semibold text-[var(--ink-900)] tabular-nums border-b-2 border-[var(--yellow-300)] pb-0.5">
              {{ step.number }}
            </span>
            <h3 class="text-base font-semibold text-[var(--ink-900)]">
              {{ step.title }}
            </h3>
            <p class="text-sm text-[var(--ink-700)] leading-relaxed">
              {{ step.description }}
            </p>
          </div>

          <p class="pt-3 border-t border-[var(--border)] font-mono text-xs text-[var(--ink-500)]">
            {{ step.detail }}
          </p>
        </li>
      </ol>
    </div>
  </section>
</template>
