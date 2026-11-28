<script setup>
import AuthLayout from '@/layouts/AuthLayout.vue';
import VerifyEmailNotice from '@/components/auth/VerifyEmailNotice.vue';
</script>

<template>
  <AuthLayout
    panel-title="Satu langkah terakhir sebelum mulai deploy"
    panel-subtitle="Verifikasi email memastikan notifikasi status build, kegagalan migrasi, dan keamanan subdomain terkirim ke pemilik akun yang sah."
  >
    <VerifyEmailNotice />

    <template #panel>
      <ol class="border-t border-[var(--border)] divide-y divide-[var(--border)] text-sm">
        <li class="py-3.5 flex items-baseline gap-3">
          <span class="font-mono text-xs text-[var(--ink-500)] tabular-nums">01</span>
          <span class="text-[var(--ink-900)]">Buka email berjudul konfirmasi pendaftaran dari DemoInd.</span>
        </li>
        <li class="py-3.5 flex items-baseline gap-3">
          <span class="font-mono text-xs text-[var(--ink-500)] tabular-nums">02</span>
          <span class="text-[var(--ink-900)]">Klik tombol verifikasi untuk mengaktifkan akses dashboard.</span>
        </li>
        <li class="py-3.5 flex items-baseline gap-3">
          <span class="font-mono text-xs text-[var(--ink-500)] tabular-nums">03</span>
          <span class="text-[var(--ink-900)]">Masuk kembali dan mulai Submission proyek Laravel pertama Anda.</span>
        </li>
      </ol>
    </template>
  </AuthLayout>
</template>
