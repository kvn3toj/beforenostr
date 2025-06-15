import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, apiService } from '../lib/api-service';
import { ENV, EnvironmentHelpers } from '../lib/environment';
import { AUTH_STORAGE_KEYS, AUTH_CONFIG } from '../config/constants';
import {
  checkMockAuthStatus,
  validateMockUser,
  logAuthFlowStep,
} from '../utils/testMockAuth';

// User interface - optimizada para backend NestJS
interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role?: 'user' | 'admin' | 'Super Admin' | 'Content Admin';
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

// 🧪 **MOCK USER PARA DESARROLLO/TESTING - JUGADOR DE COOMUNITY**
const MOCK_AUTHENTICATED_USER: User = {
  id: 'mock-player-id-456',
  email: 'mock-player@coomunity.com',
  full_name: 'Jugador CoomÜnity',
  avatar_url: 'https://i.pravatar.cc/150?u=mock-player',
  role: 'user', // Rol de Jugador (PLAYER en el backend)
  created_at: new Date().toISOString(),
  access_token: 'mock-jwt-token-for-coomunity-player-testing',
  refresh_token: 'mock-refresh-token-for-coomunity-player',
};

// 🔧 **FUNCIÓN PARA VERIFICAR SI EL MOCK ESTÁ HABILITADO**
const isMockAuthEnabled = (): boolean => {
  return EnvironmentHelpers.shouldUseMockAuth();
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
  // 🧪 **MOCK: Si el mock está habilitado, devolver usuario mock**
  if (isMockAuthEnabled()) {
    console.log('[Auth Mock] Mock login habilitado - usando usuario de prueba');
    // Simular delay de red para UX realista
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { ...MOCK_AUTHENTICATED_USER };
  }

  try {
    const response = await authAPI.login({ email, password });

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
  // 🧪 **MOCK: Si el mock está habilitado, devolver usuario mock actualizado**
  if (isMockAuthEnabled()) {
    console.log(
      '[Auth Mock] Mock registro habilitado - usando usuario de prueba'
    );
    // Simular delay de red para UX realista
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      ...MOCK_AUTHENTICATED_USER,
      email: email, // Usar el email proporcionado
      full_name: fullName || MOCK_AUTHENTICATED_USER.full_name,
    };
  }

  try {
    const response = await authAPI.register(email, password, fullName);

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
  // 🧪 **MOCK: Si el mock está habilitado, devolver usuario mock directamente**
  if (isMockAuthEnabled()) {
    console.log(
      `${AUTH_CONFIG.LOG_PREFIX} Mock auth verificación habilitada - auto-autenticando usuario de prueba`
    );
    return { ...MOCK_AUTHENTICATED_USER };
  }

  try {
    const savedToken = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);

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

    // Actualizar localStorage con datos frescos usando claves canónicas
    localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));

    return user;
  } catch (error: any) {
    console.warn(`${AUTH_CONFIG.LOG_PREFIX} Error verificando token:`, error);

    // Token inválido o expirado, limpiar localStorage usando api-service
    apiService.clearAuthTokens();
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
        // 🧪 **VERIFICACIÓN INICIAL DEL MOCK**
        const mockEnabled = checkMockAuthStatus();
        logAuthFlowStep('Starting authentication check', { mockEnabled });

        const authenticatedUser = await checkAuthFromToken();
        setUser(authenticatedUser);

        // 🧪 **VALIDACIÓN DEL USUARIO MOCK**
        if (authenticatedUser && mockEnabled) {
          validateMockUser(authenticatedUser);
        }

        // 🧪 **MOCK: Si hay usuario mock, guardarlo en localStorage para consistencia**
        if (isMockAuthEnabled() && authenticatedUser) {
          try {
            localStorage.setItem(
              AUTH_STORAGE_KEYS.USER,
              JSON.stringify(authenticatedUser)
            );
            localStorage.setItem(
              AUTH_STORAGE_KEYS.TOKEN,
              authenticatedUser.access_token || ''
            );
            logAuthFlowStep('Mock user saved to localStorage');
          } catch (error) {
            console.warn(
              `${AUTH_CONFIG.LOG_PREFIX} Error guardando usuario mock en localStorage:`,
              error
            );
          }
        }

        logAuthFlowStep('Authentication check completed', {
          userAuthenticated: !!authenticatedUser,
          userId: authenticatedUser?.id,
          mockMode: mockEnabled,
        });
      } catch (error) {
        console.error('[Auth] Error en verificación inicial:', error);
        logAuthFlowStep('Authentication check failed', {
          error: error.message,
        });
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
      // 🧪 **MOCK: Si el mock está habilitado, saltear logout del backend**
      if (!isMockAuthEnabled()) {
        // Intentar logout en el backend (opcional, no crítico si falla)
        if (user?.access_token) {
          try {
            await authAPI.logout();
          } catch (error) {
            console.warn('[Auth] Error en logout del backend:', error);
            // No lanzar error, continuar con logout local
          }
        }
      } else {
        console.log('[Auth Mock] Mock logout - saltando llamada al backend');
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
      // 🧪 **MOCK: Si el mock está habilitado, simular actualización local**
      if (isMockAuthEnabled()) {
        console.log(
          '[Auth Mock] Mock update profile - actualizando usuario mock localmente'
        );
        await new Promise((resolve) => setTimeout(resolve, 500));

        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);

        try {
          localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(updatedUser));
        } catch (error) {
          console.warn(
            `${AUTH_CONFIG.LOG_PREFIX} Error guardando perfil actualizado:`,
            error
          );
        }
        return;
      }

      // Actualizar en backend usando authAPI
      const profileData = await authAPI.updateProfile(updates);

      // Mapear respuesta del backend y mantener el token actual
      const updatedUser = mapBackendUserToFrontend(
        profileData,
        user.access_token
      );

      setUser(updatedUser);
      try {
        localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      } catch (error) {
        console.warn(`${AUTH_CONFIG.LOG_PREFIX} Error guardando perfil actualizado:`, error);
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
