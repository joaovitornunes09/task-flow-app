<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import type { LoginCredentials } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LogIn } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const form = reactive<LoginCredentials>({
  email: '',
  password: ''
})

const isLoading = computed(() => authStore.isLoading)

const handleSubmit = async () => {
  const result = await authStore.login(form)

  if (result.success) {
    toast.success('Login realizado com sucesso!', 'Bem-vindo de volta!')
    router.push('/dashboard')
  } else {
    toast.error('Erro no login', result.error || 'Credenciais inválidas')
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-hero flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

    <!-- Efeitos de fundo -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
      <div class="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/5 blur-3xl">
      </div>
    </div>

    <div class="relative max-w-md w-full">
      <!-- Cabeçalho -->
      <div class="text-center mb-8 animate-fade-in-up">
        <div class="mx-auto w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
          <LogIn class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">Task Flow</h1>
        <p class="text-white/80 text-lg">Bem-vindo de volta</p>
      </div>

      <!-- Card -->
      <Card class="bg-white/95 backdrop-blur-lg border-0 shadow-2xl animate-fade-in-up">
        <CardContent class="p-8">
          <form @submit.prevent="handleSubmit" class="space-y-5">

            <div class="space-y-2">
              <label for="email" class="block text-sm font-semibold text-gray-700">
                E-mail
              </label>
              <Input id="email" name="email" type="email" autocomplete="email" required v-model="form.email"
                placeholder="Digite seu e-mail"
                class="h-12 px-4 text-base border-2 border-gray-200 focus:border-primary-500 rounded-xl transition-all duration-200" />
            </div>

            <div class="space-y-2">
              <label for="password" class="block text-sm font-semibold text-gray-700">
                Senha
              </label>
              <Input id="password" name="password" type="password" autocomplete="current-password" required
                v-model="form.password" placeholder="Digite sua senha"
                class="h-12 px-4 text-base border-2 border-gray-200 focus:border-primary-500 rounded-xl transition-all duration-200" />
            </div>

            <Button type="submit" :disabled="isLoading"
              class="w-full h-12 bg-gradient-secondary hover:bg-gradient-primary text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none shadow-secondary">
              <span v-if="isLoading" class="mr-2">
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              </span>
              {{ isLoading ? 'Entrando...' : 'Entrar' }}
            </Button>

            <div class="relative my-6">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-4 bg-white text-gray-500">ou</span>
              </div>
            </div>

            <div class="text-center">
              <p class="text-gray-600">
                Ainda não tem uma conta?
                <router-link to="/register"
                  class="font-semibold text-primary-600 hover:text-secondary-600 transition-colors duration-200 ml-1">
                  Criar conta
                </router-link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
