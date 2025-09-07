import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { parseISO, isBefore } from 'date-fns'
import type { Task, CreateTaskData, UpdateTaskData, TaskStatus } from '@/types'
import { getErrorMessage } from '@/types'
import { TaskStatus as TaskStatusEnum } from '@/enums'
import apiService from '@/services/api'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const assignedTasks = ref<Task[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const tasksByStatus = computed(() => {
    const grouped = {
      [TaskStatusEnum.TODO]: [] as Task[],
      [TaskStatusEnum.IN_PROGRESS]: [] as Task[],
      [TaskStatusEnum.COMPLETED]: [] as Task[]
    }

    tasks.value.forEach(task => {
      grouped[task.status].push(task)
    })

    return grouped
  })

  const overdueTasks = computed(() => {
    const now = new Date()
    return tasks.value.filter(task =>
      task.dueDate &&
      isBefore(parseISO(task.dueDate), now) &&
      task.status !== TaskStatusEnum.COMPLETED
    )
  })

  const fetchTasks = async () => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiService.getTasks()
      if (response?.success) {
        tasks.value = response.data
      }
    } catch (err) {
      error.value = getErrorMessage(err, "Failed to fetch tasks")
    } finally {
      isLoading.value = false
    }
  }

  const fetchAssignedTasks = async () => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiService.getAssignedTasks()
      if (response?.success) {
        assignedTasks.value = response.data
      }
    } catch (err) {
      error.value = getErrorMessage(err, 'Failed to fetch assigned tasks')
    } finally {
      isLoading.value = false
    }
  }

  const getTaskById = async (id: string): Promise<Task | null> => {
    try {
      const response = await apiService.getTaskById(id)
      if (response?.success && response.data) {
        return response.data
      }
      return null
    } catch (err) {
      error.value = getErrorMessage(err, 'Failed to fetch task')
      return null
    }
  }

  const getTasksByCategory = async (categoryId: string) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiService.getTasksByCategory(categoryId)
      if (response?.success) {
        return response.data
      }
      return []
    } catch (err) {
      error.value = getErrorMessage(err, 'Failed to fetch tasks by category')
      return []
    } finally {
      isLoading.value = false
    }
  }

  const getTasksByStatus = async (status: TaskStatus) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiService.getTasksByStatus(status)
      if (response?.success) {
        return response.data
      }
      return []
    } catch (err) {
      error.value = getErrorMessage(err, 'Failed to fetch tasks by status')
      return []
    } finally {
      isLoading.value = false
    }
  }

  const createTask = async (data: CreateTaskData) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiService.createTask(data)
      if (response?.success) {
        const fullTask = await apiService.getTaskById(response.data.id)
        if (fullTask?.success) {
          tasks.value.push(fullTask.data)
          return { success: true, data: fullTask.data }
        }
        return { success: true, data: response.data }
      } else {
        throw new Error(response?.message || 'Failed to create task')
      }
    } catch (err) {
      error.value = getErrorMessage(err, 'Failed to create task')
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const updateTask = async (id: string, data: UpdateTaskData) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiService.updateTask(id, data)
      if (response?.success) {
        const fullTask = await apiService.getTaskById(id)
        if (fullTask?.success) {
          const updatedTask = fullTask.data

          const index = tasks.value.findIndex(t => t.id === id)
          if (index !== -1) {
            tasks.value[index] = updatedTask
          }

          const assignedIndex = assignedTasks.value.findIndex(t => t.id === id)
          if (assignedIndex !== -1) {
            assignedTasks.value[assignedIndex] = updatedTask
          }
          return { success: true, data: updatedTask }
        }
        return { success: true, data: response.data }
      } else {
        throw new Error(response?.message || 'Failed to update task')
      }
    } catch (err) {
      error.value = getErrorMessage(err, 'Failed to update task')
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const deleteTask = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiService.deleteTask(id)
      if (response?.success) {
        tasks.value = tasks.value.filter(t => t.id !== id)
        assignedTasks.value = assignedTasks.value.filter(t => t.id !== id)
      } else {
        throw new Error(response?.message || 'Failed to delete task')
      }

      return { success: true }
    } catch (err) {
      error.value = getErrorMessage(err, 'Failed to delete task')
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const updateTaskStatus = async (id: string, status: TaskStatus) => {
    return updateTask(id, { status })
  }

  return {
    tasks,
    assignedTasks,
    isLoading,
    error,
    tasksByStatus,
    overdueTasks,
    fetchTasks,
    fetchAssignedTasks,
    getTaskById,
    getTasksByCategory,
    getTasksByStatus,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus
  }
})
