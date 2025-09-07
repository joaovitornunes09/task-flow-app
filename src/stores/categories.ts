import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Category } from '@/types'
import apiService from '@/services/api'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<Category[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchCategories = async () => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiService.getCategories()
      if (response?.success) {
        categories.value = response.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch categories'
    } finally {
      isLoading.value = false
    }
  }

  const getCategoryById = async (id: string): Promise<Category | null> => {
    try {
      const response = await apiService.getCategoryById(id)
      if (response?.success) {
        return response.data
      }
      return null
    } catch (err: any) {
      return null
    }
  }

  const createCategory = async (data: Omit<Category, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiService.createCategory(data)
      if (response?.success) {
        const newCategory = response.data
        categories.value.push(newCategory)
        return { success: true, data: newCategory }
      } else {
        throw new Error(response?.message || 'Failed to create category')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create category'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const updateCategory = async (id: string, data: Partial<Category>) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiService.updateCategory(id, data)
      if (response?.success) {
        const updatedCategory = response.data

        const index = categories.value.findIndex(c => c.id === id)
        if (index !== -1) {
          categories.value[index] = updatedCategory
        }
        return { success: true, data: updatedCategory }
      } else {
        throw new Error(response?.message || 'Failed to update category')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update category'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiService.deleteCategory(id)
      if (response?.success) {
        categories.value = categories.value.filter(c => c.id !== id)
      } else {
        throw new Error(response?.message || 'Failed to delete category')
      }

      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete category'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  return {
    categories,
    isLoading,
    error,
    fetchCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
  }
})
