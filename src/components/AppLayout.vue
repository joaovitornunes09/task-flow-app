<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import SidebarProvider from './ui/sidebar/SidebarProvider.vue'
import SidebarInset from './ui/sidebar/SidebarInset.vue'
import SidebarTrigger from './ui/sidebar/SidebarTrigger.vue'
import { Separator } from './ui/separator'
import AppSidebar from './AppSidebar.vue'

const showUserMenu = ref(false)
const showMobileMenu = ref(false)

const closeMenusOnClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('[data-menu]')) {
    showUserMenu.value = false
    showMobileMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeMenusOnClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenusOnClickOutside)
})
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset class="flex flex-col min-h-screen">
      <!-- Header with mobile trigger -->
      <header class="flex h-16 shrink-0 items-center gap-3 px-4 border-b border-gray-200/80 bg-white/95 backdrop-blur-sm md:hidden sticky top-0 z-40">
        <SidebarTrigger />
        <Separator orientation="vertical" class="h-6 bg-gray-300" />
        <div class="flex items-center gap-2">
          <span class="font-semibold text-xl text-gray-900">TaskFlow</span>
        </div>
      </header>
      
      <!-- Main content -->
      <div class="flex-1 p-4 sm:p-6 lg:p-10">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
