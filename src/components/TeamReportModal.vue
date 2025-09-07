<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { apiService } from '@/services/api'
import { UsersIcon, CheckCircleIcon, AlertCircleIcon, ClockIcon } from 'lucide-vue-next'
import { getErrorMessage } from '@/types'
import type { User, TeamMemberReport } from '@/types'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const loading = ref(false)
const generating = ref(false)
const users = ref<User[]>([])
const selectedUsers = ref<string[]>([])
const teamReport = ref<TeamMemberReport[]>([])

const errors = ref<Record<string, string>>({})

const isFormValid = computed(() => {
  return selectedUsers.value.length > 0
})

const loadUsers = async () => {
  loading.value = true
  try {
    const response = await apiService.getAllUsers()
    if (response?.success) {
      users.value = response.data
    }
  } catch (error) {
    console.error('Erro ao carregar usuários:', error)
  } finally {
    loading.value = false
  }
}

const generateReport = async () => {
  if (!isFormValid.value) return

  generating.value = true
  errors.value = {}

  try {
    const response = await apiService.getTeamReport(selectedUsers.value)
    if (response?.success) {
      teamReport.value = response.data
    }
  } catch (error) {
    errors.value.general = getErrorMessage(error, 'Erro ao gerar relatório da equipe. Tente novamente.')
  } finally {
    generating.value = false
  }
}

const toggleUser = (userId: string) => {
  const index = selectedUsers.value.indexOf(userId)
  if (index === -1) {
    selectedUsers.value.push(userId)
  } else {
    selectedUsers.value.splice(index, 1)
  }
}

const clearReport = () => {
  teamReport.value = []
  selectedUsers.value = []
  errors.value = {}
}

const getTotalStats = computed(() => {
  if (teamReport.value.length === 0) return { assigned: 0, completed: 0, overdue: 0 }

  return teamReport.value.reduce((acc, member) => ({
    assigned: acc.assigned + member.assignedTasks,
    completed: acc.completed + member.completedTasks,
    overdue: acc.overdue + member.overdueTasks
  }), { assigned: 0, completed: 0, overdue: 0 })
})

watch(() => props.open, (newOpen) => {
  if (newOpen) {
    loadUsers()
    clearReport()
  }
})
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[700px] max-h-[80vh] overflow-auto">
      <DialogHeader>
        <DialogTitle>Relatório da Equipe</DialogTitle>
        <DialogDescription>
          Selecione os membros da equipe para gerar um relatório comparativo
        </DialogDescription>
      </DialogHeader>

      <div class="grid gap-6 py-4">
        <div v-if="errors.general" class="bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {{ errors.general }}
        </div>

        <div class="space-y-4">
          <Label class="text-base font-medium">Selecionar Membros da Equipe</Label>

          <div v-if="loading" class="text-center py-4">
            <div class="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p class="mt-2 text-sm text-gray-500">Carregando usuários...</p>
          </div>

          <div v-else class="space-y-2 max-h-48 overflow-y-auto">
            <div
              v-for="user in users"
              :key="user.id"
              class="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
              @click="toggleUser(user.id)"
            >
              <input
                type="checkbox"
                :checked="selectedUsers.includes(user.id)"
                class="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                @click.stop
                @change="toggleUser(user.id)"
              />
              <div class="flex-1">
                <p class="font-medium text-gray-900">{{ user.name }}</p>
                <p class="text-sm text-gray-500">{{ user.email }}</p>
              </div>
            </div>
          </div>

          <div class="flex justify-between items-center">
            <p class="text-sm text-gray-600">
              {{ selectedUsers.length }} usuário(s) selecionado(s)
            </p>
            <div class="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                @click="clearReport"
                :disabled="generating"
              >
                Limpar
              </Button>
              <Button
                @click="generateReport"
                :disabled="!isFormValid || generating"
                size="sm"
              >
                {{ generating ? 'Gerando...' : 'Gerar Relatório' }}
              </Button>
            </div>
          </div>
        </div>

        <div v-if="teamReport.length > 0" class="space-y-6">
          <div class="border-t pt-6">
            <h4 class="font-medium text-gray-900 mb-4">Resultados do Relatório</h4>

            <div class="grid grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent class="p-4 text-center">
                  <ClockIcon class="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p class="text-2xl font-bold text-gray-900">{{ getTotalStats.assigned }}</p>
                  <p class="text-sm text-gray-500">Total Atribuídas</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent class="p-4 text-center">
                  <CheckCircleIcon class="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p class="text-2xl font-bold text-gray-900">{{ getTotalStats.completed }}</p>
                  <p class="text-sm text-gray-500">Total Concluídas</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent class="p-4 text-center">
                  <AlertCircleIcon class="h-6 w-6 text-red-600 mx-auto mb-2" />
                  <p class="text-2xl font-bold text-gray-900">{{ getTotalStats.overdue }}</p>
                  <p class="text-sm text-gray-500">Total Atrasadas</p>
                </CardContent>
              </Card>
            </div>

            <div class="space-y-3">
              <Card v-for="member in teamReport" :key="member.userId">
                <CardContent class="p-4">
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-3">
                      <div class="p-2 bg-blue-100 rounded-lg">
                        <UsersIcon class="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h5 class="font-medium text-gray-900">{{ member.userName }}</h5>
                      </div>
                    </div>
                  </div>

                  <div class="grid grid-cols-3 gap-4">
                    <div class="text-center">
                      <p class="text-lg font-semibold text-gray-900">{{ member.assignedTasks }}</p>
                      <p class="text-xs text-gray-500">Atribuídas</p>
                    </div>
                    <div class="text-center">
                      <p class="text-lg font-semibold text-green-600">{{ member.completedTasks }}</p>
                      <p class="text-xs text-gray-500">Concluídas</p>
                    </div>
                    <div class="text-center">
                      <p class="text-lg font-semibold text-red-600">{{ member.overdueTasks }}</p>
                      <p class="text-xs text-gray-500">Atrasadas</p>
                    </div>
                  </div>

                  <div v-if="member.assignedTasks > 0" class="mt-3">
                    <div class="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Taxa de Conclusão</span>
                      <span>{{ Math.round((member.completedTasks / member.assignedTasks) * 100) }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div
                        class="bg-green-500 h-2 rounded-full transition-all duration-300"
                        :style="{ width: `${(member.completedTasks / member.assignedTasks) * 100}%` }"
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)">
          Fechar
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
