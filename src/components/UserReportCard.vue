<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { apiService } from '@/services/api'
import { CheckCircleIcon, ClockIcon, AlertCircleIcon, TagIcon, RotateCcwIcon } from 'lucide-vue-next'
import type { UserReport } from '@/types'
import { Button } from './ui/button'

const loading = ref(false)
const report = ref<UserReport | null>(null)
const error = ref('')

const loadReport = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await apiService.getUserReport()
    if (response?.success) {
      report.value = response.data
    }
  } catch (err: any) {
    error.value = 'Erro ao carregar relatório do usuário'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadReport()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
      <h3 class="text-base sm:text-lg font-semibold text-gray-900">Meu Relatório</h3>
      <Button variant="outline" size="sm" @click="loadReport" class="w-full sm:w-auto flex-shrink-0">
        <RotateCcwIcon class="h-4 w-4 mr-2" />
        <span>Atualizar</span>
      </Button>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div
        class="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent">
      </div>
      <p class="mt-2 text-sm text-gray-500">Carregando relatório...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 text-red-700 p-4 rounded-md text-sm">
      {{ error }}
    </div>

    <div v-else-if="report" class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent class="p-3 sm:p-4">
            <div class="flex items-start gap-3 min-h-[60px]">
              <div class="p-2 bg-blue-100 rounded-lg flex-shrink-0 mt-1">
                <TagIcon class="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div class="flex-1 overflow-hidden">
                <p class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">{{ report.totalTasks }}</p>
                <p class="text-xs sm:text-sm text-gray-500 leading-tight break-words">Total de Tarefas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="p-3 sm:p-4">
            <div class="flex items-start gap-3 min-h-[60px]">
              <div class="p-2 bg-green-100 rounded-lg flex-shrink-0 mt-1">
                <CheckCircleIcon class="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
              <div class="flex-1 overflow-hidden">
                <p class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">{{ report.tasksByStatus.COMPLETED }}</p>
                <p class="text-xs sm:text-sm text-gray-500 leading-tight break-words">Tarefas Concluídas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="p-3 sm:p-4">
            <div class="flex items-start gap-3 min-h-[60px]">
              <div class="p-2 bg-yellow-100 rounded-lg flex-shrink-0 mt-1">
                <ClockIcon class="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
              </div>
              <div class="flex-1 overflow-hidden">
                <p class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">{{ report.tasksByStatus.IN_PROGRESS }}</p>
                <p class="text-xs sm:text-sm text-gray-500 leading-tight break-words">Em Progresso</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="p-3 sm:p-4">
            <div class="flex items-start gap-3 min-h-[60px]">
              <div class="p-2 bg-red-100 rounded-lg flex-shrink-0 mt-1">
                <AlertCircleIcon class="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
              </div>
              <div class="flex-1 overflow-hidden">
                <p class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">{{ report.overdueTasks }}</p>
                <p class="text-xs sm:text-sm text-gray-500 leading-tight break-words">Tarefas Atrasadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent class="p-6">
          <h4 class="font-medium text-gray-900 mb-4">Distribuição por Status</h4>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span class="text-sm text-gray-600">A Fazer</span>
              </div>
              <span class="text-sm font-medium">{{ report.tasksByStatus.TODO }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span class="text-sm text-gray-600">Em Progresso</span>
              </div>
              <span class="text-sm font-medium">{{ report.tasksByStatus.IN_PROGRESS }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span class="text-sm text-gray-600">Concluídas</span>
              </div>
              <span class="text-sm font-medium">{{ report.tasksByStatus.COMPLETED }}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card v-if="report.tasksByCategory.length > 0">
        <CardContent class="p-6">
          <h4 class="font-medium text-gray-900 mb-4">Tarefas por Categoria</h4>
          <div class="space-y-3">
            <div v-for="category in report.tasksByCategory" :key="category.categoryId"
              class="flex items-center justify-between">
              <span class="text-sm text-gray-600">{{ category.categoryName }}</span>
              <span class="text-sm font-medium">{{ category.count }}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <h4 class="font-medium text-gray-900 mb-4">Progresso do Mês</h4>
          <div class="flex items-center gap-4">
            <div class="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon class="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p class="text-lg font-semibold text-gray-900">{{ report.completedThisMonth }}</p>
              <p class="text-sm text-gray-500">tarefas concluídas este mês</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
