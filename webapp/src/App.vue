<template>
  <component :is="currentLayout" />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import LandingLayout from './layouts/LandingLayout.vue'
import AuthLayout from './layouts/AuthLayout.vue'
import OnboardingLayout from './layouts/OnboardingLayout.vue'
import AppLayout from './layouts/AppLayout.vue'

const route = useRoute()

const layoutMap = {
  landing: LandingLayout,
  auth: AuthLayout,
  onboarding: OnboardingLayout,
  app: AppLayout,
}

const currentLayout = computed(() => layoutMap[route.meta.layout] || LandingLayout)
</script>