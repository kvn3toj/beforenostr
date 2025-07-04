import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, type User, type AuthResponse } from '../services/auth.service';
import { apiService } from '../lib/api-service';
import { AUTH_STORAGE_KEYS, AUTH_CONFIG } from '../config/constants';

// Comprobar si el modo mock está activado
const IS_MOCK_MODE = import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true';

// Interfaces para el contexto de autenticación
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<User>;
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
  accessToken?: string
): User => {
  const userRoles = backendUser.roles || (backendUser.role ? [backendUser.role] : ['user']);

  return {
    id: backendUser.id || backendUser.userId,
    email: backendUser.email,
    fullName:
      backendUser.fullName || backendUser.name || backendUser.full_name || backendUser.displayName,
    avatarUrl:
      backendUser.avatarUrl || backendUser.avatar_url || backendUser.picture,
    roles: userRoles,
    createdAt:
      backendUser.createdAt ||
      backendUser.created_at ||
      new Date().toISOString(),
    accessToken,
    refreshToken: backendUser.refreshToken || backendUser.refresh_token,
  };
};

// Función para realizar login con backend NestJS
const backendSignIn = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    console.log(`${AUTH_CONFIG.LOG_PREFIX} 🔐 Attempting login:`, { email });

    // 🌐 NETWORK DIAGNOSTICS: Log current environment details
    const currentHost = window.location.hostname;
    const isNetworkAccess = currentHost !== 'localhost' && currentHost !== '127.0.0.1';
    const apiUrl = isNetworkAccess
      ? `http://${currentHost}:3002`
      : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002');

    console.log(`${AUTH_CONFIG.LOG_PREFIX} 🌐 Environment:`, {
      currentHost,
      isNetworkAccess,
      apiUrl,
      origin: window.location.origin,
      href: window.location.href
    });

    const response = await authService.login({ email, password });
    console.log(`${AUTH_CONFIG.LOG_PREFIX} ✅ Login response received:`, {
      hasUser: !!response.user,
      hasData: !!response.data,
      hasToken: !!(response.access_token || response.token || response.accessToken),
      responseKeys: Object.keys(response)
    });

    // El backend puede devolver diferentes estructuras, adaptamos
    const userData = response.user || (response.data && response.data.user) || response;
    const token =
      response.access_token || response.token || response.accessToken;

    if (!userData || !token) {
      console.error(`${AUTH_CONFIG.LOG_PREFIX} ❌ Invalid response structure:`, response);
      throw new Error('Respuesta de login inválida del servidor');
    }

    console.log(`${AUTH_CONFIG.LOG_PREFIX} 🎉 Login successful for:`, userData.email);
    return mapBackendUserToFrontend(userData, token);
  } catch (error: any) {
    console.error(`${AUTH_CONFIG.LOG_PREFIX} ❌ Login error:`, error);

    // 🔍 ENHANCED ERROR DIAGNOSTICS
    const errorDetails = {
      message: error.message,
      name: error.name,
      stack: error.stack,
      cause: error.cause,
      response: error.response,
      status: error.status,
      config: error.config,
      timestamp: new Date().toISOString(),
      environment: {
        hostname: window.location.hostname,
        origin: window.location.origin,
        userAgent: navigator.userAgent
      }
    };

    console.group(`${AUTH_CONFIG.LOG_PREFIX} 🚨 DETAILED ERROR ANALYSIS`);
    console.error('Full Error Details:', errorDetails);
    console.groupEnd();

    // Categorizar errores para mejor manejo en UI
    let errorCategory = 'unknown';
    let enhancedMessage = error.message || 'Error desconocido';

    // Network/Connection errors
    if (
      error.name === 'TypeError' &&
      (error.message?.includes('fetch') || error.message?.includes('Failed to fetch'))
    ) {
      errorCategory = 'network';
      enhancedMessage = `Error de conexión: No se puede conectar al servidor en ${window.location.hostname}:3002. Verifica que el backend esté ejecutándose.`;
    } else if (error.message?.includes('CORS')) {
      errorCategory = 'cors';
      enhancedMessage = 'Error CORS: El servidor no permite conexiones desde este origen.';
    } else if (error.name === 'AbortError' || error.message?.includes('timeout')) {
      errorCategory = 'timeout';
      enhancedMessage = 'Timeout: El servidor tardó demasiado en responder.';
    }
    // Authentication errors
    else if (
      error.message?.includes('Credenciales incorrectas') ||
      error.message?.includes('401') ||
      error.status === 401
    ) {
      errorCategory = 'auth';
      enhancedMessage = 'Credenciales incorrectas: Email o contraseña inválidos.';
    } else if (error.message?.includes('400') || error.status === 400) {
      errorCategory = 'validation';
      enhancedMessage = 'Datos inválidos: Verifica el formato del email y contraseña.';
    } else if (error.message?.includes('500') || error.status === 500) {
      errorCategory = 'server';
      enhancedMessage = 'Error del servidor: Problema interno del backend.';
    }

    // Create enhanced error with debugging info
    const enhancedError = new Error(enhancedMessage);
    (enhancedError as any).category = errorCategory;
    (enhancedError as any).originalError = error;
    (enhancedError as any).diagnostics = errorDetails;

    // Recalcular isNetworkAccess para el objeto troubleshooting
    const currentHost = window.location.hostname;
    const isNetworkAccessForTroubleshooting = currentHost !== 'localhost' && currentHost !== '127.0.0.1';

    (enhancedError as any).troubleshooting = {
      category: errorCategory,
      suggestions: getSuggestionsByCategory(errorCategory),
      apiUrl: isNetworkAccessForTroubleshooting
        ? `http://${window.location.hostname}:3002`
        : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002')
    };

    throw enhancedError;
  }
};

// Helper function to provide troubleshooting suggestions
const getSuggestionsByCategory = (category: string): string[] => {
  switch (category) {
    case 'network':
      return [
        'Verifica que el backend esté ejecutándose en puerto 3002',
        'Confirma que no hay firewall bloqueando las conexiones',
        'Prueba acceder directamente a la URL del backend en el navegador',
        'Verifica la conectividad de red entre dispositivos'
      ];
    case 'cors':
      return [
        'Verifica la configuración CORS del backend',
        'Confirma que el origen está permitido en el backend',
        'Revisa los headers de las peticiones'
      ];
    case 'timeout':
      return [
        'Verifica la velocidad de la conexión de red',
        'Confirma que el servidor no esté sobrecargado',
        'Intenta nuevamente en unos momentos'
      ];
    case 'auth':
      return [
        'Verifica que las credenciales sean correctas',
        'Confirma que el usuario existe en la base de datos',
        'Prueba con las credenciales por defecto: admin@gamifier.com / admin123'
      ];
    default:
      return [
        'Revisa la consola del navegador para más detalles',
        'Verifica el estado del backend',
        'Intenta refrescar la página'
      ];
  }
};

// Función para realizar registro con backend NestJS
const backendSignUp = async (
  email: string,
  password: string,
  fullName?: string
): Promise<User> => {
  try {
    const response = await authService.register({ email, password, name: fullName });

    // El backend puede devolver diferentes estructuras, adaptamos
    const userData = response.user || (response.data && response.data.user) || response;
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

    throw error;
  }
};

const checkAuthFromToken = async (): Promise<User | null> => {
  const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
  const storedUserStr = localStorage.getItem(AUTH_STORAGE_KEYS.USER);

  if (!token || !storedUserStr) {
    return null;
  }

  try {
    const storedUser = JSON.parse(storedUserStr);

    // Aquí podrías añadir una validación real del token contra el backend si fuera necesario
    // Por ahora, confiamos en que si hay token y usuario, la sesión es válida.

    console.log('[Auth] Restoring session for user:', storedUser.email);
    return storedUser;
  } catch {
    // Si hay cualquier error (token inválido, JSON malformado, etc.), limpiar y devolver null
    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
          const userFromToken = await checkAuthFromToken();
          setUser(userFromToken);
          if (userFromToken) {
            console.log(`${AUTH_CONFIG.LOG_PREFIX} User authenticated:`, userFromToken.email);
          } else {
            console.log(`${AUTH_CONFIG.LOG_PREFIX} No authenticated user found`);
          }
      } catch {
        // Cualquier error durante la comprobación inicial resulta en un estado no autenticado.
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const authenticatedUser = await backendSignIn(email, password);
      setUser(authenticatedUser);
      authService.saveAuthData({ user: authenticatedUser, accessToken: authenticatedUser.accessToken });
    } catch (error) {
      console.error('[Auth] signIn failed:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const newUser = await backendSignUp(email, password, fullName);
      setUser(newUser);
      authService.saveAuthData({ user: newUser, accessToken: newUser.accessToken });
    } catch (error) {
      console.error('[Auth] signUp failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (!IS_MOCK_MODE) {
        await authService.logout();
      }
      setUser(null);
    } catch (error) {
      console.error('[Auth] signOut failed:', error);
      // Incluso si el logout de la API falla, limpiamos el estado local
      setUser(null);
      authService.logout(); // Llama al método que limpia localStorage
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<User> => {
    if (!user) {
      throw new Error('Cannot update profile, no user is signed in.');
    }
    try {
      const updatedUser = await authService.updateProfile(updates);
      setUser(updatedUser);
      authService.saveAuthData({ user: updatedUser, accessToken: updatedUser.accessToken });
      return updatedUser;
    } catch (error) {
      console.error('[Auth] updateProfile failed:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
