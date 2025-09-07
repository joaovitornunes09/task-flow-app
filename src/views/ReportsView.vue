<script setup lang="ts">
import { ref } from 'vue'
import { useDateFormat } from '@/composables/useDateFormat'
import AppLayout from '@/components/AppLayout.vue'
import UserReportCard from '@/components/UserReportCard.vue'
import TeamReportModal from '@/components/TeamReportModal.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { apiService } from '@/services/api'
import {
  BarChart3Icon,
  UsersIcon,
  CalendarIcon,
  TrendingUpIcon
} from 'lucide-vue-next'
import { getErrorMessage } from '@/types'
import type { CompletedTasksReport } from '@/types'

const { formatDate } = useDateFormat()

const showTeamReportModal = ref(false)
const loadingPeriodReport = ref(false)
const periodReport = ref<CompletedTasksReport | null>(null)
const periodError = ref('')

const periodForm = ref({
  startDate: '',
  endDate: '',
  userId: ''
})

const generatePeriodReport = async () => {
  if (!periodForm.value.startDate || !periodForm.value.endDate) {
    periodError.value = 'Por favor, selecione as datas de início e fim'
    return
  }

  loadingPeriodReport.value = true
  periodError.value = ''

  try {
    const response = await apiService.getCompletedTasksInPeriod(
      periodForm.value.startDate,
      periodForm.value.endDate,
      periodForm.value.userId || undefined
    )

    if (response?.success) {
      periodReport.value = response.data
    }
  } catch (error) {
    periodError.value = getErrorMessage(error, 'Erro ao gerar relatório de período. Tente novamente.')
  } finally {
    loadingPeriodReport.value = false
  }
}
</script>

<template>
  <AppLayout>
    <div class="space-y-6 sm:space-y-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Relatórios</h1>
          <p class="mt-2 text-gray-600 text-sm sm:text-base">Analise sua produtividade com relatórios detalhados</p>
        </div>

        <div class="flex gap-3">
          <Button @click="showTeamReportModal = true" class="flex-shrink-0">
            <UsersIcon class="h-4 w-4 mr-2" />
            <span class="hidden sm:inline">Relatório da Equipe</span>
            <span class="sm:hidden">Equipe</span>
          </Button>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <div class="w-full">
          <UserReportCard />
        </div>

        <div class="w-full space-y-4 sm:space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center gap-2">
            <CalendarIcon class="h-5 w-5 text-gray-600 flex-shrink-0" />
            <h3 class="text-base sm:text-lg font-semibold text-gray-900">Relatório por Período</h3>
          </div>

          <Card>
            <CardContent class="p-4 sm:p-6">
              <div class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div class="space-y-2">
                    <Label for="startDate" class="text-sm font-medium">Data de Início</Label>
                    <Input
                      id="startDate"
                      type="date"
                      v-model="periodForm.startDate"
                      class="w-full"
                    />
                  </div>

                  <div class="space-y-2">
                    <Label for="endDate" class="text-sm font-medium">Data de Fim</Label>
                    <Input
                      id="endDate"
                      type="date"
                      v-model="periodForm.endDate"
                      class="w-full"
                    />
                  </div>
                </div>

                <div v-if="periodError" class="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                  {{ periodError }}
                </div>

                <Button
                  @click="generatePeriodReport"
                  :disabled="loadingPeriodReport"
                  class="w-full sm:w-auto min-w-[140px]"
                >
                  <TrendingUpIcon class="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{{ loadingPeriodReport ? 'Gerando...' : 'Gerar Relatório' }}</span>
                </Button>

                <div v-if="periodReport" class="pt-4 border-t">
                  <div class="text-center">
                    <div class="p-4 sm:p-6 bg-green-50 rounded-lg">
                      <TrendingUpIcon class="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p class="text-xl sm:text-2xl font-bold text-gray-900">{{ periodReport.completedTasks }}</p>
                      <p class="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                        tarefas concluídas entre {{ formatDate(periodReport.startDate) }}
                        e {{ formatDate(periodReport.endDate) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardContent class="p-4 sm:p-6 lg:p-8">
          <div class="text-center max-w-2xl mx-auto">
            <BarChart3Icon class="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 class="text-base sm:text-lg font-medium text-gray-900 mb-2">Mais Relatórios</h3>
            <p class="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 leading-relaxed px-2">
              Explore diferentes tipos de análises para melhorar sua produtividade
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
              <Button 
                variant="outline" 
                @click="showTeamReportModal = true" 
                class="w-full sm:w-auto min-w-[160px] h-10 sm:h-11"
              >
                <UsersIcon class="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Comparar Equipe</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <TeamReportModal
      v-model:open="showTeamReportModal"
    />
  </AppLayout>
</template>
