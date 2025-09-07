<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useDateFormat } from '@/composables/useDateFormat'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { apiService } from '@/services/api'
import { useToast } from '@/composables/useToast'
import { TrashIcon, UserPlusIcon } from 'lucide-vue-next'
import type { Task, User, TaskCollaboration, CollaborationRole } from '@/types'

const props = defineProps<{
  open: boolean
  task?: Task | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'collaboration-updated': []
}>()

const toast = useToast()
const { formatDate } = useDateFormat()
const loading = ref(false)
const addingCollaborator = ref(false)
const users = ref<User[]>([])
const collaborators = ref<TaskCollaboration[]>([])

const newCollaborator = ref({
  userId: '',
  role: 'COLLABORATOR' as CollaborationRole
})

const errors = ref<Record<string, string>>({})

const availableUsers = computed(() => {
  if (!props.task) return []
  const collaboratorIds = new Set(collaborators.value.map(c => c.userId))
  collaboratorIds.add(props.task.assignedUserId) // Exclude assigned user
  return users.value.filter(user => !collaboratorIds.has(user.id))
})

const isFormValid = computed(() => {
  return newCollaborator.value.userId !== ''
})

const loadData = async () => {
  if (!props.task) return

  loading.value = true
  try {
    const [usersRes, collaboratorsRes] = await Promise.all([
      apiService.getAllUsers(),
      apiService.getTaskCollaborators(props.task.id)
    ])

    if (usersRes?.success) {
      users.value = usersRes.data
    }

    if (collaboratorsRes?.success) {
      collaborators.value = collaboratorsRes.data
    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
  } finally {
    loading.value = false
  }
}

const addCollaborator = async () => {
  if (!props.task || !isFormValid.value) return

  addingCollaborator.value = true
  errors.value = {}

  try {
    const response = await apiService.addCollaborator({
      taskId: props.task.id,
      userId: newCollaborator.value.userId,
      role: newCollaborator.value.role
    })

    if (response?.success) {
      collaborators.value.push(response.data)
      newCollaborator.value = {
        userId: '',
        role: 'COLLABORATOR'
      }
      emit('collaboration-updated')
      toast.success('Colaborador adicionado!', 'O colaborador foi adicionado à tarefa com sucesso.')
    }
  } catch (error: any) {
    if (error?.response?.data?.message) {
      errors.value.general = error.response.data.message
    } else {
      errors.value.general = 'Erro ao adicionar colaborador. Tente novamente.'
    }
  } finally {
    addingCollaborator.value = false
  }
}

const removeCollaborator = async (collaboration: TaskCollaboration) => {
  if (!props.task) return

  if (confirm('Tem certeza que deseja remover este colaborador?')) {
    try {
      const response = await apiService.removeCollaborator(props.task.id, collaboration.userId)
      if (response?.success) {
        collaborators.value = collaborators.value.filter(c => c.id !== collaboration.id)
        emit('collaboration-updated')
        toast.success('Colaborador removido', 'O colaborador foi removido da tarefa com sucesso.')
      }
    } catch (error: any) {
      toast.error('Erro ao remover colaborador', error?.response?.data?.message || 'Tente novamente.')
    }
  }
}

const getRoleLabel = (role: CollaborationRole) => {
  switch (role) {
    case 'OWNER': return 'Proprietário'
    case 'COLLABORATOR': return 'Colaborador'
    case 'VIEWER': return 'Visualizador'
    default: return role
  }
}

const getRoleBadgeClass = (role: CollaborationRole) => {
  switch (role) {
    case 'OWNER': return 'bg-purple-100 text-purple-700'
    case 'COLLABORATOR': return 'bg-blue-100 text-blue-700'
    case 'VIEWER': return 'bg-gray-100 text-gray-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}

const getUserName = (userId: string) => {
  const user = users.value.find(u => u.id === userId)
  return user ? user.name : 'Usuário não encontrado'
}

const getUserEmail = (userId: string) => {
  const user = users.value.find(u => u.id === userId)
  return user ? user.email : ''
}

watch(() => props.open, (newOpen) => {
  if (newOpen && props.task) {
    loadData()
  }
})

onMounted(() => {
  if (props.open && props.task) {
    loadData()
  }
})
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[600px] max-h-[90vh] overflow-auto mx-4 sm:mx-0">
      <DialogHeader>
        <DialogTitle>Gerenciar Colaboradores</DialogTitle>
        <DialogDescription>
          Adicione ou remova colaboradores da tarefa "{{ task?.title }}"
        </DialogDescription>
      </DialogHeader>

      <div class="grid gap-6 py-4">
        <div v-if="errors.general" class="bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {{ errors.general }}
        </div>

        <div class="space-y-4">
          <h4 class="font-medium text-gray-900">Adicionar Colaborador</h4>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="sm:col-span-2 space-y-2">
              <Label>Usuário</Label>
              <Select
                :model-value="newCollaborator.userId"
                @update:model-value="(value: any) => newCollaborator.userId = value || ''"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="user in availableUsers" :key="user.id" :value="user.id">
                    {{ user.name }} ({{ user.email }})
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label>Função</Label>
              <Select
                :model-value="newCollaborator.role"
                @update:model-value="(value: any) => newCollaborator.role = value || 'COLLABORATOR'"
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COLLABORATOR">Colaborador</SelectItem>
                  <SelectItem value="VIEWER">Visualizador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            @click="addCollaborator"
            :disabled="!isFormValid || addingCollaborator"
            class="w-full sm:w-auto"
          >
            <UserPlusIcon class="h-4 w-4 mr-2" />
            {{ addingCollaborator ? 'Adicionando...' : 'Adicionar Colaborador' }}
          </Button>
        </div>

        <div class="space-y-4">
          <h4 class="font-medium text-gray-900">
            Colaboradores Atuais ({{ collaborators.length }})
          </h4>

          <div v-if="loading" class="text-center py-8">
            <div class="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p class="mt-2 text-sm text-gray-500">Carregando colaboradores...</p>
          </div>

          <div v-else-if="collaborators.length === 0" class="text-center py-8">
            <p class="text-gray-500">Nenhum colaborador adicionado ainda.</p>
          </div>

          <div v-else class="space-y-3">
            <Card v-for="collaboration in collaborators" :key="collaboration.id">
              <CardContent class="p-4">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <div class="flex-1 min-w-0">
                    <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <div class="font-medium truncate">{{ getUserName(collaboration.userId) }}</div>
                      <span
                        class="text-xs px-2 py-1 rounded-full self-start sm:self-auto"
                        :class="getRoleBadgeClass(collaboration.role)"
                      >
                        {{ getRoleLabel(collaboration.role) }}
                      </span>
                    </div>
                    <div class="text-sm text-gray-500 mt-1 truncate">
                      {{ getUserEmail(collaboration.userId) }}
                    </div>
                    <div class="text-xs text-gray-400 mt-1">
                      Adicionado em {{ formatDate(collaboration.createdAt) }}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    @click="removeCollaborator(collaboration)"
                    class="text-red-600 hover:text-red-700 hover:bg-red-50 self-end sm:self-auto flex-shrink-0"
                  >
                    <TrashIcon class="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
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
