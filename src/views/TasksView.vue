<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import TaskFormModal from '@/components/TaskFormModal.vue'
import CollaborationModal from '@/components/CollaborationModal.vue'
import { apiService } from '@/services/api'
import { useToast } from '@/composables/useToast'
import { useDateFormat } from '@/composables/useDateFormat'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  CheckSquareIcon,
  PlusIcon,
  SearchIcon,
  RotateCcwIcon,
  EditIcon,
  TrashIcon,
  UsersIcon
} from 'lucide-vue-next'
import type { Task, Category } from '@/types'

const router = useRouter()
const toast = useToast()
const { formatDate, isOverdue, isDueSoon } = useDateFormat()

const loading = ref(false)
const tasks = ref<Task[]>([])
const categories = ref<Category[]>([])
const showTaskModal = ref(false)
const taskModalMode = ref<'create' | 'edit'>('create')
const selectedTask = ref<Task | null>(null)
const showCollaborationModal = ref(false)
const selectedTaskForCollaboration = ref<Task | null>(null)

const searchQuery = ref('')
const selectedStatus = ref('')
const selectedPriority = ref('')
const selectedCategory = ref('')

const filteredTasks = computed(() => {
  return tasks.value.filter(task => {
    const matchesSearch = !searchQuery.value ||
      task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.value.toLowerCase()))

    const matchesStatus = !selectedStatus.value || task.status === selectedStatus.value
    const matchesPriority = !selectedPriority.value || task.priority === selectedPriority.value
    const matchesCategory = !selectedCategory.value || task.categoryId === selectedCategory.value

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })
})

const errorMessage = ref('')

const loadTasks = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const tasksResponse = await apiService.getTasks()
    if (tasksResponse?.success) {
      tasks.value = tasksResponse.data
    } else {
      errorMessage.value = 'Erro ao carregar tarefas'
    }

    const categoriesResponse = await apiService.getCategories()
    if (categoriesResponse?.success) {
      categories.value = categoriesResponse.data
    }
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.message || 'Erro ao carregar dados. Tente novamente.'
  } finally {
    loading.value = false
  }
}

const viewTask = (task: Task) => {
  router.push(`/tasks/${task.id}`)
}

const openCreateModal = () => {
  taskModalMode.value = 'create'
  selectedTask.value = null
  showTaskModal.value = true
}

const openEditModal = (task: Task) => {
  taskModalMode.value = 'edit'
  selectedTask.value = task
  showTaskModal.value = true
}

const handleTaskSaved = async () => {
 await loadTasks()
}

const openCollaborationModal = (task: Task) => {
  selectedTaskForCollaboration.value = task
  showCollaborationModal.value = true
}

const handleCollaborationUpdated = () => {
  loadTasks()
}

const deleteTask = async (task: Task) => {
  if (confirm(`Tem certeza que deseja excluir a tarefa "${task.title}"?`)) {
    const deletePromise = apiService.deleteTask(task.id)

    await toast.promise(deletePromise, {
      loading: `Excluindo tarefa "${task.title}"...`,
      success: (response) => {
        if (response?.success) {
          tasks.value = tasks.value.filter(t => t.id !== task.id)
          return `Tarefa "${task.title}" excluída com sucesso!`
        } else {
          throw new Error('Falha ao excluir tarefa')
        }
      },
      error: (error) => {
        return error?.response?.data?.message || 'Erro ao excluir tarefa. Tente novamente.'
      }
    })
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

const getCategoryName = (task: Task) => {
  return task.category?.name || 'Sem categoria'
}

const getResponsibleName = (task: Task) => {
  return task.assignedUser?.name || 'Não atribuído'
}


onMounted(() => {
  loadTasks()
})
</script>

<template>
  <AppLayout>
    <div class="space-y-8">
      <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
        <div class="flex items-center justify-between">
          <span>{{ errorMessage }}</span>
          <button @click="errorMessage = ''" class="text-red-500 hover:text-red-700">
            ✕
          </button>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Tarefas</h1>
          <p class="mt-2 text-gray-600 text-sm sm:text-base">Gerencie e organize todas as suas tarefas</p>
        </div>

        <div class="flex gap-2 sm:gap-3">
          <Button variant="outline" size="sm" @click="loadTasks" class="flex-shrink-0">
            <RotateCcwIcon class="h-4 w-4 mr-2" />
            <span class="hidden sm:inline">Atualizar</span>
            <span class="sm:hidden">Atualizar</span>
          </Button>
          <Button @click="openCreateModal" class="flex-shrink-0">
            <PlusIcon class="h-4 w-4 mr-2" />
            <span class="hidden sm:inline">Nova Tarefa</span>
            <span class="sm:hidden">Nova</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent class="p-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
              <div class="relative">
                <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input v-model="searchQuery" placeholder="Buscar tarefas..." class="pl-10" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select v-model="selectedStatus"
                class="w-full h-12 px-4 text-base border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none">
                <option value="">Todos</option>
                <option value="TODO">A Fazer</option>
                <option value="IN_PROGRESS">Em Progresso</option>
                <option value="COMPLETED">Concluído</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
              <select v-model="selectedPriority"
                class="w-full h-12 px-4 text-base border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none">
                <option value="">Todas</option>
                <option value="HIGH">Alta</option>
                <option value="MEDIUM">Média</option>
                <option value="LOW">Baixa</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
              <select v-model="selectedCategory"
                class="w-full h-12 px-4 text-base border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none">
                <option value="">Todas</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div v-if="loading" class="text-center py-12">
        <div
          class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent">
        </div>
        <p class="mt-4 text-gray-500">Carregando tarefas...</p>
      </div>

      <div v-else-if="filteredTasks.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        <Card v-for="task in filteredTasks" :key="task.id"
          class="hover:shadow-lg transition-all duration-200 cursor-pointer group" @click="viewTask(task)">
          <CardContent class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="w-3 h-3 rounded-full" :class="{
                'bg-red-500': task.priority === 'HIGH',
                'bg-yellow-500': task.priority === 'MEDIUM',
                'bg-green-500': task.priority === 'LOW'
              }"></div>
              <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" @click.stop="openCollaborationModal(task)" class=" hover:bg-gray-100"
                  title="Gerenciar Colaboradores">
                  <UsersIcon class="h-4 w-4 text-blue-500" />
                </Button>
                <Button variant="ghost" @click.stop="openEditModal(task)" class=" hover:bg-gray-100 rounded"
                  title="Editar Tarefa">
                  <EditIcon class="h-4 w-4 text-gray-500" />
                </Button>
                <Button variant="ghost" @click.stop="deleteTask(task)" class=" hover:bg-gray-100 rounded"
                  title="Excluir Tarefa">
                  <TrashIcon class="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>

            <h3 class="font-semibold text-lg text-gray-900 mb-2 group-hover:text-primary transition-colors">
              {{ task.title }}
            </h3>

            <p v-if="task.description" class="text-gray-600 text-sm mb-4 line-clamp-2">
              {{ task.description }}
            </p>

            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Status:</span>
                <span class="text-xs font-medium px-3 py-1 rounded-full" :class="{
                  'bg-green-100 text-green-700': task.status === 'COMPLETED',
                  'bg-blue-100 text-blue-700': task.status === 'IN_PROGRESS',
                  'bg-gray-100 text-gray-600': task.status === 'TODO'
                }">
                  {{ getStatusLabel(task.status) }}
                </span>
              </div>

              <div v-if="task.category" class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Categoria:</span>
                <span class="text-sm font-medium text-gray-900">{{ getCategoryName(task) }}</span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Responsável:</span>
                <span class="text-sm font-medium text-gray-900">{{ getResponsibleName(task) }}</span>
              </div>

              <div v-if="task.dueDate" class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Prazo:</span>
                <span class="text-sm" :class="{
                  'text-red-600 font-medium': isOverdue(task.dueDate),
                  'text-yellow-600 font-medium': isDueSoon(task.dueDate),
                  'text-gray-600': !isOverdue(task.dueDate) && !isDueSoon(task.dueDate)
                }">
                  {{ formatDate(task.dueDate) }}
                </span>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>

      <Card v-else>
        <CardContent class="text-center py-12">
          <CheckSquareIcon class="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Nenhuma tarefa encontrada</h3>
          <p class="text-gray-500 mb-6">
            {{ searchQuery || selectedStatus || selectedPriority || selectedCategory
              ? 'Tente ajustar os filtros ou' : 'Comece criando sua primeira tarefa' }}
          </p>
          <Button @click="openCreateModal">
            <PlusIcon class="h-4 w-4 mr-2" />
            Nova Tarefa
          </Button>
        </CardContent>
      </Card>
    </div>

    <TaskFormModal v-model:open="showTaskModal" :mode="taskModalMode" :task="selectedTask"
      @task-saved="handleTaskSaved" />

    <CollaborationModal v-model:open="showCollaborationModal" :task="selectedTaskForCollaboration"
      @collaboration-updated="handleCollaborationUpdated" />
  </AppLayout>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
