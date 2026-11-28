<script setup>
import AuthLayout from '@/layouts/AuthLayout.vue';
import LoginForm from '@/components/auth/LoginForm.vue';
</script>

<template>
  <AuthLayout
    panel-title="Kelola deployment Laravel dari satu tempat yang terukur"
    panel-subtitle="Pantau status rilis, baca log deployment yang ringkas, atau rollback versi aplikasi kapan saja."
  >
    <LoginForm />

    <template #panel>
      <div class="space-y-6">
        <ol class="border-t border-[var(--border)] divide-y divide-[var(--border)] text-sm">
          <li class="py-3 flex items-baseline gap-3">
            <span class="font-mono text-xs text-[var(--ink-500)] tabular-nums">01</span>
            <span class="text-[var(--ink-900)]">Tabel status rilis: queued, running, success, failed, dan stopped.</span>
          </li>
          <li class="py-3 flex items-baseline gap-3">
            <span class="font-mono text-xs text-[var(--ink-500)] tabular-nums">02</span>
            <span class="text-[var(--ink-900)]">Wizard 5 langkah Deploy Helper dengan validasi arsip <code class="font-mono text-xs">.zip</code> otomatis.</span>
          </li>
          <li class="py-3 flex items-baseline gap-3">
            <span class="font-mono text-xs text-[var(--ink-500)] tabular-nums">03</span>
            <span class="text-[var(--ink-900)]">Variabel environment tersimpan terenkripsi dan tidak ditampilkan ulang.</span>
          </li>
        </ol>

        <div class="rounded-[4px] border border-[var(--border)] bg-[var(--card)] p-4 space-y-2 text-xs">
          <p class="font-semibold text-[var(--ink-900)]">Akun uji lokal (Mode Mock)</p>
          <div class="divide-y divide-[var(--border)] font-mono text-[12px]">
            <div class="py-1.5 flex items-center justify-between gap-2">
              <span class="text-[var(--ink-900)]">raka@contoh.id</span>
              <span class="text-[var(--status-success-text)]">terverifikasi</span>
            </div>
            <div class="py-1.5 flex items-center justify-between gap-2">
              <span class="text-[var(--ink-900)]">budi@contoh.id</span>
              <span class="text-[var(--status-warning-text)]">belum verifikasi</span>
            </div>
          </div>
          <p class="text-[var(--ink-500)]">
            Kata sandi kedua akun uji: <code class="font-mono text-[var(--ink-900)]">rahasia123</code>
          </p>
        </div>
      </div>
    </template>
  </AuthLayout>
</template>
