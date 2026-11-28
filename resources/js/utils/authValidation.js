const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validasi format alamat email.
 * @param {string} email
 * @returns {string}
 */
export function validateEmail(email) {
  const value = String(email ?? '').trim();
  if (!value) {
    return 'Alamat email wajib diisi.';
  }
  if (!EMAIL_REGEX.test(value)) {
    return 'Format email tidak valid. Contoh: nama@domain.com.';
  }
  return '';
}

/**
 * Validasi formulir Masuk (/login).
 * @param {{ email?: string, password?: string }} payload
 * @returns {{ valid: boolean, errors: { email: string, password: string } }}
 */
export function validateLoginForm(payload) {
  const errors = {
    email: validateEmail(payload?.email),
    password: '',
  };

  const password = String(payload?.password ?? '');
  if (!password) {
    errors.password = 'Kata sandi wajib diisi.';
  }

  return {
    valid: !errors.email && !errors.password,
    errors,
  };
}

/**
 * Validasi formulir Daftar (/register) beserta konfirmasi kata sandi.
 * @param {{ name?: string, email?: string, password?: string, passwordConfirmation?: string }} payload
 * @returns {{ valid: boolean, errors: { name: string, email: string, password: string, passwordConfirmation: string } }}
 */
export function validateRegisterForm(payload) {
  const name = String(payload?.name ?? '').trim();
  const password = String(payload?.password ?? '');
  const passwordConfirmation = String(payload?.passwordConfirmation ?? '');

  const errors = {
    name: '',
    email: validateEmail(payload?.email),
    password: '',
    passwordConfirmation: '',
  };

  if (!name) {
    errors.name = 'Nama lengkap wajib diisi.';
  } else if (name.length < 2) {
    errors.name = 'Nama minimal terdiri dari 2 karakter.';
  }

  if (!password) {
    errors.password = 'Kata sandi wajib diisi.';
  } else if (password.length < 8) {
    errors.password = 'Kata sandi minimal 8 karakter.';
  }

  if (!passwordConfirmation) {
    errors.passwordConfirmation = 'Konfirmasi kata sandi wajib diisi.';
  } else if (passwordConfirmation !== password) {
    errors.passwordConfirmation = 'Konfirmasi kata sandi tidak sama dengan kata sandi.';
  }

  return {
    valid: !errors.name && !errors.email && !errors.password && !errors.passwordConfirmation,
    errors,
  };
}
