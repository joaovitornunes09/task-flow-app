<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import type { RegisterData } from '@/types'
import { UserPlus } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const form = reactive<RegisterData>({
  name: '',
  email: '',
  password: ''
})

const isLoading = computed(() => authStore.isLoading)

const handleSubmit = async () => {
  if (form.password.length < 6) {
    toast.error('Senha muito curta', 'A senha deve ter pelo menos 6 caracteres')
    return
  }

  const result = await authStore.register(form)

  if (result.success) {
    toast.success('Conta criada com sucesso!', 'Bem-vindo ao Task Flow!')
    router.push('/dashboard')
  } else {
    toast.error('Erro no cadastro', result.error || 'Não foi possível criar a conta')
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-hero flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
      <div class="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/5 blur-3xl">
      </div>
    </div>

    <div class="relative max-w-md w-full">
      <div class="text-center mb-8 animate-fade-in-up">
        <div class="mx-auto w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
          <UserPlus class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">Task Flow</h1>
        <p class="text-white/80 text-lg">Junte-se à nossa comunidade</p>
      </div>

      <Card class="bg-white/95 backdrop-blur-lg border-0 shadow-2xl animate-fade-in-up">
        <CardContent class="p-8">
          <form @submit.prevent="handleSubmit" class="space-y-5">

            <div class="space-y-2">
              <label for="name" class="block text-sm font-semibold text-gray-700">
                Nome completo
              </label>
              <Input id="name" name="name" type="text" autocomplete="name" required v-model="form.name"
                placeholder="Seu nome completo"
                class="h-12 px-4 text-base border-2 border-gray-200 focus:border-primary-500 rounded-xl transition-all duration-200" />
            </div>

            <div class="space-y-2">
              <label for="email" class="block text-sm font-semibold text-gray-700">
                E-mail
              </label>
              <Input id="email" name="email" type="email" autocomplete="email" required v-model="form.email"
                placeholder="seu@email.com"
                class="h-12 px-4 text-base border-2 border-gray-200 focus:border-primary-500 rounded-xl transition-all duration-200" />
            </div>

            <div class="space-y-2">
              <label for="password" class="block text-sm font-semibold text-gray-700">
                Senha
              </label>
              <Input id="password" name="password" type="password" autocomplete="new-password" required
                v-model="form.password" placeholder="Mínimo 6 caracteres"
                class="h-12 px-4 text-base border-2 border-gray-200 focus:border-primary-500 rounded-xl transition-all duration-200" />
              <p class="text-xs text-gray-500 mt-1">
                A senha deve conter pelo menos 6 caracteres
              </p>
            </div>

            <div class="flex items-start space-x-2 pt-2">
              <input type="checkbox" id="terms"
                class="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" required>
              <label for="terms" class="text-sm text-gray-600">
                Concordo com os
                <a href="#" class="text-primary-600 hover:text-primary-700 font-medium">Termos de Uso</a>
                e
                <a href="#" class="text-primary-600 hover:text-primary-700 font-medium">Política de Privacidade</a>
              </label>
            </div>

            <Button type="submit" :disabled="isLoading || form.password.length < 6"
              class="w-full h-12 bg-gradient-secondary hover:bg-gradient-primary text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none shadow-secondary">
              <span v-if="isLoading" class="mr-2">
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              </span>
              {{ isLoading ? 'Criando conta...' : 'Criar conta' }}
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
                Já tem uma conta?
                <router-link to="/login"
                  class="font-semibold text-primary-600 hover:text-secondary-600 transition-colors duration-200 ml-1">
                  Fazer login
                </router-link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
