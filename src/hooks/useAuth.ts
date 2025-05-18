import { useAuthStore } from '../store/authStore'
import { useEffect, useState } from 'react'

export const useAuth = () => {
  const { user, session, logout } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulamos un pequeño delay para asegurar que la sesión se ha cargado
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [session])

  return {
    user,
    session,
    logout,
    isAuthenticated: !!session,
    isLoading,
  }
} 