<script setup>
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AlertTriangle, XCircle, Mail } from 'lucide-vue-next';
import { UiButton, UiInput } from '@/components/ui';
import { useAuthStore } from '@/stores/auth';
import { useToastStore } from '@/stores/toast';
import { validateLoginForm } from '@/utils/authValidation';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const toastStore = useToastStore();

const form = reactive({
  email: typeof route.query.email === 'string' ? route.query.email : '',
  password: '',
});

const fieldErrors = reactive({
  email: '',
  password: '',
});

const touched = reactive({
  email: false,
  password: false,
});

const submitting = ref(false);
const serverError = ref('');
const unverifiedEmail = ref('');
const resending = ref(false);
const resendSuccessMessage = ref('');

function validateField(field) {
  touched[field] = true;
  const { errors } = validateLoginForm(form);
  fieldErrors[field] = errors[field];
}

function handleFieldUpdate(field, value) {
  form[field] = value;
  serverError.value = '';
  if (field === 'email') {
    unverifiedEmail.value = '';
    resendSuccessMessage.value = '';
  }
  if (touched[field]) {
    const { errors } = validateLoginForm(form);
    fieldErrors[field] = errors[field];
  }
}

async function handleSubmit() {
  serverError.value = '';
  unverifiedEmail.value = '';
  resendSuccessMessage.value = '';
  touched.email = true;
  touched.password = true;

  const validation = validateLoginForm(form);
  fieldErrors.email = validation.errors.email;
  fieldErrors.password = validation.errors.password;

  if (!validation.valid) {
    return;
  }

  submitting.value = true;
  try {
    const result = await authStore.login({
      email: form.email,
      password: form.password,
    });

    if (!result.ok) {
      if (result.code === 'EMAIL_NOT_VERIFIED') {
        unverifiedEmail.value = result.email || form.email.trim();
        return;
      }
      serverError.value = result.message;
      return;
    }

    toastStore.push({
      title: `Selamat datang, ${result.user.name}`,
      description: 'Anda berhasil masuk ke dashboard DemoInd.',
      variant: 'success',
    });

    const redirectPath =
      typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/')
        ? route.query.redirect
        : '/app';

    router.push(redirectPath);
  } finally {
    submitting.value = false;
  }
}

async function handleResendVerification() {
  if (!unverifiedEmail.value || resending.value) return;
  resending.value = true;
  resendSuccessMessage.value = '';
  try {
    const result = await authStore.resendVerificationEmail(unverifiedEmail.value);
    if (result.ok) {
      resendSuccessMessage.value = result.message;
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
</script>

<template>
  <form class="space-y-6" novalidate @submit.prevent="handleSubmit">
    <div class="space-y-1.5">
      <h1 class="text-2xl font-semibold text-[var(--ink-900)]">
        Masuk ke akun Anda
      </h1>
      <p class="text-sm text-[var(--ink-700)]">
        Lanjutkan pengelolaan deployment dan riwayat rilis aplikasi Laravel Anda.
      </p>
    </div>

    <!-- Peringatan email belum diverifikasi + tombol Kirim ulang email -->
    <div
      v-if="unverifiedEmail"
      role="alert"
      class="rounded-[4px] border border-[var(--status-warning-text)]/35 bg-[var(--status-warning-bg)] p-4 space-y-3"
    >
      <div class="flex items-start gap-2.5">
        <AlertTriangle class="h-4 w-4 text-[var(--status-warning-text)] shrink-0 mt-0.5" aria-hidden="true" />
        <div class="space-y-1 text-sm">
          <p class="font-semibold text-[var(--status-warning-text)]">
            Email belum diverifikasi
          </p>
          <p class="text-xs text-[var(--ink-900)] leading-relaxed">
            Akun <code class="font-mono font-medium">{{ unverifiedEmail }}</code> belum aktif.
            Cek kotak masuk Anda lalu klik tautan verifikasi sebelum masuk.
          </p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2.5 pl-6">
        <UiButton
          variant="outline"
          size="sm"
          :loading="resending"
          @click="handleResendVerification"
        >
          <Mail class="h-3.5 w-3.5" aria-hidden="true" />
          <span>Kirim ulang email</span>
        </UiButton>
        <RouterLink
          to="/verify-email"
          class="text-xs font-medium text-[var(--ink-900)] underline underline-offset-4 hover:text-[var(--ink-700)]"
        >
          Buka halaman verifikasi
        </RouterLink>
      </div>

      <p
        v-if="resendSuccessMessage"
        class="pl-6 text-xs font-medium text-[var(--status-success-text)]"
      >
        {{ resendSuccessMessage }}
      </p>
    </div>

    <!-- Pesan error kredensial -->
    <div
      v-else-if="serverError"
      role="alert"
      class="rounded-[4px] border border-[var(--status-error-text)]/35 bg-[var(--status-error-bg)] p-3.5 flex items-start gap-2.5 text-sm"
    >
      <XCircle class="h-4 w-4 text-[var(--status-error-text)] shrink-0 mt-0.5" aria-hidden="true" />
      <p class="text-xs font-medium text-[var(--status-error-text)] leading-relaxed">
        {{ serverError }}
      </p>
    </div>

    <div class="space-y-4">
      <UiInput
        :model-value="form.email"
        label="Email"
        name="email"
        type="email"
        autocomplete="email"
        placeholder="nama@contoh.id"
        :error="fieldErrors.email"
        required
        @update:model-value="handleFieldUpdate('email', $event)"
        @blur="validateField('email')"
      />

      <UiInput
        :model-value="form.password"
        label="Kata sandi"
        name="password"
        type="password"
        autocomplete="current-password"
        placeholder="Masukkan kata sandi"
        :password-toggle="true"
        :error="fieldErrors.password"
        required
        @update:model-value="handleFieldUpdate('password', $event)"
        @blur="validateField('password')"
      />
    </div>

    <UiButton
      type="submit"
      variant="primary"
      size="lg"
      :loading="submitting"
      class="w-full"
    >
      Masuk
    </UiButton>

    <p class="text-sm text-[var(--ink-700)]">
      Belum punya akun?
      <RouterLink
        to="/register"
        class="font-semibold text-[var(--ink-900)] underline underline-offset-4 hover:text-[var(--ink-700)]"
      >
        Daftar sekarang
      </RouterLink>
    </p>
  </form>
</template>
