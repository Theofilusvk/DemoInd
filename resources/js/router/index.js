import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '@/pages/LandingPage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import RegisterPage from '@/pages/RegisterPage.vue';
import VerifyEmailPage from '@/pages/VerifyEmailPage.vue';
import DashboardPage from '@/pages/DashboardPage.vue';
import { useAuthStore } from '@/stores/auth';

export const routes = [
  {
    path: '/',
    name: 'landing',
    component: LandingPage,
    meta: {
      title: 'DemoInd — Dari folder proyek sampai online, dipandu langkah demi langkah',
      layout: 'public',
    },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: {
      title: 'Masuk — DemoInd',
      layout: 'auth',
      guestOnly: true,
    },
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
    meta: {
      title: 'Daftar — DemoInd',
      layout: 'auth',
      guestOnly: true,
    },
  },
  {
    path: '/verify-email',
    name: 'verify-email',
    component: VerifyEmailPage,
    meta: {
      title: 'Verifikasi Email — DemoInd',
      layout: 'auth',
    },
  },
  {
    path: '/app',
    name: 'dashboard',
    component: DashboardPage,
    meta: {
      title: 'Dashboard — DemoInd',
      layout: 'dashboard',
      requiresAuth: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' };
    }
    return { top: 0 };
  },
});

router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (to.meta?.requiresAuth && !authStore.isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    };
  }

  if (to.meta?.guestOnly && authStore.isAuthenticated) {
    return { name: 'dashboard' };
  }

  return true;
});

router.afterEach((to) => {
  if (to.meta?.title) {
    document.title = String(to.meta.title);
  }
});

export default router;
