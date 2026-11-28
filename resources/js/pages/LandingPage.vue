<script setup>
import PublicLayout from '@/layouts/PublicLayout.vue';
import LandingHero from '@/components/landing/LandingHero.vue';
import LandingHowItWorks from '@/components/landing/LandingHowItWorks.vue';
import LandingFeatures from '@/components/landing/LandingFeatures.vue';
import LandingStacks from '@/components/landing/LandingStacks.vue';
</script>

<template>
  <PublicLayout>
    <LandingHero />
    <LandingHowItWorks />
    <LandingFeatures />
    <LandingStacks />
  </PublicLayout>
</template>
