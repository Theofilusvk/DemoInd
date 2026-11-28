<script setup>
import AuthLayout from '@/layouts/AuthLayout.vue';
import RegisterForm from '@/components/auth/RegisterForm.vue';
</script>

<template>
  <AuthLayout
    panel-title="Mulai dari folder lokal, tanpa pusing konfigurasi server"
    panel-subtitle="Setelah mendaftar dan memverifikasi email, Anda langsung mendapatkan akses ke panduan folder dan validator Laravel."
  >
    <RegisterForm />
  </AuthLayout>
</template>
