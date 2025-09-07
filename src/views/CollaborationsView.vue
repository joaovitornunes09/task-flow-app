<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDateFormat } from '@/composables/useDateFormat'
import AppLayout from '@/components/AppLayout.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { apiService } from '@/services/api'
import {
  UsersIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon
} from 'lucide-vue-next'
import type { TaskCollaboration } from '@/types'
import { TaskPriority, TASK_PRIORITY_OPTIONS } from '@/enums'

const { formatDate } = useDateFormat()

const loading = ref(false)
const collaborations = ref<TaskCollaboration[]>([])

const loadCollaborations = async () => {
  loading.value = true
  try {
    const response = await apiService.getUserCollaborations()
    if (response?.success) {
      collaborations.value = response.data
    }
  } catch (error) {
    console.error('Erro ao carregar colaborações:', error)
  } finally {
    loading.value = false
  }
}

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'OWNER': return 'Proprietário'
    case 'COLLABORATOR': return 'Colaborador'
    case 'VIEWER': return 'Visualizador'
    default: return role
  }
}

const getRoleBadgeClass = (role: string) => {
  switch (role) {
    case 'OWNER': return 'bg-purple-100 text-purple-700'
    case 'COLLABORATOR': return 'bg-blue-100 text-blue-700'
    case 'VIEWER': return 'bg-gray-100 text-gray-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'COMPLETED': return CheckCircleIcon
    case 'IN_PROGRESS': return ClockIcon
    case 'TODO': return AlertCircleIcon
    default: return AlertCircleIcon
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED': return 'text-green-600'
    case 'IN_PROGRESS': return 'text-blue-600'
    case 'TODO': return 'text-gray-600'
    default: return 'text-gray-600'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'TODO': return 'A Fazer'
    case 'IN_PROGRESS': return 'Em Progresso'
    case 'COMPLETED': return 'Concluído'
    default: return status
  }
}

const getPriorityLabel = (priority: TaskPriority | undefined) => {
  if (!priority) return 'N/A'
  const option = TASK_PRIORITY_OPTIONS.find(p => p.value === priority)
  return option?.label || 'N/A'
}

onMounted(() => {
  loadCollaborations()
})
</script>

<template>
  <AppLayout>
    <div class="space-y-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Minhas Colaborações</h1>
          <p class="mt-2 text-gray-600 text-sm sm:text-base">Tarefas onde você é colaborador ou tem permissões especiais</p>
        </div>

        <div class="flex gap-3">
          <Button variant="outline" size="sm" @click="loadCollaborations" class="flex-shrink-0">
            <UsersIcon class="h-4 w-4 mr-2" />
            <span class="hidden sm:inline">Atualizar</span>
            <span class="sm:hidden">Atualizar</span>
          </Button>
        </div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div
          class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent">
        </div>
        <p class="mt-4 text-gray-500">Carregando colaborações...</p>
      </div>

      <div v-else-if="collaborations.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Card v-for="collaboration in collaborations" :key="collaboration.id"
          class="hover:shadow-lg transition-all duration-200">
          <CardContent class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <component
                    :is="getStatusIcon(collaboration.task?.status || '')"
                    class="h-4 w-4"
                    :class="getStatusColor(collaboration.task?.status || '')"
                  />
                  <span
                    class="text-xs px-2 py-1 rounded-full"
                    :class="getRoleBadgeClass(collaboration.role)"
                  >
                    {{ getRoleLabel(collaboration.role) }}
                  </span>
                </div>

                <h3 class="font-semibold text-lg text-gray-900 mb-2">
                  {{ collaboration.task?.title || 'Tarefa sem título' }}
                </h3>

                <p v-if="collaboration.task?.description" class="text-gray-600 text-sm mb-3 line-clamp-2">
                  {{ collaboration.task.description }}
                </p>
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Status:</span>
                <div class="flex items-center gap-1">
                  <component
                    :is="getStatusIcon(collaboration.task?.status || '')"
                    class="h-3 w-3"
                    :class="getStatusColor(collaboration.task?.status || '')"
                  />
                  <span class="font-medium">
                    {{ getStatusLabel(collaboration.task?.status || '') }}
                  </span>
                </div>
              </div>

              <div v-if="collaboration.task?.priority" class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Prioridade:</span>
                <div class="flex items-center gap-1">
                  <div class="w-2 h-2 rounded-full" :class="{
                    'bg-red-500': collaboration.task?.priority === TaskPriority.HIGH,
                    'bg-yellow-500': collaboration.task?.priority === TaskPriority.MEDIUM,
                    'bg-green-500': collaboration.task?.priority === TaskPriority.LOW
                  }"></div>
                  <span class="font-medium">
                    {{ getPriorityLabel(collaboration.task?.priority) }}
                  </span>
                </div>
              </div>

              <div v-if="collaboration.task?.category" class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Categoria:</span>
                <span class="font-medium">{{ collaboration.task.category.name }}</span>
              </div>

              <div v-if="collaboration.task?.assignedUser" class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Responsável:</span>
                <span class="font-medium">{{ collaboration.task.assignedUser.name }}</span>
              </div>

              <div v-if="collaboration.task?.dueDate" class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Prazo:</span>
                <div class="flex items-center gap-1">
                  <CalendarIcon class="h-3 w-3 text-gray-400" />
                  <span class="font-medium">
                    {{ formatDate(collaboration.task.dueDate) }}
                  </span>
                </div>
              </div>

              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Colaboração desde:</span>
                <span class="font-medium text-gray-900">
                  {{ formatDate(collaboration.createdAt) }}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card v-else>
        <CardContent class="text-center py-12">
          <UsersIcon class="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Nenhuma colaboração encontrada</h3>
          <p class="text-gray-500 mb-6">
            Você ainda não está colaborando em nenhuma tarefa.
            <br>Aguarde ser convidado para tarefas ou peça para ser adicionado como colaborador.
          </p>
        </CardContent>
      </Card>
    </div>
  </AppLayout>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
