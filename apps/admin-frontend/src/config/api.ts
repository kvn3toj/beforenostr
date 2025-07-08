/**
 * 🌌 API Configuration
 * 
 * Configuración centralizada para las llamadas API del Gamifier Admin.
 * Integra con el backend NestJS del AI Cosmic Brain.
 * 
 * Filosofía CoomÜnity:
 * - Bien Común: Configuración centralizada para el equipo
 * - Ayni: Balance entre funcionalidad y simplicidad
 * - Neguentropía: Estructura clara y mantenible
 * - Metanöia: Evolución continua de la configuración
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// ============================================================================
// 🔧 Configuration
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';

// ============================================================================
// 🛠️ Axios Instance
// ============================================================================

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================================
// 🔐 Request Interceptor (Authentication)
// ============================================================================

api.interceptors.request.use(
  (config) => {
    // Agregar token de autenticación si existe
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log de request para debugging (solo en desarrollo)
    if (import.meta.env.MODE === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// ============================================================================
// 📥 Response Interceptor (Error Handling)
// ============================================================================

api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log de response para debugging (solo en desarrollo)
    if (import.meta.env.MODE === 'development') {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }

    return response;
  },
  (error) => {
    // Log de error
    console.error('❌ API Error:', error);

    // Manejo de errores específicos
    if (error.response) {
      // Error de respuesta del servidor
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Token expirado o inválido
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
          break;
        case 403:
          // Sin permisos
          console.warn('⚠️ Access denied - insufficient permissions');
          break;
        case 404:
          // Recurso no encontrado
          console.warn('⚠️ Resource not found');
          break;
        case 500:
          // Error interno del servidor
          console.error('💥 Internal server error');
          break;
        default:
          console.error(`🔥 API Error ${status}:`, data?.message || error.message);
      }
    } else if (error.request) {
      // Error de red
      console.error('🌐 Network error:', error.message);
    } else {
      // Error de configuración
      console.error('⚙️ Config error:', error.message);
    }

    return Promise.reject(error);
  }
);

// ============================================================================
// 🎯 Utility Functions
// ============================================================================

/**
 * Función helper para manejar errores de API de forma consistente
 */
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'Error desconocido';
};

/**
 * Función helper para verificar si el usuario está autenticado
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('auth_token');
};

/**
 * Función helper para obtener headers de autenticación
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ============================================================================
// 🏥 Health Check
// ============================================================================

/**
 * Verificar conectividad con el backend
 */
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health');
    return response.status === 200;
  } catch (error) {
    console.error('❌ API Health Check Failed:', error);
    return false;
  }
};

export default api;
