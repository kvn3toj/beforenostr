// UPlay Service - Conexión con Backend NestJS CoomÜnity
import {
  VideoItem,
  UserStats,
  StudyRoom,
  InteractiveQuestion,
  VideoFilters,
  UPlayApiResponse,
  PaginatedResponse,
  ChatMessage,
  Achievement,
  SeasonEvent,
  ShopItem,
  LearningPath,
  VideoPlayerState,
  WebSocketEvent,
  WebSocketEventType
} from '../../types/uplay';

// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';
const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3002';

class UPlayService {
  private wsConnection: WebSocket | null = null;
  private wsListeners: Map<string, Function[]> = new Map();

  // ================================
  // AUTENTICACIÓN Y CONFIGURACIÓN
  // ================================

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('COOMUNITY_AUTH_TOKEN');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  private async apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<UPlayApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error(`UPlay API Error (${endpoint}):`, error);
      return {
        success: false,
        data: null as any,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // ================================
  // GESTIÓN DE VIDEOS
  // ================================

  async getVideos(filters?: VideoFilters, page = 1, limit = 20): Promise<UPlayApiResponse<PaginatedResponse<VideoItem>>> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            queryParams.append(key, value.join(','));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }

    return this.apiRequest<PaginatedResponse<VideoItem>>(`/video-items?${queryParams}`);
  }

  async getVideoById(id: string): Promise<UPlayApiResponse<VideoItem>> {
    return this.apiRequest<VideoItem>(`/video-items/${id}`);
  }

  async getVideoQuestions(videoId: string): Promise<UPlayApiResponse<InteractiveQuestion[]>> {
    return this.apiRequest<InteractiveQuestion[]>(`/video-items/${videoId}/questions`);
  }

  async submitQuestionAnswer(
    questionId: string,
    answers: string[],
    timeSpent: number
  ): Promise<UPlayApiResponse<{ correct: boolean; points: number; explanation: string }>> {
    return this.apiRequest(`/questions/${questionId}/answer`, {
      method: 'POST',
      body: JSON.stringify({ answers, timeSpent }),
    });
  }

  async trackVideoProgress(
    videoId: string,
    currentTime: number,
    totalTime: number,
    completed = false
  ): Promise<UPlayApiResponse<{ success: boolean }>> {
    return this.apiRequest('/analytics/video-progress', {
      method: 'POST',
      body: JSON.stringify({
        videoId,
        currentTime,
        totalTime,
        completed,
        timestamp: new Date().toISOString(),
      }),
    });
  }

  // ================================
  // DASHBOARD Y ESTADÍSTICAS
  // ================================

  async getUserStats(): Promise<UPlayApiResponse<UserStats>> {
    return this.apiRequest<UserStats>('/users/stats');
  }

  async getUserAchievements(): Promise<UPlayApiResponse<Achievement[]>> {
    return this.apiRequest<Achievement[]>('/users/achievements');
  }

  async getLeaderboard(type = 'weekly', limit = 100): Promise<UPlayApiResponse<any[]>> {
    return this.apiRequest(`/users/leaderboard?type=${type}&limit=${limit}`);
  }

  async getLearningPaths(): Promise<UPlayApiResponse<LearningPath[]>> {
    return this.apiRequest<LearningPath[]>('/learning-paths');
  }

  async enrollInLearningPath(pathId: string): Promise<UPlayApiResponse<{ success: boolean }>> {
    return this.apiRequest(`/learning-paths/${pathId}/enroll`, {
      method: 'POST',
    });
  }

  // ================================
  // SALAS DE ESTUDIO COLABORATIVAS
  // ================================

  async getStudyRooms(filters?: {
    category?: string;
    difficulty?: string;
    maxParticipants?: number;
  }): Promise<UPlayApiResponse<StudyRoom[]>> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    return this.apiRequest<StudyRoom[]>(`/study-rooms?${queryParams}`);
  }

  async createStudyRoom(roomData: {
    name: string;
    description: string;
    maxParticipants: number;
    isPrivate: boolean;
    password?: string;
    category: string;
    difficulty: string;
  }): Promise<UPlayApiResponse<StudyRoom>> {
    return this.apiRequest<StudyRoom>('/study-rooms', {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
  }

  async joinStudyRoom(roomId: string, password?: string): Promise<UPlayApiResponse<{ success: boolean }>> {
    return this.apiRequest(`/study-rooms/${roomId}/join`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  }

  async leaveStudyRoom(roomId: string): Promise<UPlayApiResponse<{ success: boolean }>> {
    return this.apiRequest(`/study-rooms/${roomId}/leave`, {
      method: 'POST',
    });
  }

  async getRoomMessages(roomId: string, limit = 50): Promise<UPlayApiResponse<ChatMessage[]>> {
    return this.apiRequest<ChatMessage[]>(`/study-rooms/${roomId}/messages?limit=${limit}`);
  }

  // ================================
  // WEBSOCKET PARA TIEMPO REAL
  // ================================

  connectWebSocket(roomId?: string): void {
    if (this.wsConnection) {
      this.wsConnection.close();
    }

    const token = localStorage.getItem('COOMUNITY_AUTH_TOKEN');
    const wsUrl = roomId 
      ? `${WS_BASE_URL}/study-rooms/${roomId}?token=${token}`
      : `${WS_BASE_URL}/uplay?token=${token}`;

    this.wsConnection = new WebSocket(wsUrl);

    this.wsConnection.onopen = () => {
      console.log('UPlay WebSocket connected');
    };

    this.wsConnection.onmessage = (event) => {
      try {
        const data: WebSocketEvent = JSON.parse(event.data);
        this.notifyListeners(data.type, data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.wsConnection.onclose = () => {
      console.log('UPlay WebSocket disconnected');
      // Reconectar automáticamente después de 3 segundos
      setTimeout(() => {
        if (!this.wsConnection || this.wsConnection.readyState === WebSocket.CLOSED) {
          this.connectWebSocket(roomId);
        }
      }, 3000);
    };

    this.wsConnection.onerror = (error) => {
      console.error('UPlay WebSocket error:', error);
    };
  }

  disconnectWebSocket(): void {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
  }

  onWebSocketEvent(eventType: WebSocketEventType, callback: Function): () => void {
    if (!this.wsListeners.has(eventType)) {
      this.wsListeners.set(eventType, []);
    }
    
    this.wsListeners.get(eventType)!.push(callback);

    // Retornar función para limpiar el listener
    return () => {
      const listeners = this.wsListeners.get(eventType);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  private notifyListeners(eventType: WebSocketEventType, data: WebSocketEvent): void {
    const listeners = this.wsListeners.get(eventType);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  sendWebSocketMessage(type: WebSocketEventType, payload: any): void {
    if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
      const message: WebSocketEvent = {
        type,
        payload,
        timestamp: new Date().toISOString(),
      };
      this.wsConnection.send(JSON.stringify(message));
    }
  }

  // ================================
  // GAMIFICACIÓN Y TIENDA
  // ================================

  async getShopItems(category?: string): Promise<UPlayApiResponse<ShopItem[]>> {
    const queryParams = category ? `?category=${category}` : '';
    return this.apiRequest<ShopItem[]>(`/shop/items${queryParams}`);
  }

  async purchaseShopItem(itemId: string): Promise<UPlayApiResponse<{ success: boolean; item: ShopItem }>> {
    return this.apiRequest(`/shop/items/${itemId}/purchase`, {
      method: 'POST',
    });
  }

  async getUserCurrency(): Promise<UPlayApiResponse<{ meritos: number; ondas: number; cristales: number; energia: number }>> {
    return this.apiRequest('/users/currency');
  }

  // ================================
  // EVENTOS Y TEMPORADAS
  // ================================

  async getActiveEvents(): Promise<UPlayApiResponse<SeasonEvent[]>> {
    return this.apiRequest<SeasonEvent[]>('/events/active');
  }

  async joinEvent(eventId: string): Promise<UPlayApiResponse<{ success: boolean }>> {
    return this.apiRequest(`/events/${eventId}/join`, {
      method: 'POST',
    });
  }

  async getEventLeaderboard(eventId: string): Promise<UPlayApiResponse<any[]>> {
    return this.apiRequest(`/events/${eventId}/leaderboard`);
  }

  // ================================
  // UTILIDADES Y HERRAMIENTAS
  // ================================

  async searchContent(query: string, filters?: VideoFilters): Promise<UPlayApiResponse<VideoItem[]>> {
    const searchParams = new URLSearchParams({
      q: query,
    });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            searchParams.append(key, value.join(','));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });
    }

    return this.apiRequest<VideoItem[]>(`/search/videos?${searchParams}`);
  }

  async getRecommendations(userId?: string): Promise<UPlayApiResponse<VideoItem[]>> {
    const endpoint = userId ? `/recommendations/${userId}` : '/recommendations';
    return this.apiRequest<VideoItem[]>(endpoint);
  }

  async reportContent(contentId: string, reason: string, description?: string): Promise<UPlayApiResponse<{ success: boolean }>> {
    return this.apiRequest('/reports', {
      method: 'POST',
      body: JSON.stringify({
        contentId,
        reason,
        description,
        type: 'video',
      }),
    });
  }

  // ================================
  // FUNCIONALIDADES OFFLINE
  // ================================

  async downloadVideo(videoId: string): Promise<UPlayApiResponse<{ downloadUrl: string; expiresAt: string }>> {
    return this.apiRequest(`/video-items/${videoId}/download`, {
      method: 'POST',
    });
  }

  async getOfflineContent(): Promise<VideoItem[]> {
    // Obtener contenido offline del localStorage o IndexedDB
    const offlineContent = localStorage.getItem('uplay_offline_content');
    return offlineContent ? JSON.parse(offlineContent) : [];
  }

  async saveOfflineContent(videos: VideoItem[]): Promise<void> {
    localStorage.setItem('uplay_offline_content', JSON.stringify(videos));
  }

  // ================================
  // MÉTRICAS Y ANALYTICS
  // ================================

  async trackUserAction(action: string, metadata?: any): Promise<void> {
    // Enviar analytics en background, no esperar respuesta
    this.apiRequest('/analytics/user-action', {
      method: 'POST',
      body: JSON.stringify({
        action,
        metadata,
        timestamp: new Date().toISOString(),
      }),
    }).catch(error => {
      console.warn('Failed to track user action:', error);
    });
  }

  async getVideoAnalytics(videoId: string): Promise<UPlayApiResponse<any>> {
    return this.apiRequest(`/analytics/videos/${videoId}`);
  }

  async getUserAnalytics(timeRange = '7d'): Promise<UPlayApiResponse<any>> {
    return this.apiRequest(`/analytics/users/me?range=${timeRange}`);
  }
}

// Instancia singleton del servicio
export const uplayService = new UPlayService();
export default uplayService;