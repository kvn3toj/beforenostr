import { apiService } from './api.service';
import { mockApiService } from '../mocks/mockApiService';

const isMockMode = () => {
  return import.meta.env.VITE_ENABLE_MOCK_DATA === 'true';
};

export interface SocialStats {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalUsers: number;
  activeUsers: number;
}

export interface SocialActivity {
  id: string;
  userId: string;
  type: string;
  content: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
    username: string;
  };
}

export interface SocialInteraction {
  id: string;
  userId: string;
  targetType: string; // 'video', 'playlist', 'comment', etc.
  targetId: string;
  type: string; // 'like', 'share', 'comment', 'view'
  createdAt: string;
}

export const socialService = {
  // Obtener estadísticas sociales generales
  async getSocialStats(): Promise<SocialStats> {
    try {
      return await apiService.get<SocialStats>('/social/stats');
    } catch (error) {
      // Fallback en caso de que el endpoint no exista
      console.warn('Social stats endpoint not available, returning fallback data');
      return {
        totalPosts: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        totalUsers: 0,
        activeUsers: 0
      };
    }
  },

  // Obtener actividad reciente
  async getRecentActivity(): Promise<SocialActivity[]> {
    try {
      return await apiService.get<SocialActivity[]>('/social/activity/recent');
    } catch (error) {
      // Fallback en caso de que el endpoint no exista
      console.warn('Social activity endpoint not available, returning empty array');
      return [];
    }
  },

  // Obtener interacciones sociales
  async getSocialInteractions(limit = 50): Promise<SocialInteraction[]> {
    try {
      return await apiService.get<SocialInteraction[]>(`/social/interactions?limit=${limit}`);
    } catch (error) {
      console.warn('Social interactions endpoint not available, returning empty array');
      return [];
    }
  },

  // Crear una nueva interacción social
  async createSocialInteraction(data: {
    targetType: string;
    targetId: string;
    type: string;
  }): Promise<SocialInteraction> {
    return apiService.post<SocialInteraction>('/social/interactions', data);
  },

  // Obtener estadísticas por usuario
  async getUserSocialStats(userId: string): Promise<{
    totalInteractions: number;
    likesGiven: number;
    likesReceived: number;
    commentsGiven: number;
    sharesGiven: number;
  }> {
    try {
      return await apiService.get(`/social/users/${userId}/stats`);
    } catch (error) {
      console.warn('User social stats endpoint not available, returning fallback data');
      return {
        totalInteractions: 0,
        likesGiven: 0,
        likesReceived: 0,
        commentsGiven: 0,
        sharesGiven: 0
      };
    }
  },

  async getPosts() {
    if (isMockMode()) {
      return mockApiService.getSocialPosts();
    }
    return apiService.get('/social/posts');
  }
};
