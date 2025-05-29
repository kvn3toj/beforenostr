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
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
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
}

// Exportar una instancia singleton del servicio
export const apiService = new ApiService(); 