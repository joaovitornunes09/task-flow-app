<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { apiService } from '@/services/api'
import { useToast } from '@/composables/useToast'
import { useDateFormat } from '@/composables/useDateFormat'
import { formatISO } from 'date-fns'
import AppLayout from '@/components/AppLayout.vue'
import TaskFormModal from '@/components/TaskFormModal.vue'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import {
  CheckSquareIcon,
  ClockIcon,
  CheckCircleIcon,
  PlusIcon,
  CalendarIcon,
  UsersIcon,
  BarChart3Icon,
  SettingsIcon
} from 'lucide-vue-next'
import { TaskStatus, TaskPriority } from '@/enums'
import type { Task } from '@/types'

const authStore = useAuthStore()
const toast = useToast()
const { formatDate, compareDates } = useDateFormat()

const user = computed(() => authStore.user)

const tasks = ref<Task[]>([])
const loading = ref(false)
const showTaskForm = ref(false)

const totalTasks = computed(() => tasks.value.length)
const inProgressTasks = computed(() => tasks.value.filter(t => t.status === TaskStatus.IN_PROGRESS).length)
const completedTasks = computed(() => tasks.value.filter(t => t.status === TaskStatus.COMPLETED).length)
const pendingTasks = computed(() => tasks.value.filter(t => t.status === TaskStatus.TODO).length)

const productivity = computed(() => {
  if (totalTasks.value === 0) return 0
  return Math.round((completedTasks.value / totalTasks.value) * 100)
})

const recentTasks = computed(() =>
  tasks.value
    .slice()
    .sort((a, b) => -compareDates(a.updatedAt || a.createdAt, b.updatedAt || b.createdAt))
    .slice(0, 5)
    .map(task => ({
      ...task,
      categoryName: task.category?.name || 'Sem categoria',
      assignedUserName: task.assignedUser?.name || 'Não atribuído',
      formattedDueDate: formatDate(task.dueDate),
      status: task.status.toLowerCase(),
      priority: task.priority.toLowerCase()
    }))
)

const loadDashboardData = async () => {
  loading.value = true
  try {
    const response = await apiService.getTasks()
    if (response?.success) {
      tasks.value = response.data
    }
  } catch (error) {
    toast.info('Modo offline ativo', 'Usando dados de demonstração enquanto o servidor não está disponível')
    tasks.value = [
      {
        id: '1',
        title: 'Finalizar relatório mensal',
        description: 'Finalizar o relatório mensal da equipe',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        dueDate: formatISO(new Date(Date.now() + 86400000)),
        categoryId: 'cat1',
        assignedUserId: 'user1',
        createdById: 'user1',
        createdAt: formatISO(new Date()),
        updatedAt: formatISO(new Date()),
        category: {
          id: 'cat1',
          name: 'Trabalho',
          description: 'Trabalho',
          color: '#3B82F6',
          userId: 'user1',
          createdAt: formatISO(new Date()),
          updatedAt: formatISO(new Date())
        },
        assignedUser: {
          id: 'user1',
          name: 'João Silva',
          email: 'joao@example.com'
        },
        createdBy: {
          id: 'user1',
          name: 'João Silva',
          email: 'joao@example.com'
        }
      },
      {
        id: '2',
        title: 'Revisar apresentação do cliente',
        description: 'Revisar slides da apresentação',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: formatISO(new Date(Date.now() + 172800000)),
        categoryId: 'cat1',
        assignedUserId: 'user1',
        createdById: 'user1',
        createdAt: formatISO(new Date()),
        updatedAt: formatISO(new Date()),
        category: {
          id: 'cat1',
          name: 'Trabalho',
          description: 'Trabalho',
          color: '#3B82F6',
          userId: 'user1',
          createdAt: formatISO(new Date()),
          updatedAt: formatISO(new Date())
        },
        assignedUser: {
          id: 'user1',
          name: 'Maria Santos',
          email: 'maria@example.com'
        },
        createdBy: {
          id: 'user1',
          name: 'João Silva',
          email: 'joao@example.com'
        }
      },
      {
        id: '3',
        title: 'Reunião de equipe',
        description: 'Reunião semanal da equipe',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.LOW,
        dueDate: formatISO(new Date(Date.now() - 86400000)),
        categoryId: 'cat2',
        assignedUserId: 'user1',
        createdById: 'user1',
        createdAt: formatISO(new Date()),
        updatedAt: formatISO(new Date()),
        category: {
          id: 'cat2',
          name: 'Reuniões',
          description: 'Reuniões',
          color: '#10B981',
          userId: 'user1',
          createdAt: formatISO(new Date()),
          updatedAt: formatISO(new Date())
        },
        assignedUser: {
          id: 'user1',
          name: 'Carlos Oliveira',
          email: 'carlos@example.com'
        },
        createdBy: {
          id: 'user1',
          name: 'João Silva',
          email: 'joao@example.com'
        }
      }
    ]
  } finally {
    loading.value = false
  }
}

const handleTaskSaved = () => {
  showTaskForm.value = false
  loadDashboardData()
}

onMounted(async () => {
  await loadDashboardData()
})
</script>

<template>
  <AppLayout>
    <div class="space-y-8">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
            Olá, {{ user?.name }}! 👋
          </h1>
        </div>
        <div class="flex space-x-3">
          <Button variant="outline" size="sm" class="flex-shrink-0" @click="showTaskForm = true">
            <PlusIcon class="h-4 w-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card class="bg-gradient-primary text-white border-0 shadow-primary">
          <CardContent class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-white/80 text-sm font-medium">Total de Tarefas</p>
                <p class="text-3xl font-bold text-white">{{ totalTasks }}</p>
                <p class="text-white/60 text-xs mt-1">Todas as suas tarefas</p>
              </div>
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <CheckSquareIcon class="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="bg-gradient-secondary text-white border-0 shadow-secondary">
          <CardContent class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-white/80 text-sm font-medium">Em Progresso</p>
                <p class="text-3xl font-bold text-white">{{ inProgressTasks }}</p>
                <p class="text-white/60 text-xs mt-1">Trabalhando atualmente</p>
              </div>
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <ClockIcon class="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="bg-green-500 text-white border-0 shadow-lg shadow-green-500/20">
          <CardContent class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-white/80 text-sm font-medium">Concluídas</p>
                <p class="text-3xl font-bold text-white">{{ completedTasks }}</p>
                <p class="text-white/60 text-xs mt-1">Finalizadas hoje</p>
              </div>
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <CheckCircleIcon class="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="bg-amber-500 text-white border-0 shadow-lg shadow-amber-500/20">
          <CardContent class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-white/80 text-sm font-medium">Pendentes</p>
                <p class="text-3xl font-bold text-white">{{ pendingTasks }}</p>
                <p class="text-white/60 text-xs mt-1">Aguardando início</p>
              </div>
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <CalendarIcon class="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div class="lg:col-span-2 order-2 lg:order-1">
          <Card>
            <CardHeader class="pb-4">
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold text-gray-900">Tarefas Recentes</h2>
                <Button variant="outline" size="sm" @click="$router.push('/tasks')">Ver Todas</Button>
              </div>
            </CardHeader>
            <CardContent class="p-0">
              <div class="divide-y divide-gray-100">
                <div v-for="task in recentTasks" :key="task.id"
                  class="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  @click="$router.push(`/tasks/${task.id}`)">
                  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <div class="flex items-center space-x-3">
                      <div class="w-3 h-3 rounded-full flex-shrink-0"
                        :class="task.priority.toLowerCase() === TaskPriority.HIGH.toLowerCase() ? 'bg-red-500' : task.priority.toLowerCase() === TaskPriority.MEDIUM.toLowerCase() ? 'bg-yellow-500' : 'bg-green-500'">
                      </div>
                      <div class="min-w-0 flex-1">
                        <p class="font-medium text-gray-900 truncate">{{ task.title }}</p>
                        <p class="text-sm text-gray-500 truncate">{{ task.categoryName }}</p>
                      </div>
                    </div>
                    <div class="self-end sm:self-auto">
                      <p class="text-xs font-medium px-2 py-1 rounded-full inline-block" :class="task.status.toLowerCase() === TaskStatus.COMPLETED.toLowerCase() ? 'bg-green-100 text-green-700' :
                        task.status.toLowerCase() === TaskStatus.IN_PROGRESS.toLowerCase() ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-600'">
                        {{ task.status.toLowerCase() === TaskStatus.COMPLETED.toLowerCase() ? 'Concluída' :
                          task.status.toLowerCase() === TaskStatus.IN_PROGRESS.toLowerCase() ? 'Em Progresso' : 'Pendente' }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div class="order-1 lg:order-2">
          <Card>
            <CardHeader class="pb-4">
              <h2 class="text-xl font-semibold text-gray-900">Ações Rápidas</h2>
            </CardHeader>
            <CardContent class="space-y-3">
              <Button class="w-full justify-start h-12" variant="outline" @click="showTaskForm = true">
                <PlusIcon class="h-5 w-5 mr-3" />
                Criar Nova Tarefa
              </Button>
              <Button class="w-full justify-start h-12" variant="outline" @click="$router.push('/collaborations')">
                <UsersIcon class="h-5 w-5 mr-3" />
                Ver Colaborações
              </Button>
              <Button class="w-full justify-start h-12" variant="outline" @click="$router.push('/reports')">
                <BarChart3Icon class="h-5 w-5 mr-3" />
                Ver Relatórios
              </Button>
              <Button class="w-full justify-start h-12" variant="outline" @click="$router.push('/profile')">
                <SettingsIcon class="h-5 w-5 mr-3" />
                Perfil
              </Button>
            </CardContent>
          </Card>

          <Card class="mt-6">
            <CardHeader class="pb-4">
              <h2 class="text-lg font-semibold text-gray-900">Progresso da Semana</h2>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div>
                  <div class="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Tarefas Concluídas</span>
                    <span>{{ completedTasks }}/{{ totalTasks }}</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                      :style="{ width: `${(completedTasks / totalTasks) * 100}%` }"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Produtividade</span>
                    <span>{{ productivity }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-gradient-secondary h-2 rounded-full transition-all duration-500"
                      :style="{ width: `${productivity}%` }"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    <!-- Task Form Modal -->
    <TaskFormModal
      v-model:open="showTaskForm"
      mode="create"
      @task-saved="handleTaskSaved"
    />
  </AppLayout>
</template>
