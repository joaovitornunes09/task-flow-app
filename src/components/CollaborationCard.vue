<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { CalendarIcon } from 'lucide-vue-next'
import { useDateFormat } from '@/composables/useDateFormat'
import { useTaskHelpers } from '@/composables/useTaskHelpers'
import { useCollaborationHelpers } from '@/composables/useCollaborationHelpers'
import type { TaskCollaboration } from '@/types'

interface Props {
  collaboration: TaskCollaboration
}

defineProps<Props>()

const { formatDate } = useDateFormat()
const { getStatusIcon, getStatusColor, getStatusLabel, getPriorityLabel, getPriorityColor } = useTaskHelpers()
const { getRoleLabel, getRoleBadgeClass } = useCollaborationHelpers()
</script>

<template>
  <Card class="hover:shadow-lg transition-all duration-200">
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
            <div class="w-2 h-2 rounded-full" :class="getPriorityColor(collaboration.task.priority)"></div>
            <span class="font-medium">
              {{ getPriorityLabel(collaboration.task.priority) }}
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
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}
</style>
