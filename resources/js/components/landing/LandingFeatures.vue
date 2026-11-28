<script setup>
import { UiBadge } from '@/components/ui';
</script>

<template>
  <section id="fitur" aria-labelledby="heading-fitur" class="scroll-mt-16 border-b border-[var(--border)] bg-[var(--card)]">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 py-16 lg:py-20">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        <!-- Intro kiri -->
        <div class="lg:col-span-4 space-y-3 lg:sticky lg:top-24">
          <p class="font-mono text-xs text-[var(--ink-500)]">Fitur Utama</p>
          <h2 id="heading-fitur" class="text-2xl sm:text-3xl font-semibold text-[var(--ink-900)] leading-tight">
            Dirancang untuk mencegah kesalahan deploy yang paling sering terjadi
          </h2>
          <p class="text-sm text-[var(--ink-700)] leading-relaxed">
            Tidak ada panel konfigurasi server yang membingungkan. DemoInd berfokus pada empat hal yang benar-benar dibutuhkan pemula saat merilis proyek pertama.
          </p>
        </div>

        <!-- 4 blok fitur terstruktur dengan garis 1px & contoh nyata -->
        <div class="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-px bg-[var(--border)] border border-[var(--border)] rounded-[4px] overflow-hidden">
          <!-- Fitur 1: Template folder -->
          <article class="bg-[var(--card)] p-6 flex flex-col justify-between gap-5">
            <div class="space-y-2">
              <p class="font-mono text-xs text-[var(--ink-500)]">01 · Struktur</p>
              <h3 class="text-base font-semibold text-[var(--ink-900)]">
                Template folder siap pakai
              </h3>
              <p class="text-sm text-[var(--ink-700)] leading-relaxed">
                Unduh arsip kerangka proyek lengkap beserta keterangan fungsi setiap folder agar Anda tidak bingung meletakkan file sebelum dikompres.
              </p>
            </div>
            <div class="rounded-[4px] border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 font-mono text-xs text-[var(--ink-700)] space-y-1">
              <div class="flex items-center justify-between gap-2">
                <span>public/index.php</span>
                <span class="text-[var(--status-success-text)]">wajib</span>
              </div>
              <div class="flex items-center justify-between gap-2">
                <span>composer.json</span>
                <span class="text-[var(--status-success-text)]">wajib</span>
              </div>
              <div class="flex items-center justify-between gap-2">
                <span>.env.example</span>
                <span class="text-[var(--status-success-text)]">wajib</span>
              </div>
            </div>
          </article>

          <!-- Fitur 2: Validasi otomatis dengan saran perbaikan -->
          <article class="bg-[var(--card)] p-6 flex flex-col justify-between gap-5">
            <div class="space-y-2">
              <p class="font-mono text-xs text-[var(--ink-500)]">02 · Pemeriksaan</p>
              <h3 class="text-base font-semibold text-[var(--ink-900)]">
                Validasi otomatis dengan saran perbaikan
              </h3>
              <p class="text-sm text-[var(--ink-700)] leading-relaxed">
                Sebelum build dimulai, DemoInd memeriksa file wajib, folder terlarang, serta ukuran arsip dan langsung memberi tahu langkah perbaikannya.
              </p>
            </div>
            <div class="rounded-[4px] border border-[var(--status-error-text)]/30 bg-[var(--status-error-bg)]/60 px-3.5 py-2.5 space-y-1 text-xs">
              <div class="flex items-center justify-between gap-2">
                <code class="font-mono font-semibold text-[var(--status-error-text)]">.env ditemukan</code>
                <UiBadge variant="error">gagal</UiBadge>
              </div>
              <p class="text-[var(--ink-900)] leading-relaxed">
                Saran: Hapus .env dari zip, sertakan .env.example saja.
              </p>
            </div>
          </article>

          <!-- Fitur 3: Log deployment mudah dibaca -->
          <article class="bg-[var(--card)] p-6 flex flex-col justify-between gap-5">
            <div class="space-y-2">
              <p class="font-mono text-xs text-[var(--ink-500)]">03 · Observabilitas</p>
              <h3 class="text-base font-semibold text-[var(--ink-900)]">
                Log deployment mudah dibaca
              </h3>
              <p class="text-sm text-[var(--ink-700)] leading-relaxed">
                Pantau tahapan ekstrak, instalasi paket, migrasi database, hingga cek kesehatan HTTP dalam panel monospace yang ringkas dan kronologis.
              </p>
            </div>
            <pre class="rounded-[4px] border border-[var(--terminal-border)] bg-[var(--terminal-bg)] text-[var(--terminal-text)] px-3.5 py-2.5 font-mono text-[11px] leading-5 overflow-x-auto">[19:39:18] composer install --no-dev...
[19:39:34] php artisan migrate --force
[19:39:44] HTTP GET / -> 200 OK (118 ms)</pre>
          </article>

          <!-- Fitur 4: Rollback versi -->
          <article class="bg-[var(--card)] p-6 flex flex-col justify-between gap-5">
            <div class="space-y-2">
              <p class="font-mono text-xs text-[var(--ink-500)]">04 · Pemulihan</p>
              <h3 class="text-base font-semibold text-[var(--ink-900)]">
                Rollback versi tanpa panik
              </h3>
              <p class="text-sm text-[var(--ink-700)] leading-relaxed">
                Setiap unggahan baru tersimpan sebagai versi terpisah. Jika pembaruan menimbulkan galat, kembalikan aplikasi ke rilis stabil sebelumnya dari tabel Deployment.
              </p>
            </div>
            <div class="rounded-[4px] border border-[var(--border)] bg-[var(--bg)] divide-y divide-[var(--border)] text-xs font-mono">
              <div class="px-3.5 py-2 flex items-center justify-between gap-2">
                <span class="text-[var(--ink-900)] font-medium">v1.4.0</span>
                <span class="text-[var(--status-success-text)]">versi aktif</span>
              </div>
              <div class="px-3.5 py-2 flex items-center justify-between gap-2">
                <span class="text-[var(--ink-700)]">v1.3.2</span>
                <span class="text-[var(--ink-500)]">siap rollback</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
