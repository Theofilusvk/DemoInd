<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { XCircle } from 'lucide-vue-next';
import { UiButton, UiInput } from '@/components/ui';
import { useAuthStore } from '@/stores/auth';
import { useToastStore } from '@/stores/toast';
import { validateRegisterForm } from '@/utils/authValidation';

const router = useRouter();
const authStore = useAuthStore();
const toastStore = useToastStore();

const form = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirmation: '',
});

const fieldErrors = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirmation: '',
});

const touched = reactive({
  name: false,
  email: false,
  password: false,
  passwordConfirmation: false,
});

const submitting = ref(false);
const serverError = ref('');

function syncErrors(fieldsToSync) {
  const { errors } = validateRegisterForm(form);
  for (const key of fieldsToSync) {
    fieldErrors[key] = errors[key];
  }
}

function handleBlur(field) {
  touched[field] = true;
  syncErrors([field]);
}

function handleUpdate(field, value) {
  form[field] = value;
  serverError.value = '';

  const fields = [];
  if (touched[field]) fields.push(field);
  if (field === 'password' && touched.passwordConfirmation) {
    fields.push('passwordConfirmation');
  }
  if (fields.length) {
    syncErrors(fields);
  }
}

async function handleSubmit() {
  serverError.value = '';
  touched.name = true;
  touched.email = true;
  touched.password = true;
  touched.passwordConfirmation = true;

  const validation = validateRegisterForm(form);
  fieldErrors.name = validation.errors.name;
  fieldErrors.email = validation.errors.email;
  fieldErrors.password = validation.errors.password;
  fieldErrors.passwordConfirmation = validation.errors.passwordConfirmation;

  if (!validation.valid) {
    return;
  }

  submitting.value = true;
  try {
    const result = await authStore.register({
      name: form.name,
      email: form.email,
      password: form.password,
    });

    if (!result.ok) {
      serverError.value = result.message;
      return;
    }

    toastStore.push({
      title: 'Akun berhasil dibuat',
      description: 'Silakan cek email Anda untuk menyelesaikan verifikasi akun.',
      variant: 'success',
    });

    router.push('/verify-email');
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <form class="space-y-6" novalidate @submit.prevent="handleSubmit">
    <div class="space-y-1.5">
      <h1 class="text-2xl font-semibold text-[var(--ink-900)]">
        Buat akun DemoInd
      </h1>
      <p class="text-sm text-[var(--ink-700)]">
        Mulai siapkan folder proyek Laravel dan jalankan deployment pertama Anda secara terpandu.
      </p>
    </div>

    <div
      v-if="serverError"
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
        :model-value="form.name"
        label="Nama lengkap"
        name="name"
        type="text"
        autocomplete="name"
        placeholder="Contoh: Nadia Kusuma"
        :error="fieldErrors.name"
        required
        @update:model-value="handleUpdate('name', $event)"
        @blur="handleBlur('name')"
      />

      <UiInput
        :model-value="form.email"
        label="Email"
        name="email"
        type="email"
        autocomplete="email"
        placeholder="nama@contoh.id"
        hint="Tautan verifikasi akan dikirim ke alamat email ini."
        :error="fieldErrors.email"
        required
        @update:model-value="handleUpdate('email', $event)"
        @blur="handleBlur('email')"
      />

      <UiInput
        :model-value="form.password"
        label="Kata sandi"
        name="password"
        type="password"
        autocomplete="new-password"
        placeholder="Minimal 8 karakter"
        hint="Gunakan minimal 8 karakter agar akun tetap aman."
        :password-toggle="true"
        :error="fieldErrors.password"
        required
        @update:model-value="handleUpdate('password', $event)"
        @blur="handleBlur('password')"
      />

      <UiInput
        :model-value="form.passwordConfirmation"
        label="Konfirmasi kata sandi"
        name="password_confirmation"
        type="password"
        autocomplete="new-password"
        placeholder="Ulangi kata sandi di atas"
        :password-toggle="true"
        :error="fieldErrors.passwordConfirmation"
        required
        @update:model-value="handleUpdate('passwordConfirmation', $event)"
        @blur="handleBlur('passwordConfirmation')"
      />
    </div>

    <UiButton
      type="submit"
      variant="primary"
      size="lg"
      :loading="submitting"
      class="w-full"
    >
      Daftar
    </UiButton>

    <p class="text-sm text-[var(--ink-700)]">
      Sudah punya akun?
      <RouterLink
        to="/login"
        class="font-semibold text-[var(--ink-900)] underline underline-offset-4 hover:text-[var(--ink-700)]"
      >
        Masuk di sini
      </RouterLink>
    </p>
  </form>
</template>
