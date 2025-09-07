<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.initialize()
})
</script>

<template>
  <div id="app" class="min-h-screen bg-background">
    <router-view />
    <Toaster position="top-right" :theme="'system'" :rich-colors="true" :close-button="true" />
  </div>
</template>
