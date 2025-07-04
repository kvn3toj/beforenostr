import { useAuthStore } from '../store/authStore'
import { useEffect } from 'react'

export const useAuth = () => {
  const { 
    user, 
    token, 
    isAuthenticated, 
    isLoading,
    login,
    register,
    logout,
    initializeAuth,
    getCurrentUser
  } = useAuthStore()

  // Inicializar autenticación al montar el hook
  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    getCurrentUser,
  }
} 