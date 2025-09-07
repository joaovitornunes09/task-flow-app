<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDateFormat } from '@/composables/useDateFormat'
import AppLayout from '@/components/AppLayout.vue'
import CategoryFormModal from '@/components/CategoryFormModal.vue'
import { apiService } from '@/services/api'
import { useToast } from '@/composables/useToast'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  TagIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  RotateCcwIcon
} from 'lucide-vue-next'
import type { Category } from '@/types'
import { getErrorMessage } from '@/types'

const toast = useToast()
const { formatDate } = useDateFormat()

const loading = ref(false)
const categories = ref<Category[]>([])
const showCategoryModal = ref(false)
const categoryModalMode = ref<'create' | 'edit'>('create')
const selectedCategory = ref<Category | null>(null)

const errorMessage = ref('')

const loadCategories = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await apiService.getCategories()
    if (response?.success) {
      categories.value = response.data
    } else {
      errorMessage.value = 'Erro ao carregar categorias'
    }
  } catch (error) {
    errorMessage.value = getErrorMessage(error, 'Erro ao carregar categorias. Tente novamente.')
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  categoryModalMode.value = 'create'
  selectedCategory.value = null
  showCategoryModal.value = true
}

const openEditModal = (category: Category) => {
  categoryModalMode.value = 'edit'
  selectedCategory.value = category
  showCategoryModal.value = true
}

const handleCategorySaved = (category: Category) => {
  if (categoryModalMode.value === 'create') {
    categories.value.push(category)
  } else {
    const index = categories.value.findIndex(c => c.id === category.id)
    if (index !== -1) {
      categories.value[index] = category
    }
  }
}

const deleteCategory = async (category: Category) => {
  if (confirm(`Tem certeza que deseja excluir a categoria "${category.name}"?`)) {
    const deletePromise = apiService.deleteCategory(category.id)

    await toast.promise(deletePromise, {
      loading: `Excluindo categoria "${category.name}"...`,
      success: (response) => {
        if (response?.success) {
          categories.value = categories.value.filter(c => c.id !== category.id)
          return `Categoria "${category.name}" excluída com sucesso!`
        } else {
          throw new Error('Falha ao excluir categoria')
        }
      },
      error: (error) => {
        return getErrorMessage(error, 'Erro ao excluir categoria. Tente novamente.')
      }
    })
  }
}

onMounted(() => {
  loadCategories()
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
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Categorias</h1>
          <p class="mt-2 text-gray-600 text-sm sm:text-base">Organize suas tarefas com categorias</p>
        </div>

        <div class="flex gap-2 sm:gap-3">
          <Button variant="outline" size="sm" @click="loadCategories" class="flex-shrink-0">
            <RotateCcwIcon class="h-4 w-4 mr-2" />
            <span class="hidden sm:inline">Atualizar</span>
            <span class="sm:hidden">Atualizar</span>
          </Button>
          <Button @click="openCreateModal" class="flex-shrink-0">
            <PlusIcon class="h-4 w-4 mr-2" />
            <span class="hidden sm:inline">Nova Categoria</span>
            <span class="sm:hidden">Nova</span>
          </Button>
        </div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div
          class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent">
        </div>
        <p class="mt-4 text-gray-500">Carregando categorias...</p>
      </div>

      <div v-else-if="categories.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card v-for="category in categories" :key="category.id"
          class="hover:shadow-lg transition-all duration-200 group">
          <CardContent class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3 min-w-0 flex-1">
                <div
                  class="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                  :style="{ backgroundColor: category.color || '#6b7280' }"
                />
                <h3 class="font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors truncate">
                  {{ category.name }}
                </h3>
              </div>
              <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
                <Button variant="ghost" @click="openEditModal(category)" class="hover:bg-gray-100 rounded" title="Editar">
                  <EditIcon class="h-4 w-4 text-gray-500" />
                </Button>
                <Button variant="ghost" @click="deleteCategory(category)" class="hover:bg-gray-100 rounded" title="Excluir">
                  <TrashIcon class="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>

            <p v-if="category.description" class="text-gray-600 text-sm mb-4">
              {{ category.description }}
            </p>
            <p v-else class="text-gray-400 text-sm mb-4 italic">
              Sem descrição
            </p>

            <div class="text-xs text-gray-500 mt-auto">
              Criado em {{ formatDate(category.createdAt) }}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card v-else>
        <CardContent class="text-center py-12">
          <TagIcon class="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Nenhuma categoria encontrada</h3>
          <p class="text-gray-500 mb-6">
            Comece criando sua primeira categoria para organizar suas tarefas
          </p>
          <Button @click="openCreateModal">
            <PlusIcon class="h-4 w-4 mr-2" />
            Nova Categoria
          </Button>
        </CardContent>
      </Card>
    </div>

    <CategoryFormModal
      v-model:open="showCategoryModal"
      :mode="categoryModalMode"
      :category="selectedCategory"
      @category-saved="handleCategorySaved"
    />
  </AppLayout>
</template>
