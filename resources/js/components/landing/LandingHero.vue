<script setup>
import { ref } from 'vue';
import { Folder, FileText, ArrowRight, Check } from 'lucide-vue-next';
import { UiButton } from '@/components/ui';

const terminalEntries = [
  {
    path: 'app/',
    type: 'dir',
    note: 'Kode utama aplikasi: Controller, Model, dan Service.',
  },
  {
    path: 'bootstrap/',
    type: 'dir',
    note: 'Inisialisasi framework Laravel dan cache autoload.',
  },
  {
    path: 'config/',
    type: 'dir',
    note: 'Berkas konfigurasi aplikasi, database, dan mail.',
  },
  {
    path: 'database/',
    type: 'dir',
    note: 'Migration dan seeder untuk struktur tabel database.',
  },
  {
    path: 'public/index.php',
    type: 'file',
    note: 'Pintu masuk utama web server yang wajib tersedia.',
  },
  {
    path: 'resources/',
    type: 'dir',
    note: 'View Blade, CSS, dan aset frontend proyek.',
  },
  {
    path: 'routes/',
    type: 'dir',
    note: 'Daftar URL dan pemetaan endpoint aplikasi.',
  },
  {
    path: 'storage/',
    type: 'dir',
    note: 'Log aplikasi, cache sementara, dan berkas upload.',
  },
  {
    path: 'artisan',
    type: 'file',
    note: 'File CLI Laravel di root untuk menjalankan migrasi dan cache.',
  },
  {
    path: 'composer.json',
    type: 'file',
    note: 'Daftar dependensi PHP untuk composer install otomatis.',
  },
  {
    path: '.env.example',
    type: 'file',
    note: 'Daftar nama variabel environment tanpa nilai rahasia.',
  },
];

const selectedEntry = ref(terminalEntries[4]);

function selectEntry(entry) {
  selectedEntry.value = entry;
}
</script>

<template>
  <section class="relative border-b border-[var(--border)] bg-[var(--card)]">
    <!-- Pita gradient kuning ke hijau (diizinkan khusus untuk pita hero landing) -->
    <div class="demoind-hero-ribbon h-1.5 w-full" aria-hidden="true" />

    <div class="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
        <!-- Kolom kiri: rata kiri, satu anchor judul utama -->
        <div class="lg:col-span-7 flex flex-col justify-between gap-8">
          <div class="space-y-5">
            <p class="font-mono text-xs text-[var(--ink-500)]">
              Panduan deployment terstruktur untuk developer pemula
            </p>

            <h1 class="text-[clamp(2.15rem,4vw,3.25rem)] leading-[1.12] font-semibold text-[var(--ink-900)]">
              Dari folder proyek sampai online, dipandu langkah demi langkah
            </h1>

            <p class="text-base text-[var(--ink-700)] max-w-xl leading-relaxed">
              DemoInd membantu Anda menyusun folder proyek Laravel, memeriksa isi arsip
              <code class="font-mono text-[14px] text-[var(--ink-900)]">.zip</code> secara otomatis,
              dan menjalankan deployment dengan pesan perbaikan yang jelas sebelum aplikasi tayang.
            </p>

            <div class="flex flex-wrap items-center gap-3 pt-2">
              <UiButton to="/register" variant="primary" size="lg">
                <span>Daftar</span>
                <ArrowRight class="h-4 w-4" aria-hidden="true" />
              </UiButton>
              <UiButton as="a" href="#cara-kerja" variant="outline" size="lg">
                Lihat cara kerja
              </UiButton>
            </div>
          </div>

          <div class="border-t border-[var(--border)] pt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--ink-500)]">
            <span>Stack aktif: <strong class="font-medium text-[var(--ink-900)]">Laravel</strong></span>
            <span aria-hidden="true">·</span>
            <span>Format unggah: <strong class="font-mono font-medium text-[var(--ink-900)]">.zip (maks. 50 MB)</strong></span>
            <span aria-hidden="true">·</span>
            <span>Validasi struktur otomatis sebelum build</span>
          </div>
        </div>

        <!-- Kolom kanan: potongan tree folder Laravel bergaya terminal -->
        <div class="lg:col-span-5 flex flex-col">
          <div
            class="flex-1 flex flex-col rounded-[4px] border border-[var(--terminal-border)] bg-[var(--terminal-bg)] text-[var(--terminal-text)] overflow-hidden"
            aria-label="Pratinjau struktur folder proyek Laravel"
          >
            <div class="flex items-center justify-between gap-3 border-b border-[var(--terminal-border)] bg-[#11170e] px-4 py-2.5 font-mono text-xs">
              <span class="text-[#dfe8d6] truncate">kasir-warung/</span>
              <span class="text-[var(--terminal-muted)] shrink-0">struktur wajib laravel</span>
            </div>

            <div class="flex-1 p-3 font-mono text-[13px] leading-6">
              <ul class="space-y-0.5">
                <li
                  v-for="(entry, index) in terminalEntries"
                  :key="entry.path"
                >
                  <button
                    type="button"
                    :aria-pressed="selectedEntry.path === entry.path ? 'true' : 'false'"
                    class="w-full text-left px-2 py-1 rounded-[2px] flex items-center justify-between gap-2 transition-colors cursor-pointer"
                    :class="selectedEntry.path === entry.path
                      ? 'bg-[#25321e] text-white'
                      : 'text-[var(--terminal-text)] hover:bg-[#1e2718]'"
                    @click="selectEntry(entry)"
                  >
                    <span class="flex items-center gap-2 min-w-0">
                      <span aria-hidden="true" class="text-[#69785f] select-none shrink-0">
                        {{ index === terminalEntries.length - 1 ? '└──' : '├──' }}
                      </span>
                      <Folder
                        v-if="entry.type === 'dir'"
                        class="h-3.5 w-3.5 text-[var(--yellow-300)] shrink-0"
                        aria-hidden="true"
                      />
                      <FileText
                        v-else
                        class="h-3.5 w-3.5 text-[var(--green-300)] shrink-0"
                        aria-hidden="true"
                      />
                      <span class="truncate">{{ entry.path }}</span>
                    </span>
                    <span class="text-[11px] text-[#9eb28e] shrink-0">wajib</span>
                  </button>
                </li>
              </ul>
            </div>

            <div class="border-t border-[var(--terminal-border)] bg-[#11170e] px-4 py-3 space-y-1.5">
              <p class="font-mono text-xs text-[var(--yellow-300)]">
                {{ selectedEntry.path }}
              </p>
              <p class="text-xs text-[#d6e0cc] leading-relaxed">
                {{ selectedEntry.note }}
              </p>
              <div class="pt-1.5 border-t border-[#222c1c] flex items-center gap-1.5 font-mono text-[11px] text-[var(--green-300)]">
                <Check class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>.env dikecualikan · siap divalidasi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
