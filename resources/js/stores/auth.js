import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { api } from '@/services/api';

const SESSION_USER_KEY = 'demoind_auth_user';
const PENDING_EMAIL_KEY = 'demoind_pending_verify_email';

function readStoredUser() {
  try {
    const raw = sessionStorage.getItem(SESSION_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function readPendingEmail() {
  try {
    return sessionStorage.getItem(PENDING_EMAIL_KEY) || '';
  } catch {
    return '';
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(readStoredUser());
  const pendingVerificationEmail = ref(readPendingEmail());

  const isAuthenticated = computed(() => Boolean(user.value));

  function setUser(nextUser) {
    user.value = nextUser;
    try {
      if (nextUser) {
        sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(nextUser));
      } else {
        sessionStorage.removeItem(SESSION_USER_KEY);
      }
    } catch {
      // Abaikan jika sessionStorage tidak tersedia
    }
  }

  function setPendingVerificationEmail(email) {
    pendingVerificationEmail.value = email || '';
    try {
      if (email) {
        sessionStorage.setItem(PENDING_EMAIL_KEY, email);
      } else {
        sessionStorage.removeItem(PENDING_EMAIL_KEY);
      }
    } catch {
      // Abaikan jika sessionStorage tidak tersedia
    }
  }

  async function login(credentials) {
    const result = await api.login(credentials);
    if (result.ok) {
      setUser(result.user);
      setPendingVerificationEmail('');
    } else if (result.code === 'EMAIL_NOT_VERIFIED' && result.email) {
      setPendingVerificationEmail(result.email);
    }
    return result;
  }

  async function register(payload) {
    const result = await api.register(payload);
    if (result.ok) {
      setPendingVerificationEmail(result.user.email);
    }
    return result;
  }

  async function resendVerificationEmail(email) {
    const targetEmail = email || pendingVerificationEmail.value;
    return api.resendVerificationEmail(targetEmail);
  }

  async function verifyEmail(email) {
    const targetEmail = email || pendingVerificationEmail.value;
    const result = await api.verifyEmail(targetEmail);
    if (result.ok) {
      setPendingVerificationEmail('');
    }
    return result;
  }

  function logout() {
    setUser(null);
  }

  return {
    user,
    pendingVerificationEmail,
    isAuthenticated,
    setUser,
    setPendingVerificationEmail,
    login,
    register,
    resendVerificationEmail,
    verifyEmail,
    logout,
  };
});
