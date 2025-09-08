import { ref } from 'vue'
import { apiService } from '@/services/api'
import type { TaskCollaboration } from '@/types'

export const useCollaborations = () => {
  const loading = ref(false)
  const collaborations = ref<TaskCollaboration[]>([])
  const error = ref('')

  const loadCollaborations = async () => {
    loading.value = true
    error.value = ''
    
    try {
      const response = await apiService.getUserCollaborations()
      if (response?.success) {
        collaborations.value = response.data
      }
    } catch (err) {
      console.error('Erro ao carregar colaborações:', err)
      error.value = 'Erro ao carregar colaborações'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    collaborations,
    error,
    loadCollaborations
  }
}