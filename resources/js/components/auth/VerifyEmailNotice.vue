<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-vue-next';
import { UiButton, UiInput } from '@/components/ui';
import { useAuthStore } from '@/stores/auth';
import { useToastStore } from '@/stores/toast';
import { validateEmail } from '@/utils/authValidation';

const router = useRouter();
const authStore = useAuthStore();
const toastStore = useToastStore();

const manualEmail = ref(authStore.pendingVerificationEmail || '');
const manualEmailError = ref('');
const resending = ref(false);
const verifying = ref(false);
const resendStatus = ref('');

const targetEmail = computed(() =>
  (authStore.pendingVerificationEmail || manualEmail.value).trim(),
);

async function handleResend() {
  manualEmailError.value = '';
  resendStatus.value = '';

  const emailErr = validateEmail(targetEmail.value);
  if (emailErr) {
    manualEmailError.value = emailErr;
    return;
  }

  resending.value = true;
  try {
    const result = await authStore.resendVerificationEmail(targetEmail.value);
    if (result.ok) {
      resendStatus.value = result.message;
      toastStore.push({
        title: 'Email verifikasi dikirim ulang',
        description: result.message,
        variant: 'info',
      });
    }
  } finally {
    resending.value = false;
  }
}

async function handleSimulateVerify() {
  manualEmailError.value = '';
  const emailErr = validateEmail(targetEmail.value);
  if (emailErr) {
    manualEmailError.value = emailErr;
    return;
  }

  verifying.value = true;
  try {
    const emailToVerify = targetEmail.value;
    const result = await authStore.verifyEmail(emailToVerify);
    if (!result.ok) {
      manualEmailError.value = result.message;
      return;
    }

    toastStore.push({
      title: 'Email berhasil diverifikasi',
      description: `Akun ${emailToVerify} kini aktif. Silakan masuk dengan kata sandi Anda.`,
      variant: 'success',
    });

    router.push({ name: 'login', query: { email: emailToVerify } });
  } finally {
    verifying.value = false;
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <div class="h-10 w-10 rounded-[4px] border border-[var(--border)] bg-[var(--card)] inline-flex items-center justify-center text-[var(--ink-900)]">
        <Mail class="h-5 w-5" aria-hidden="true" />
      </div>

      <h1 class="text-2xl font-semibold text-[var(--ink-900)]">
        Cek email Anda untuk verifikasi
      </h1>

      <p class="text-sm text-[var(--ink-700)] leading-relaxed">
        <template v-if="authStore.pendingVerificationEmail">
          Kami telah mengirimkan tautan aktivasi ke
          <code class="font-mono text-[13px] font-semibold text-[var(--ink-900)]">{{ authStore.pendingVerificationEmail }}</code>.
          Buka tautan tersebut agar akun Anda bisa digunakan untuk deployment.
        </template>
        <template v-else>
          Masukkan alamat email yang baru saja Anda daftarkan untuk mengirim ulang tautan verifikasi.
        </template>
      </p>
    </div>

    <div v-if="!authStore.pendingVerificationEmail">
      <UiInput
        v-model="manualEmail"
        label="Email terdaftar"
        name="email"
        type="email"
        placeholder="nama@contoh.id"
        :error="manualEmailError"
        required
      />
    </div>

    <div class="rounded-[4px] border border-[var(--border)] bg-[var(--card)] p-4 space-y-2.5 text-xs text-[var(--ink-700)]">
      <p class="font-semibold text-[var(--ink-900)]">Belum melihat email masuk?</p>
      <ul class="space-y-1.5 list-disc pl-4">
        <li>Periksa folder Spam atau Promosi pada layanan email Anda.</li>
        <li>Pastikan alamat email yang didaftarkan tidak salah ketik.</li>
        <li>Klik tombol di bawah untuk meminta tautan verifikasi baru.</li>
      </ul>
    </div>

    <div
      v-if="resendStatus"
      role="status"
      class="rounded-[4px] border border-[var(--status-success-text)]/35 bg-[var(--status-success-bg)] p-3.5 flex items-start gap-2.5 text-xs font-medium text-[var(--status-success-text)]"
    >
      <CheckCircle2 class="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
      <span>{{ resendStatus }}</span>
    </div>

    <div class="flex flex-col sm:flex-row gap-3">
      <UiButton
        variant="primary"
        :loading="resending"
        @click="handleResend"
      >
        Kirim ulang email
      </UiButton>

      <UiButton
        v-if="targetEmail"
        variant="secondary"
        :loading="verifying"
        @click="handleSimulateVerify"
      >
        <span>Konfirmasi verifikasi (Simulasi)</span>
        <ArrowRight class="h-4 w-4" aria-hidden="true" />
      </UiButton>
    </div>

    <p v-if="manualEmailError && authStore.pendingVerificationEmail" role="alert" class="text-xs font-medium text-[var(--status-error-text)]">
      {{ manualEmailError }}
    </p>

    <div class="border-t border-[var(--border)] pt-4 text-sm text-[var(--ink-700)]">
      Sudah menyelesaikan verifikasi?
      <RouterLink
        :to="targetEmail ? { name: 'login', query: { email: targetEmail } } : '/login'"
        class="font-semibold text-[var(--ink-900)] underline underline-offset-4 hover:text-[var(--ink-700)]"
      >
        Lanjut ke halaman Masuk
      </RouterLink>
    </div>
  </div>
</template>
