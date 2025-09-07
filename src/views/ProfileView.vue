<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import AppLayout from '@/components/AppLayout.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const form = reactive({
  name: '',
  email: ''
})

const user = computed(() => authStore.user)
const isLoading = computed(() => authStore.isLoading)

const resetForm = () => {
  if (user.value) {
    form.name = user.value.name
    form.email = user.value.email
  }
}

const handleSubmit = async () => {
  const updateData: { name?: string; password?: string; email?: string } = {}

  if (form.name !== user.value?.name) {
    updateData.name = form.name
  }

  if (form.email !== user.value?.email) {
    updateData.email = form.email
  }

  if (Object.keys(updateData).length > 0) {
    try {
      const result = await authStore.updateProfile(updateData)
      if (result.success) {
        toast.success('Perfil atualizado com sucesso!')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      } else {
        toast.error('Erro ao atualizar perfil. Tente novamente.')
      }
    } catch (error) {
      toast.error('Erro ao atualizar perfil. Tente novamente.')
    }
  } else {
    toast.info('Nenhuma alteração foi feita.')
  }
}

onMounted(() => {
  resetForm()
})
</script>

<template>
  <AppLayout>
    <div class="px-4 py-6 sm:px-0">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Perfil</h1>
        <p class="mt-2 text-gray-600">Gerencie as configurações da sua conta e preferências.</p>
      </div>

      <div class="max-w-2xl">
        <Card>
          <CardHeader>
            <h2 class="text-xl font-semibold">Informações da Conta</h2>
            <p class="text-sm text-gray-600">Atualize suas informações pessoais e preferências.</p>
          </CardHeader>
          <CardContent class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Nome Completo</label>
              <div class="mt-1">
                <Input id="name" v-model="form.name" placeholder="Digite seu nome completo" />
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Endereço de E-mail</label>
              <div class="mt-1">
                <Input id="email" type="email" v-model="form.email" placeholder="Digite seu e-mail" />
              </div>
            </div>


            <div class="flex justify-end space-x-3">
              <Button variant="outline" @click="resetForm">
                Cancelar
              </Button>
              <Button @click="handleSubmit" :disabled="isLoading">
                {{ isLoading ? 'Atualizando...' : 'Atualizar Perfil' }}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </AppLayout>
</template>
