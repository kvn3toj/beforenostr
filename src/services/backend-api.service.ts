// Backend API Service para conectar con NestJS
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

interface ApiError {
  message: string;
  statusCode: number;
}

class BackendApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('COOMUNITY_AUTH_TOKEN');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          message: `HTTP Error: ${response.status} ${response.statusText}`,
          statusCode: response.status,
        }));
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error on ${endpoint}:`, error);
      throw error;
    }
  }

  // Videos/VideoItems endpoints
  async getVideoItems(): Promise<any[]> {
    return this.request('/video-items');
  }

  async getVideoItemById(id: string): Promise<any> {
    return this.request(`/video-items/${id}`);
  }

  async getQuestionsForVideo(videoId: string): Promise<any[]> {
    // Validar que videoId sea un número antes de hacer la petición
    // para evitar el error "Invalid video ID format"
    if (!/^\d+$/.test(videoId)) {
      console.warn(`Skipping questions for invalid videoId format: ${videoId}`);
      return [];
    }
    
    try {
      return this.request(`/video-items/${videoId}/questions`);
    } catch (error) {
      console.warn(`Error fetching questions for video ${videoId}:`, error);
      return [];
    }
  }

  // Playlists endpoints
  async getPlaylists(): Promise<any> {
    return this.request('/playlists');
  }

  async getPlaylistById(id: string): Promise<any> {
    return this.request(`/playlists/${id}`);
  }

  async createPlaylist(data: { name: string; description?: string }): Promise<any> {
    return this.request('/playlists', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Health check
  async healthCheck(): Promise<any> {
    return this.request('/health');
  }
}

export const backendApi = new BackendApiService();