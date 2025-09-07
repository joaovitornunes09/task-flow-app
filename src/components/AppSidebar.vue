<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { BarChart3Icon, CheckSquareIcon, ClipboardCheck, LayoutDashboardIcon, TagIcon, UsersIcon, LogOutIcon, UserIcon } from "lucide-vue-next"
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const user = computed(() => authStore.user)

const data = [
  { name: 'Dashboard', url: '/dashboard', icon: LayoutDashboardIcon },
  { name: 'Tarefas', url: '/tasks', icon: CheckSquareIcon },
  { name: 'Categorias', url: '/categories', icon: TagIcon },
  { name: 'Colaborações', url: '/collaborations', icon: UsersIcon },
  { name: 'Relatórios', url: '/reports', icon: BarChart3Icon },
]

const handleLogout = async () => {
  try {
    await authStore.logout()
    toast.success('Logout realizado com sucesso!')
    router.push('/login')
  } catch (error) {
    toast.error('Erro ao fazer logout')
  }
}
</script>

<template>
  <Sidebar class="bg-gradient-primary">
    <SidebarHeader class="bg-gradient-primary">
      <div class="flex items-center justify-center h-20 px-6">
        <div class="flex items-center gap-2">
          <ClipboardCheck class="text-white" />
          <span class="text-xl font-bold text-white">Task Flow</span>
        </div>
      </div>
    </SidebarHeader>
    <SidebarContent class="bg-gradient-primary text-white pt-4 ">
      <SidebarMenu class="space-y-1">
        <SidebarMenuItem v-for="menu in data" :key="menu.name">
          <SidebarMenuButton as-child>
            <router-link :to="menu.url"
              class="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200"
              :class="$route.path === menu.url
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-white/70 hover:bg-white/10 hover:text-white'">
              <component :is="menu.icon" class="mr-3 h-5 w-5" />
              {{ menu.name }}
            </router-link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarContent>
    
    <SidebarFooter class="bg-gradient-primary p-4">
      <div class="flex items-center justify-between text-white">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <UserIcon class="h-4 w-4" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">{{ user?.name || 'Usuário' }}</p>
            <p class="text-xs text-white/70 truncate">{{ user?.email || '' }}</p>
          </div>
        </div>
        <Button
          @click="handleLogout"
          variant="ghost"
          size="sm"
          class="text-white hover:bg-white/10 p-2"
          title="Logout"
        >
          <LogOutIcon class="h-4 w-4" />
        </Button>
      </div>
    </SidebarFooter>
    
    <SidebarRail />
  </Sidebar>
</template>
