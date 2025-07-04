import { ENV, EnvironmentHelpers } from '../lib/environment';
import { AUTH_STORAGE_KEYS, AUTH_CONFIG } from '../config/constants';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  statusCode?: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

class ApiService {
  private timeout: number;

  constructor() {
    this.timeout = 30000;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData: any = {};

      // Intentar parsear JSON solo si hay contenido
      try {
        const text = await response.text();
        if (text && text.trim()) {
          errorData = JSON.parse(text);
        }
      } catch (parseError) {
        // Si no se puede parsear el JSON, usar datos por defecto
        console.warn('[ApiService] No se pudo parsear la respuesta de error como JSON:', parseError);
      }

      const error: ApiError = {
        message: errorData.message || `Error ${response.status}: ${response.statusText}`,
        statusCode: response.status,
        error: errorData.error,
      };
      throw error;
    }

    // Para respuestas exitosas, también verificar si hay contenido antes de parsear JSON
    const text = await response.text();
    if (!text || !text.trim()) {
      return {} as T; // Retornar objeto vacío si no hay contenido
    }

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('[ApiService] Error parseando respuesta JSON exitosa:', parseError);
      throw new Error('Respuesta del servidor no es JSON válido');
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error(`[ApiService] Error en GET ${endpoint}:`, error);
      throw error;
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error(`[ApiService] Error en POST ${endpoint}:`, error);
      throw error;
    }
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error(`[ApiService] Error en PUT ${endpoint}:`, error);
      throw error;
    }
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error(`[ApiService] Error en PATCH ${endpoint}:`, error);
      throw error;
    }
  }

  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error(`[ApiService] Error en DELETE ${endpoint}:`, error);
      throw error;
    }
  }

  public clearAuthTokens(): void {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
      localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
      console.log(`${AUTH_CONFIG.LOG_PREFIX} 🧹 Auth tokens cleared from localStorage`);
    } catch (error) {
      console.warn(`${AUTH_CONFIG.LOG_PREFIX} ⚠️ Failed to clear auth tokens:`, error);
    }
  }
}

// Crear una instancia única que no se exporta directamente
const apiServiceInstance = new ApiService();

// Exportar la instancia con un nombre
export { apiServiceInstance as apiService };

// Exportar la API de autenticación
export const authAPI = {
  login: (credentials: any) =>
    apiServiceInstance.post('/auth/login', credentials),
  register: (userData: any) =>
    apiServiceInstance.post('/auth/register', userData),
  logout: () => {
    apiServiceInstance.clearAuthTokens();
    return Promise.resolve();
  },
  refreshToken: (refreshToken: string) =>
    apiServiceInstance.post('/auth/refresh', { refreshToken }),
  getMe: () =>
    apiServiceInstance.get('/auth/me'),
};

// ... (actualizar TODAS las demás: marketplaceAPI, videosAPI, etc. para que usen apiServiceInstance)

export const marketplaceAPI = {
  getItems: (filters?: any) => {
    const params = new URLSearchParams(filters).toString();
    return apiServiceInstance.get(`/marketplace/items?${params}`);
  },
  // ... resto de métodos de marketplaceAPI
  getTrending: (limit = 6) =>
    apiServiceInstance.get(`/marketplace/trending?limit=${limit}`),
};

export const videosAPI = {
  getCategories: () =>
    apiServiceInstance.get('/video-items/categories'),
  getVideos: (category?: string) =>
    apiServiceInstance.get(`/video-items${category ? `?category=${category}` : ''}`),
  // ... resto de métodos de videosAPI
};

// ... y así sucesivamente para statsAPI, formsAPI, mundosAPI, socialAPI

// ELIMINAR COMPLETAMENTE LA EXPORTACIÓN POR DEFECTO
// export default apiService;
