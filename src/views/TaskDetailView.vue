<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import TaskStatusSelect from '@/components/TaskStatusSelect.vue'
import { useTasksStore } from '@/stores/tasks'
import { useCategoriesStore } from '@/stores/categories'
import { useToast } from '@/composables/useToast'
import { useDateFormat } from '@/composables/useDateFormat'
import type { Task, TaskStatus, TaskPriority } from '@/types'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Calendar,
  User,
  Tag,
  AlertCircle,
  Clock
} from 'lucide-vue-next'

interface Props {
  id: string
}

const props = defineProps<Props>()
const router = useRouter()
const toast = useToast()
const { formatDate, formatDateForInput, isOverdue: isDateOverdue } = useDateFormat()

const tasksStore = useTasksStore()
const categoriesStore = useCategoriesStore()

const task = ref<Task | null>(null)
const loading = ref(false)
const editMode = ref(false)
const deleteDialogOpen = ref(false)

const editForm = ref({
  title: '',
  description: '',
  status: 'TODO' as TaskStatus,
  priority: 'MEDIUM' as TaskPriority,
  dueDate: '',
  categoryId: ''
})

const priorityOptions = [
  { value: 'LOW', label: 'Baixa', color: 'text-green-600' },
  { value: 'MEDIUM', label: 'Média', color: 'text-yellow-600' },
  { value: 'HIGH', label: 'Alta', color: 'text-red-600' }
]

const selectedPriority = computed(() => priorityOptions.find(p => p.value === task.value?.priority))
const selectedCategory = computed(() => {
  return task.value?.category?.name || 'Sem categoria'
})
const selectedResponsible = computed(() => {
  return task.value?.assignedUser?.name || 'Não atribuído'
})

const isOverdue = computed(() => {
  if (!task.value?.dueDate || task.value.status === 'COMPLETED') return false
  return isDateOverdue(task.value.dueDate)
})

const loadTask = async () => {
  loading.value = true
  try {
    const taskData = await tasksStore.getTaskById(props.id)
    if (taskData) {
      task.value = taskData
      editForm.value = {
        title: taskData.title,
        description: taskData.description || '',
        status: taskData.status,
        priority: taskData.priority,
        dueDate: formatDateForInput(taskData.dueDate),
        categoryId: taskData.categoryId || ''
      }
    } else {
      toast.error('Tarefa não encontrada')
      router.push('/tasks')
    }
  } catch (error) {
    toast.error('Erro ao carregar tarefa')
    router.push('/tasks')
  } finally {
    loading.value = false
  }
}

const updateTaskStatus = async (status: TaskStatus) => {
  if (!task.value) return

  loading.value = true
  try {
    const result = await tasksStore.updateTaskStatus(task.value.id, status)
    if (result.success) {
      task.value.status = status
      toast.success('Status atualizado com sucesso')
    } else {
      toast.error('Erro ao atualizar status')
    }
  } catch (error) {
    toast.error('Erro ao atualizar status')
  } finally {
    loading.value = false
  }
}

const saveTask = async () => {
  if (!task.value) return

  loading.value = true
  try {
    const result = await tasksStore.updateTask(task.value.id, {
      title: editForm.value.title,
      description: editForm.value.description,
      status: editForm.value.status,
      priority: editForm.value.priority,
      dueDate: editForm.value.dueDate || undefined,
      categoryId: editForm.value.categoryId || undefined
    })

    if (result.success) {
      task.value = result.data!
      editMode.value = false
      toast.success('Tarefa atualizada com sucesso')
    } else {
      toast.error('Erro ao atualizar tarefa')
    }
  } catch (error) {
    toast.error('Erro ao atualizar tarefa')
  } finally {
    loading.value = false
  }
}

const deleteTask = async () => {
  if (!task.value) return

  loading.value = true
  try {
    const result = await tasksStore.deleteTask(task.value.id)
    if (result.success) {
      toast.success('Tarefa excluída com sucesso')
      router.push('/tasks')
    } else {
      toast.error('Erro ao excluir tarefa')
    }
  } catch (error) {
    toast.error('Erro ao excluir tarefa')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await categoriesStore.fetchCategories()
  await loadTask()
})
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <Button variant="ghost" size="sm" @click="router.push('/tasks')">
            <ArrowLeft class="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Detalhes da Tarefa</h1>
            <p v-if="task" class="text-gray-600 mt-1">
              Criada em {{ formatDate(task.createdAt) }}
            </p>
          </div>
        </div>

        <div class="flex space-x-2" v-if="task && !editMode">
          <Button variant="outline" size="sm" @click="editMode = true">
            <Edit3 class="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Dialog v-model:open="deleteDialogOpen">
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 class="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Excluir Tarefa</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" @click="deleteDialogOpen = false">Cancelar</Button>
                <Button variant="destructive" @click="deleteTask">Excluir</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="task" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Tarefa</CardTitle>
            </CardHeader>
            <CardContent class="space-y-6">
              <div v-if="!editMode">
                <!-- View Mode -->
                <div class="space-y-4">
                  <div>
                    <Label class="text-sm font-medium text-gray-700">Título</Label>
                    <h2 class="text-xl font-semibold text-gray-900 mt-1">{{ task.title }}</h2>
                  </div>

                  <div v-if="task.description">
                    <Label class="text-sm font-medium text-gray-700">Descrição</Label>
                    <p class="text-gray-700 mt-1 whitespace-pre-wrap">{{ task.description }}</p>
                  </div>
                </div>
              </div>

              <div v-else>
                <!-- Edit Mode -->
                <form @submit.prevent="saveTask" class="space-y-4">
                  <div>
                    <Label for="title">Título</Label>
                    <Input id="title" v-model="editForm.title" required />
                  </div>

                  <div>
                    <Label for="description">Descrição</Label>
                    <Textarea
                      id="description"
                      v-model="editForm.description"
                      rows="4"
                      placeholder="Descreva os detalhes da tarefa..."
                    />
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Prioridade</Label>
                      <Select v-model="editForm.priority">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem v-for="priority in priorityOptions" :key="priority.value" :value="priority.value">
                            <div class="flex items-center gap-2">
                              <div class="w-2 h-2 rounded-full" :class="priority.color.replace('text-', 'bg-')"></div>
                              {{ priority.label }}
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Categoria</Label>
                      <Select v-model="editForm.categoryId">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Sem categoria</SelectItem>
                          <SelectItem
                            v-for="category in categoriesStore.categories"
                            :key="category.id"
                            :value="category.id"
                          >
                            {{ category.name }}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label for="dueDate">Data de Vencimento</Label>
                    <Input id="dueDate" type="date" v-model="editForm.dueDate" />
                  </div>

                  <div class="flex space-x-2">
                    <Button type="submit" :disabled="loading">
                      Salvar Alterações
                    </Button>
                    <Button type="button" variant="outline" @click="editMode = false">
                      Cancelar
                    </Button>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>

        <div class="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <Clock class="h-5 w-5" />
                Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TaskStatusSelect
                :status="task.status"
                @update:status="updateTaskStatus"
                :disabled="loading"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detalhes</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <AlertCircle class="h-4 w-4" />
                  Prioridade
                </div>
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="selectedPriority?.color.replace('text-', 'bg-') + '/20 ' + selectedPriority?.color"
                >
                  {{ selectedPriority?.label }}
                </span>
              </div>

              <Separator />

              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <Tag class="h-4 w-4" />
                  Categoria
                </div>
                <span class="text-sm font-medium">{{ selectedCategory }}</span>
              </div>

              <Separator />

              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar class="h-4 w-4" />
                  Vencimento
                </div>
                <span
                  class="text-sm font-medium"
                  :class="isOverdue ? 'text-red-600' : 'text-gray-900'"
                >
                  {{ formatDate(task.dueDate) }}
                  <span v-if="isOverdue" class="text-xs text-red-500 block">Atrasada</span>
                </span>
              </div>

              <Separator />

              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <User class="h-4 w-4" />
                  Responsável
                </div>
                <span class="text-sm font-medium">{{ selectedResponsible }}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
