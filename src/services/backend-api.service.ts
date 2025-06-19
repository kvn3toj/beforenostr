// Backend API Service para conectar con NestJS
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

interface ApiError {
  message: string;
  statusCode: number;
}

// Mock data que simula exactamente la respuesta del backend NestJS
// Solo se usa como ÚLTIMO RECURSO si el backend no está disponible
const MOCK_VIDEO_ITEMS = [
  {
    id: 7,
    title: 'Introducción a CoomÜnity',
    description: 'Aprende los conceptos básicos de gamificación educativa en nuestra plataforma',
    youtubeId: 'dQw4w9WgXcQ',
    duration: 240,
    questionCount: 3,
    createdAt: '2025-06-19T10:00:00Z'
  },
  {
    id: 8,
    title: 'Sistema de Recompensas Ayni',
    description: 'Descubre cómo funciona nuestro sistema de economía colaborativa',
    youtubeId: 'lV7evRdBTxk',
    duration: 180,
    questionCount: 2,
    createdAt: '2025-06-19T09:00:00Z'
  },
  {
    id: 9,
    title: 'ÜPlay: Videos Interactivos',
    description: 'Cómo usar los videos interactivos con preguntas gamificadas',
    youtubeId: 'hFZFjoX2cGg',
    duration: 300,
    questionCount: 5,
    createdAt: '2025-06-19T08:00:00Z'
  },
  {
    id: 10,
    title: 'Marketplace CoomÜnity',
    description: 'Intercambia productos y servicios usando tokens Ayni',
    youtubeId: '9bZkp7q19f0',
    duration: 360,
    questionCount: 4,
    createdAt: '2025-06-19T07:00:00Z'
  },
  {
    id: 11,
    title: 'Salas de Estudio Colaborativas',
    description: 'Aprende en tiempo real con otros usuarios de la comunidad',
    youtubeId: 'fJ9rUzIMcZQ',
    duration: 420,
    questionCount: 6,
    createdAt: '2025-06-19T06:00:00Z'
  },
  {
    id: 12,
    title: 'Análisis y Métricas de Progreso',
    description: 'Visualiza tu progreso de aprendizaje con dashboards interactivos',
    youtubeId: 'QH2-TGUlwu4',
    duration: 280,
    questionCount: 3,
    createdAt: '2025-06-19T05:00:00Z'
  }
];

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
      console.log(`🔗 API Request: ${endpoint}`);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          message: `HTTP Error: ${response.status} ${response.statusText}`,
          statusCode: response.status,
        }));
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      console.log(`✅ API Success: ${endpoint}`);
      return await response.json();
    } catch (error) {
      console.error(`❌ API Error on ${endpoint}:`, error);
      throw error;
    }
  }

  // Authentication endpoints
  async login(email: string, password: string): Promise<any> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', { method: 'POST' });
    localStorage.removeItem('COOMUNITY_AUTH_TOKEN');
    localStorage.removeItem('COOMUNITY_USER_DATA');
  }

  async getMe(): Promise<any> {
    return this.request('/auth/me');
  }

  // Videos/VideoItems endpoints
  async getVideoItems(): Promise<any[]> {
    try {
      console.log('🎬 Conectando con backend NestJS REAL...');
      
      // Intentar autenticación automática si no hay token
      const token = localStorage.getItem('COOMUNITY_AUTH_TOKEN');
      if (!token) {
        console.log('🔐 No hay token, intentando autenticación automática...');
        try {
          const authResponse = await this.login('admin@gamifier.com', 'admin123');
          localStorage.setItem('COOMUNITY_AUTH_TOKEN', authResponse.access_token);
          localStorage.setItem('COOMUNITY_USER_DATA', JSON.stringify(authResponse.user));
          console.log('✅ Autenticación automática exitosa');
        } catch (authError) {
          console.warn('⚠️ Autenticación automática falló:', authError);
        }
      }

      // Intentar obtener datos reales del backend
      const videos = await this.request<any[]>('/video-items');
      console.log('🎉 Videos obtenidos del backend REAL:', videos.length);
      return videos;
      
    } catch (error) {
      console.warn('⚠️ Backend no disponible, intentando reconexión...');
      
      // Segundo intento con delay
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const videos = await this.request<any[]>('/video-items');
        console.log('🎉 Reconexión exitosa, videos del backend REAL:', videos.length);
        return videos;
      } catch (retryError) {
        // Solo como último recurso usar modo demo
        console.warn('🎭 ÚLTIMO RECURSO: Usando modo demo');
        console.log('📹 Mostrando 6 videos de demostración');
        
        await new Promise(resolve => setTimeout(resolve, 800));
        return MOCK_VIDEO_ITEMS;
      }
    }
  }

  async getVideoItemById(id: string): Promise<any> {
    try {
      return await this.request(`/video-items/${id}`);
    } catch (error) {
      console.warn('🎭 Usando video mock para ID:', id);
      const video = MOCK_VIDEO_ITEMS.find(v => v.id.toString() === id);
      if (!video) throw new Error(`Video ${id} no encontrado`);
      return video;
    }
  }

  async getQuestionsForVideo(videoId: string): Promise<any[]> {
    // Validar que videoId sea un número antes de hacer la petición
    if (!/^\d+$/.test(videoId)) {
      console.warn(`Skipping questions for invalid videoId format: ${videoId}`);
      return [];
    }
    
    try {
      const questions = await this.request<any[]>(`/video-items/${videoId}/questions`);
      console.log(`📝 Preguntas obtenidas del backend REAL para video ${videoId}:`, questions.length);
      return questions;
    } catch (error) {
      console.warn(`🎭 Usando preguntas mock para video ${videoId}`);
      
      // Simular preguntas basadas en el mock data
      const video = MOCK_VIDEO_ITEMS.find(v => v.id.toString() === videoId);
      if (!video) return [];
      
      const questions = Array.from({ length: video.questionCount || 0 }, (_, i) => ({
        id: `q${videoId}_${i + 1}`,
        question: `Pregunta ${i + 1} sobre ${video.title}`,
        timestamp: (i + 1) * 30,
        options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
        correctAnswer: 0
      }));
      
      return questions;
    }
  }

  // Playlists endpoints  
  async getPlaylists(): Promise<any> {
    try {
      const playlists = await this.request('/playlists');
      console.log('📋 Playlists obtenidas del backend REAL');
      return playlists;
    } catch (error) {
      console.warn('🎭 Usando playlists mock');
      return {
        data: [],
        count: 0,
        pagination: { page: 1, limit: 10, totalPages: 0 }
      };
    }
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

  // Users endpoints
  async getUsers(): Promise<any[]> {
    return this.request('/users');
  }

  async getUserById(id: string): Promise<any> {
    return this.request(`/users/${id}`);
  }

  // Marketplace endpoints
  async getMarketplaceItems(): Promise<any[]> {
    return this.request('/marketplace/items');
  }

  async getMarketplaceItemById(id: string): Promise<any> {
    return this.request(`/marketplace/items/${id}`);
  }

  // Social endpoints
  async getSocialPublications(): Promise<any[]> {
    return this.request('/social/publications');
  }

  async createSocialPublication(data: any): Promise<any> {
    return this.request('/social/publications', {
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