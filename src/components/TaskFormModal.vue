<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
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
import { apiService } from '@/services/api'
import { useToast } from '@/composables/useToast'
import type { Task, CreateTaskData, UpdateTaskData, Category, User } from '@/types'
import { getErrorMessage } from '@/types'
import { TASK_PRIORITY_OPTIONS, TaskPriority } from '@/enums'

const props = defineProps<{
  open: boolean
  task?: Task | null
  mode: 'create' | 'edit'
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'task-saved': []
}>()

const toast = useToast()
const { formatDateForInput } = useDateFormat()
const loading = ref(false)
const categories = ref<Category[]>([])
const users = ref<User[]>([])

const form = ref({
  title: '',
  description: '',
  priority: TaskPriority.MEDIUM,
  dueDate: '',
  categoryId: '',
  assignedUserId: ''
})

const errors = ref<Record<string, string>>({})

const isFormValid = computed(() => {
  const valid = form.value.title.trim() !== '' && form.value.assignedUserId !== ''

  return valid
})

const modalTitle = computed(() => {
  return props.mode === 'create' ? 'Nova Tarefa' : 'Editar Tarefa'
})

const saveButtonText = computed(() => {
  return loading.value
    ? (props.mode === 'create' ? 'Criando...' : 'Atualizando...')
    : (props.mode === 'create' ? 'Criar Tarefa' : 'Atualizar Tarefa')
})

const loadData = async () => {
  try {
    const [categoriesRes, usersRes] = await Promise.all([
      apiService.getCategories(),
      apiService.getAllUsers()
    ])

    if (categoriesRes?.success && categoriesRes.data) {
      categories.value = categoriesRes.data
    }

    if (usersRes?.success && usersRes.data) {
      users.value = usersRes.data
    }
  } catch (error) {
    errors.value.general = 'Erro ao carregar dados do formulário'
  }
}

const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    priority: TaskPriority.MEDIUM,
    dueDate: '',
    categoryId: '',
    assignedUserId: ''
  }
  errors.value = {}
}

const populateForm = (task: Task) => {
  form.value = {
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    dueDate: formatDateForInput(task.dueDate),
    categoryId: task.categoryId || '',
    assignedUserId: task.assignedUserId
  }
}

const validateForm = (): boolean => {
  errors.value = {}

  if (!form.value.title.trim()) {
    errors.value.title = 'Título é obrigatório'
  }

  if (!form.value.assignedUserId) {
    errors.value.assignedUserId = 'Usuário responsável é obrigatório'
  }

  return Object.keys(errors.value).length === 0
}

const handleSave = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    let response

    if (props.mode === 'create') {
      const data: CreateTaskData = {
        title: form.value.title,
        description: form.value.description || undefined,
        priority: form.value.priority,
        dueDate: form.value.dueDate || undefined,
        categoryId: (form.value.categoryId && form.value.categoryId !== '') ? form.value.categoryId : undefined,
        assignedUserId: form.value.assignedUserId
      }
      response = await apiService.createTask(data)
    } else if (props.task) {
      const data: UpdateTaskData = {
        title: form.value.title,
        description: form.value.description || undefined,
        priority: form.value.priority,
        dueDate: form.value.dueDate || undefined,
        categoryId: (form.value.categoryId && form.value.categoryId !== '') ? form.value.categoryId : undefined,
        assignedUserId: form.value.assignedUserId
      }

      response = await apiService.updateTask(props.task.id, data)
    }


    if (response?.success) {
      emit('task-saved')
      emit('update:open', false)
      resetForm()

      const actionText = props.mode === 'create' ? 'criada' : 'atualizada'
      toast.success(`Tarefa ${actionText} com sucesso!`, `A tarefa "${response.data.title}" foi ${actionText}.`)
    } else {
      errors.value.general = response?.message || 'Erro desconhecido ao salvar tarefa'
    }
  } catch (error: unknown) {
    errors.value.general = getErrorMessage(error, 'Erro ao salvar tarefa. Tente novamente.')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  emit('update:open', false)
  resetForm()
}

watch(() => props.open, async (newOpen) => {
  if (newOpen) {
    await loadData()

    if (props.mode === 'edit' && props.task) {
      populateForm(props.task)
    } else {
      resetForm()
    }
  } else {
    resetForm()
  }
})

onMounted(async () => {
  await loadData()
})
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[500px] mx-4 sm:mx-0 max-h-[90vh] overflow-auto">
      <DialogHeader>
        <DialogTitle>{{ modalTitle }}</DialogTitle>
        <DialogDescription>
          {{ mode === 'create'
            ? 'Preencha os dados para criar uma nova tarefa.'
            : 'Edite as informações da tarefa.'
          }}
        </DialogDescription>
      </DialogHeader>

      <div class="grid gap-4 py-4">
        <div v-if="errors.general" class="bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {{ errors.general }}
        </div>

        <div class="space-y-2">
          <Label for="title">Título *</Label>
          <Input
            id="title"
            v-model="form.title"
            placeholder="Digite o título da tarefa"
            :class="{ 'border-red-500': errors.title }"
          />
          <span v-if="errors.title" class="text-red-500 text-xs">{{ errors.title }}</span>
        </div>

        <div class="space-y-2">
          <Label for="description">Descrição</Label>
          <Textarea
            id="description"
            v-model="form.description"
            placeholder="Digite uma descrição (opcional)"
            rows="3"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="priority">Prioridade</Label>
            <Select :model-value="form.priority" @update:model-value="(value: unknown) => form.priority = (value as TaskPriority) || TaskPriority.MEDIUM">
              <SelectTrigger>
                <SelectValue placeholder="Selecione a prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="priority in TASK_PRIORITY_OPTIONS" :key="priority.value" :value="priority.value">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full" :class="priority.bgColor"></div>
                    {{ priority.label }}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label for="dueDate">Prazo</Label>
            <Input
              id="dueDate"
              type="date"
              v-model="form.dueDate"
            />
          </div>
        </div>

        <div class="space-y-2">
          <Label for="category">Categoria</Label>
          <Select
            :model-value="form.categoryId || undefined"
            @update:model-value="(value: unknown) => {
              form.categoryId = (value as string) || ''
            }"
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria (opcional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem :value="null">Nenhuma categoria</SelectItem>
              <SelectItem v-for="category in categories" :key="category.id" :value="category.id">
                <div class="flex items-center gap-2">
                  <div
                    v-if="category.color"
                    class="w-2 h-2 rounded-full"
                    :style="{ backgroundColor: category.color }"
                  ></div>
                  {{ category.name }}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <div class="text-xs text-gray-500 mt-1">
            {{ categories.length }} categoria(s) disponível(is)
          </div>
        </div>

        <div class="space-y-2">
          <Label for="assignedUser">Responsável *</Label>
          <div v-if="users.length === 0" class="text-sm text-gray-500 p-2 border border-gray-200 rounded">
            {{ loading ? 'Carregando usuários...' : 'Nenhum usuário encontrado' }}
          </div>
          <Select
            v-else
            :model-value="form.assignedUserId || undefined"
            @update:model-value="(value: unknown) => {
              form.assignedUserId = (value as string) || ''
            }"
          >
            <SelectTrigger :class="{ 'border-red-500': errors.assignedUserId }">
              <SelectValue
                :placeholder="users.length > 0 ? 'Selecione o responsável' : 'Carregando usuários...'"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }} ({{ user.email }})
              </SelectItem>
            </SelectContent>
          </Select>
          <span v-if="errors.assignedUserId" class="text-red-500 text-xs">{{ errors.assignedUserId }}</span>
          <div class="text-xs text-gray-500 mt-1">
            {{ users.length }} usuário(s) disponível(is)
          </div>
        </div>
      </div>

      <DialogFooter class="flex flex-col sm:flex-row sm:gap-0">
        <Button variant="outline" @click="handleCancel" :disabled="loading" class="w-full sm:w-auto mr-2">
          Cancelar
        </Button>
        <Button @click="handleSave" :disabled="!isFormValid || loading" class="w-full sm:w-auto">
          {{ saveButtonText }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
