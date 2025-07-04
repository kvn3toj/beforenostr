import { useAuthStore } from '../store/authStore'
import { useEffect } from 'react'

const isMockAuth = import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true';

export const useAuth = () => {
  if (isMockAuth) {
    // Devuelve un usuario admin simulado
    return {
      user: {
        id: 'mock-admin',
        email: 'admin@gamifier.com',
        roles: ['admin'],
        name: 'Admin Demo',
      },
      token: 'mock-token',
      isAuthenticated: true,
      isLoading: false,
      login: async () => {},
      register: async () => {},
      logout: async () => {},
      getCurrentUser: async () => {},
    };
  }

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