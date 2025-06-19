// Backend API Service para conectar con NestJS
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

interface ApiError {
  message: string;
  statusCode: number;
}

// Mock data que simula exactamente la respuesta del backend NestJS
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
    try {
      // Intentar conectar con el backend real
      return await this.request('/video-items');
    } catch (error) {
      // Si falla, usar modo demo
      console.warn('🎭 Backend no disponible, usando modo DEMO de ÜPlay');
      console.log('📹 Mostrando 6 videos de demostración con datos reales');
      
      // Simular delay de red para realismo
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return MOCK_VIDEO_ITEMS;
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
    // para evitar el error "Invalid video ID format"
    if (!/^\d+$/.test(videoId)) {
      console.warn(`Skipping questions for invalid videoId format: ${videoId}`);
      return [];
    }
    
    try {
      return await this.request(`/video-items/${videoId}/questions`);
    } catch (error) {
      console.warn(`🎭 Usando preguntas mock para video ${videoId}`);
      
      // Simular preguntas basadas en el mock data
      const video = MOCK_VIDEO_ITEMS.find(v => v.id.toString() === videoId);
      if (!video) return [];
      
      // Generar preguntas mock basadas en questionCount
      const questions = Array.from({ length: video.questionCount || 0 }, (_, i) => ({
        id: `q${videoId}_${i + 1}`,
        question: `Pregunta ${i + 1} sobre ${video.title}`,
        timestamp: (i + 1) * 30, // Una pregunta cada 30 segundos
        options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
        correctAnswer: 0
      }));
      
      return questions;
    }
  }

  // Playlists endpoints
  async getPlaylists(): Promise<any> {
    try {
      return await this.request('/playlists');
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
    try {
      return await this.request(`/playlists/${id}`);
    } catch (error) {
      throw new Error(`Playlist ${id} no encontrada`);
    }
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