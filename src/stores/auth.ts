import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials, RegisterData } from '@/types'
import apiService from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('auth_token', newToken)
  }

  const clearAuth = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiService.login(credentials)
      if (response?.token) {
        user.value = response.user
        setToken(response.token)
      } else {
        throw new Error(response?.message || 'Login failed')
      }

      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const register = async (data: RegisterData) => {
    try {
      isLoading.value = true
      error.value = null

      const registerResponse = await apiService.register(data)

      if (registerResponse?.success) {
        const loginResult = await login({ email: data.email, password: data.password })
        return loginResult
      } else {
        throw new Error(registerResponse?.message || 'Registration failed')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const fetchProfile = async () => {
    try {
      if (!token.value) return

      isLoading.value = true
      const profile = await apiService.getProfile()
      if (profile) {
        user.value = profile
      }
    } catch (err: any) {
      clearAuth()
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (data: Partial<User & { password?: string }>) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await apiService.updateProfile(data)
      if (response?.success && response.data) {
        user.value = response.data
      }

      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Profile update failed'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      if (token.value) {
        await apiService.logout()
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAuth()
    }
  }

  const initialize = async () => {
    if (token.value) {
      await fetchProfile()
    }
  }

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    updateProfile,
    logout,
    initialize,
    fetchProfile
  }
})
