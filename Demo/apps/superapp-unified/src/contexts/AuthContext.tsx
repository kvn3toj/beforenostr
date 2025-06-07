import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../lib/api-service';

// User interface - optimizada para backend NestJS
interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role?: 'user' | 'admin';
  created_at: string;
  // Campos adicionales del backend NestJS
  access_token?: string;
  refresh_token?: string;
}

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

// Configuración del backend NestJS
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';

// 🔄 Función para mapear respuesta del backend al formato User del frontend
const mapBackendUserToFrontend = (backendUser: any, access_token?: string): User => {
  return {
    id: backendUser.id || backendUser.userId,
    email: backendUser.email,
    full_name: backendUser.name || backendUser.full_name || backendUser.displayName,
    avatar_url: backendUser.avatarUrl || backendUser.avatar_url || backendUser.picture,
    role: backendUser.roles?.includes('admin') ? 'admin' : 'user',
    created_at: backendUser.created_at || backendUser.createdAt || new Date().toISOString(),
    access_token: access_token,
    refresh_token: backendUser.refresh_token,
  };
};

// Función para realizar login con backend NestJS
const backendSignIn = async (email: string, password: string): Promise<User> => {
  try {
    const response = await authAPI.login(email, password);
    
    // El backend puede devolver diferentes estructuras, adaptamos
    const userData = response.user || response.data || response;
    const token = response.access_token || response.token || response.accessToken;
    
    if (!userData || !token) {
      throw new Error('Respuesta de login inválida del servidor');
    }
    
    return mapBackendUserToFrontend(userData, token);
  } catch (error: any) {
    console.error('[Auth] Error en login:', error);
    
    // Mejorar mensajes de error para el usuario
    if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
      throw new Error('Credenciales incorrectas. Verifica tu email y contraseña.');
    } else if (error.message?.includes('Network') || error.message?.includes('fetch')) {
      throw new Error('Error de conexión. Verifica que el servidor esté disponible.');
    } else if (error.message?.includes('400')) {
      throw new Error('Datos de login inválidos. Verifica el formato de tu email.');
    }
    
    throw new Error(error.message || 'Error inesperado durante el login');
  }
};

// Función para realizar registro con backend NestJS
const backendSignUp = async (email: string, password: string, fullName?: string): Promise<User> => {
  try {
    const response = await authAPI.register(email, password, fullName);
    
    // El backend puede devolver diferentes estructuras, adaptamos
    const userData = response.user || response.data || response;
    const token = response.access_token || response.token || response.accessToken;
    
    if (!userData || !token) {
      throw new Error('Respuesta de registro inválida del servidor');
    }
    
    return mapBackendUserToFrontend(userData, token);
  } catch (error: any) {
    console.error('[Auth] Error en registro:', error);
    
    // Mejorar mensajes de error para el usuario
    if (error.message?.includes('409') || error.message?.includes('already exists')) {
      throw new Error('Este email ya está registrado. Intenta iniciar sesión.');
    } else if (error.message?.includes('400')) {
      throw new Error('Datos de registro inválidos. Verifica el formato de los campos.');
    } else if (error.message?.includes('Network') || error.message?.includes('fetch')) {
      throw new Error('Error de conexión. Verifica que el servidor esté disponible.');
    }
    
    throw new Error(error.message || 'Error inesperado durante el registro');
  }
};

// Función para verificar si el usuario está autenticado
const checkAuthFromToken = async (): Promise<User | null> => {
  try {
    const savedToken = localStorage.getItem('coomunity_token');
    
    if (!savedToken || savedToken === 'null' || savedToken === 'undefined') {
      return null;
    }

    // Verificar token con el backend NestJS
    const userData = await authAPI.getCurrentUser();
    
    if (!userData) {
      throw new Error('No se pudo obtener información del usuario');
    }
    
    // Mapear datos del usuario del backend
    const user = mapBackendUserToFrontend(userData, savedToken);

    // Actualizar localStorage con datos frescos
    localStorage.setItem('coomunity_user', JSON.stringify(user));

    return user;
  } catch (error: any) {
    console.warn('[Auth] Error verificando token:', error);
    
    // Token inválido o expirado, limpiar localStorage
    localStorage.removeItem('coomunity_user');
    localStorage.removeItem('coomunity_token');
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar autenticación existente al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticatedUser = await checkAuthFromToken();
        setUser(authenticatedUser);
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
      
      // Guardar en localStorage
      try {
        localStorage.setItem('coomunity_user', JSON.stringify(authUser));
        localStorage.setItem('coomunity_token', authUser.access_token || '');
      } catch (error) {
        console.warn('[Auth] Error guardando en localStorage:', error);
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
      
      // Guardar en localStorage
      try {
        localStorage.setItem('coomunity_user', JSON.stringify(newUser));
        localStorage.setItem('coomunity_token', newUser.access_token || '');
      } catch (error) {
        console.warn('[Auth] Error guardando en localStorage:', error);
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
      // Intentar logout en el backend (opcional, no crítico si falla)
      if (user?.access_token) {
        try {
          await authAPI.logout();
        } catch (error) {
          console.warn('[Auth] Error en logout del backend:', error);
          // No lanzar error, continuar con logout local
        }
      }

      // Limpiar estado local
      setUser(null);
      try {
        localStorage.removeItem('coomunity_user');
        localStorage.removeItem('coomunity_token');
      } catch (error) {
        console.warn('[Auth] Error limpiando localStorage:', error);
      }

      // Pequeño delay para UX
      await new Promise(resolve => setTimeout(resolve, 100));
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
      // Actualizar en backend usando authAPI
      const profileData = await authAPI.updateProfile(updates);
      
      // Mapear respuesta del backend y mantener el token actual
      const updatedUser = mapBackendUserToFrontend(profileData, user.access_token);
      
      setUser(updatedUser);
      try {
        localStorage.setItem('coomunity_user', JSON.stringify(updatedUser));
      } catch (error) {
        console.warn('[Auth] Error guardando perfil actualizado:', error);
      }
    } catch (error: any) {
      console.error('[Auth] Error actualizando perfil:', error);
      throw new Error(error.message || 'Error al actualizar perfil');
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 