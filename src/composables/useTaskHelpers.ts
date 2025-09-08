import { CheckCircleIcon, ClockIcon, AlertCircleIcon } from 'lucide-vue-next'
import { TaskPriority, TASK_PRIORITY_OPTIONS, TaskStatus } from '@/enums'
import type { Component } from 'vue'

export const useTaskHelpers = () => {
  const getStatusIcon = (status: string): Component => {
    switch (status) {
      case TaskStatus.COMPLETED: return CheckCircleIcon
      case TaskStatus.IN_PROGRESS: return ClockIcon
      case TaskStatus.TODO: return AlertCircleIcon
      default: return AlertCircleIcon
    }
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case TaskStatus.COMPLETED: return 'text-green-600'
      case TaskStatus.IN_PROGRESS: return 'text-blue-600'
      case TaskStatus.TODO: return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case TaskStatus.TODO: return 'A Fazer'
      case TaskStatus.IN_PROGRESS: return 'Em Progresso'
      case TaskStatus.COMPLETED: return 'Concluído'
      default: return status
    }
  }

  const getPriorityLabel = (priority: TaskPriority | undefined): string => {
    if (!priority) return 'N/A'
    const option = TASK_PRIORITY_OPTIONS.find(p => p.value === priority)
    return option?.label || 'N/A'
  }

  const getPriorityColor = (priority: TaskPriority | undefined): string => {
    if (!priority) return 'bg-gray-500'
    switch (priority) {
      case TaskPriority.HIGH: return 'bg-red-500'
      case TaskPriority.MEDIUM: return 'bg-yellow-500'
      case TaskPriority.LOW: return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  return {
    getStatusIcon,
    getStatusColor,
    getStatusLabel,
    getPriorityLabel,
    getPriorityColor
  }
}