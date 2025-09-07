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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { apiService } from '@/services/api'
import { useToast } from '@/composables/useToast'
import type { Category } from '@/types'
import { getErrorMessage } from '@/types'

const props = defineProps<{
  open: boolean
  category?: Category | null
  mode: 'create' | 'edit'
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'category-saved': [category: Category]
}>()

const toast = useToast()
const loading = ref(false)

const form = ref({
  name: '',
  description: '',
  color: '#3b82f6'
})

const errors = ref<Record<string, string>>({})

const isFormValid = computed(() => {
  return form.value.name.trim() !== ''
})

const modalTitle = computed(() => {
  return props.mode === 'create' ? 'Nova Categoria' : 'Editar Categoria'
})

const saveButtonText = computed(() => {
  return loading.value
    ? (props.mode === 'create' ? 'Criando...' : 'Atualizando...')
    : (props.mode === 'create' ? 'Criar Categoria' : 'Atualizar Categoria')
})

const colorOptions = [
  { value: '#3b82f6', name: 'Azul' },
  { value: '#ef4444', name: 'Vermelho' },
  { value: '#10b981', name: 'Verde' },
  { value: '#f59e0b', name: 'Amarelo' },
  { value: '#8b5cf6', name: 'Roxo' },
  { value: '#06b6d4', name: 'Ciano' },
  { value: '#f97316', name: 'Laranja' },
  { value: '#ec4899', name: 'Rosa' },
  { value: '#6b7280', name: 'Cinza' },
  { value: '#84cc16', name: 'Lima' }
]

const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    color: '#3b82f6'
  }
  errors.value = {}
}

const populateForm = (category: Category) => {
  form.value = {
    name: category.name,
    description: category.description || '',
    color: category.color || '#3b82f6'
  }
}

const validateForm = (): boolean => {
  errors.value = {}

  if (!form.value.name.trim()) {
    errors.value.name = 'Nome é obrigatório'
  }

  return Object.keys(errors.value).length === 0
}

const handleSave = async () => {
  if (!validateForm()) return

  loading.value = true

  try {
    let response

    const data = {
      name: form.value.name,
      description: form.value.description || null,
      color: form.value.color
    }

    if (props.mode === 'create') {
      response = await apiService.createCategory(data)
    } else if (props.category) {
      response = await apiService.updateCategory(props.category.id, data)
    }

    if (response?.success) {
      emit('category-saved', response.data)
      emit('update:open', false)
      resetForm()

      const actionText = props.mode === 'create' ? 'criada' : 'atualizada'
      toast.success(`Categoria ${actionText} com sucesso!`, `A categoria "${response.data.name}" foi ${actionText}.`)
    }
  } catch (error) {
    errors.value.general = getErrorMessage(error, 'Erro ao salvar categoria. Tente novamente.')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  emit('update:open', false)
  resetForm()
}

watch(() => props.open, (newOpen) => {
  if (newOpen) {
    if (props.mode === 'edit' && props.category) {
      populateForm(props.category)
    } else {
      resetForm()
    }
  } else {
    resetForm()
  }
})
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[450px] mx-4 sm:mx-0 max-h-[90vh] overflow-auto">
      <DialogHeader>
        <DialogTitle>{{ modalTitle }}</DialogTitle>
        <DialogDescription>
          {{ mode === 'create'
            ? 'Preencha os dados para criar uma nova categoria.'
            : 'Edite as informações da categoria.'
          }}
        </DialogDescription>
      </DialogHeader>

      <div class="grid gap-4 py-4">
        <div v-if="errors.general" class="bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {{ errors.general }}
        </div>

        <div class="space-y-2">
          <Label for="name">Nome *</Label>
          <Input
            id="name"
            v-model="form.name"
            placeholder="Digite o nome da categoria"
            :class="{ 'border-red-500': errors.name }"
          />
          <span v-if="errors.name" class="text-red-500 text-xs">{{ errors.name }}</span>
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

        <div class="space-y-2">
          <Label for="color">Cor</Label>
          <div class="grid grid-cols-5 sm:grid-cols-8 gap-2">
            <button
              v-for="colorOption in colorOptions"
              :key="colorOption.value"
              type="button"
              class="w-8 h-8 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition-all"
              :class="form.color === colorOption.value ? 'border-gray-900 ring-2 ring-gray-900' : 'border-gray-300'"
              :style="{ backgroundColor: colorOption.value }"
              :title="colorOption.name"
              @click="form.color = colorOption.value"
            />
          </div>
          <div class="flex items-center gap-2 mt-2">
            <div
              class="w-4 h-4 rounded-full border border-gray-300"
              :style="{ backgroundColor: form.color }"
            />
            <span class="text-sm text-gray-600">Cor selecionada</span>
          </div>
        </div>
      </div>

      <DialogFooter class="flex flex-col sm:flex-row gap-2 sm:gap-0">
        <Button variant="outline" @click="handleCancel" :disabled="loading" class="w-full sm:w-auto">
          Cancelar
        </Button>
        <Button @click="handleSave" :disabled="!isFormValid || loading" class="w-full sm:w-auto">
          {{ saveButtonText }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
