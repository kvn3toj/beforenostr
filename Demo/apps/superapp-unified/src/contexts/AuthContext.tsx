import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, type User, type AuthResponse } from '../services/auth.service';
import { apiService } from '../lib/api-service';
import { AUTH_STORAGE_KEYS, AUTH_CONFIG } from '../config/constants';

// Interfaces para el contexto de autenticación
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 🔄 Función para mapear respuesta del backend al formato User del frontend
const mapBackendUserToFrontend = (
  backendUser: any,
  access_token?: string
): User => {
  return {
    id: backendUser.id || backendUser.userId,
    email: backendUser.email,
    full_name:
      backendUser.name || backendUser.full_name || backendUser.displayName,
    avatar_url:
      backendUser.avatarUrl || backendUser.avatar_url || backendUser.picture,
    role: backendUser.roles?.includes('admin') ? 'admin' : 'user',
    created_at:
      backendUser.created_at ||
      backendUser.createdAt ||
      new Date().toISOString(),
    access_token: access_token,
    refresh_token: backendUser.refresh_token,
  };
};

// Función para realizar login con backend NestJS
const backendSignIn = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const response = await authService.login({ email, password });

    // El backend puede devolver diferentes estructuras, adaptamos
    const userData = response.user || response.data || response;
    const token =
      response.access_token || response.token || response.accessToken;

    if (!userData || !token) {
      throw new Error('Respuesta de login inválida del servidor');
    }

    return mapBackendUserToFrontend(userData, token);
  } catch (error: any) {
    console.error('[Auth] Error en login:', error);

    // Mejorar mensajes de error para el usuario
    if (
      error.message?.includes('401') ||
      error.message?.includes('Unauthorized')
    ) {
      throw new Error(
        'Credenciales incorrectas. Verifica tu email y contraseña.'
      );
    } else if (
      error.message?.includes('Network') ||
      error.message?.includes('fetch')
    ) {
      throw new Error(
        'Error de conexión. Verifica que el servidor esté disponible.'
      );
    } else if (error.message?.includes('400')) {
      throw new Error(
        'Datos de login inválidos. Verifica el formato de tu email.'
      );
    }

    throw new Error(error.message || 'Error inesperado durante el login');
  }
};

// Función para realizar registro con backend NestJS
const backendSignUp = async (
  email: string,
  password: string,
  fullName?: string
): Promise<User> => {
  try {
    const response = await authService.register(email, password, fullName);

    // El backend puede devolver diferentes estructuras, adaptamos
    const userData = response.user || response.data || response;
    const token =
      response.access_token || response.token || response.accessToken;

    if (!userData || !token) {
      throw new Error('Respuesta de registro inválida del servidor');
    }

    return mapBackendUserToFrontend(userData, token);
  } catch (error: any) {
    console.error('[Auth] Error en registro:', error);

    // Mejorar mensajes de error para el usuario
    if (
      error.message?.includes('409') ||
      error.message?.includes('already exists')
    ) {
      throw new Error('Este email ya está registrado. Intenta iniciar sesión.');
    } else if (error.message?.includes('400')) {
      throw new Error(
        'Datos de registro inválidos. Verifica el formato de los campos.'
      );
    } else if (
      error.message?.includes('Network') ||
      error.message?.includes('fetch')
    ) {
      throw new Error(
        'Error de conexión. Verifica que el servidor esté disponible.'
      );
    }

    throw new Error(error.message || 'Error inesperado durante el registro');
  }
};

// Función para verificar si el usuario está autenticado
const checkAuthFromToken = async (): Promise<User | null> => {
  // Verificar si hay token almacenado
  const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
  if (!token) {
    console.log(`${AUTH_CONFIG.LOG_PREFIX} No token found in localStorage`);
    return null;
  }

  try {
    // Verificar token con el backend
    const user = await authService.verifyToken();
    return user;
  } catch (error: any) {
    console.error(`${AUTH_CONFIG.LOG_PREFIX} Token validation failed:`, error);

    // Limpiar token inválido
    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER_DATA);

    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar autenticación existente al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log(`${AUTH_CONFIG.LOG_PREFIX} Starting authentication check`);

        const authenticatedUser = await checkAuthFromToken();
        setUser(authenticatedUser);

        if (authenticatedUser) {
          console.log(`${AUTH_CONFIG.LOG_PREFIX} User authenticated:`, authenticatedUser.email);
        } else {
          console.log(`${AUTH_CONFIG.LOG_PREFIX} No authenticated user found`);
        }
      } catch (error) {
        console.error('[Auth] Error en verificación inicial:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const authUser = await backendSignIn(email, password);

      setUser(authUser);

      // Guardar en localStorage usando las claves canónicas
      try {
        localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(authUser));
        localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, authUser.access_token || '');
        console.log(`${AUTH_CONFIG.LOG_PREFIX} 🔐 Token guardado en localStorage:`, authUser.access_token?.substring(0, 20) + '...');
      } catch (error) {
        console.warn(`${AUTH_CONFIG.LOG_PREFIX} Error guardando en localStorage:`, error);
      }
    } catch (error) {
      // Re-lanzar el error para que el componente lo maneje
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    setLoading(true);
    try {
      const newUser = await backendSignUp(email, password, fullName);

      setUser(newUser);

      // Guardar en localStorage usando las claves canónicas
      try {
        localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(newUser));
        localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, newUser.access_token || '');
      } catch (error) {
        console.warn(`${AUTH_CONFIG.LOG_PREFIX} Error guardando en localStorage:`, error);
      }
    } catch (error) {
      // Re-lanzar el error para que el componente lo maneje
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      // Intentar logout en el backend
      if (user?.access_token) {
        try {
          await authService.logout();
        } catch (error) {
          console.warn('[Auth] Error en logout del backend:', error);
          // No lanzar error, continuar con logout local
        }
      }

      // Limpiar estado local del contexto
      setUser(null);
      
      // Limpiar tokens usando el método del api-service
      apiService.clearAuthTokens();

      // Pequeño delay para UX
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error('[Auth] Error en signOut:', error);
      throw new Error('Error al cerrar sesión');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No hay usuario autenticado');

    setLoading(true);
    try {
      const updatedUser = await authService.updateProfile(updates);
      setUser(updatedUser);

      // Actualizar localStorage
      try {
        localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      } catch (error) {
        console.warn(
          `${AUTH_CONFIG.LOG_PREFIX} Error guardando perfil actualizado:`,
          error
        );
      }
    } catch (error: any) {
      console.error('[Auth] Error en updateProfile:', error);
      throw new Error(
        error.message || 'Error al actualizar el perfil'
      );
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAuthenticated: !!user && !!user.access_token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
