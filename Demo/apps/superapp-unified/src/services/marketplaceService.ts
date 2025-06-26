import { apiService } from '../lib/api-service';
import {
  mockUsers,
  mockProducts,
  mockMatches,
  mockMessages,
  mockReviews,
} from '../mocks/marketplaceMocks';
import type { Match } from '../types/marketplace';

// Detectar modo mock
const isMockMode = () =>
  import.meta.env.VITE_ENABLE_MOCK_DATA === 'true' ||
  import.meta.env.VITE_MOCK_MODE === 'true' ||
  import.meta.env.VITE_MOCK_MARKETPLACE === 'true';

// Confirmación de entrega/finalización
export const confirmMatch = async (matchId: string, role: 'buyer' | 'seller') => {
  if (isMockMode()) {
    const match = mockMatches.find((m) => m.id === matchId);
    if (!match) throw new Error('Match not found');
    if (role === 'buyer') {
      match.buyerConfirmed = true;
    } else {
      match.sellerConfirmed = true;
    }
    return { ...match };
  }
  return apiService.patch(`/marketplace/match/${matchId}/confirm`, { role });
};

export const getMatch = async (matchId: string): Promise<Match> => {
  if (isMockMode()) {
    const match = mockMatches.find((m) => m.id === matchId);
    if (!match) throw new Error('Match not found');
    return { ...match } as Match;
  }
  return apiService.get(`/marketplace/match/${matchId}`) as Promise<Match>;
};

// Chat transaccional
export const getMatchMessages = async (matchId: string) => {
  if (isMockMode()) {
    const chat = mockMessages.find((c) => c.matchId === matchId);
    return chat ? chat.messages : [];
  }
  return apiService.get(`/marketplace/match/${matchId}/messages`);
};

export const sendMatchMessage = async (matchId: string, content: string, senderId?: string) => {
  if (isMockMode()) {
    const chat = mockMessages.find((c) => c.matchId === matchId);
    if (!chat) throw new Error('Chat not found');
    const sender = mockUsers.find((u) => u.id === senderId) || mockUsers[0];
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: sender.name,
      content,
      timestamp: new Date().toISOString(),
    };
    chat.messages.push(newMsg);
    return newMsg;
  }
  return apiService.post(`/marketplace/match/${matchId}/messages`, { content });
};

// Calificación/reseña
export const submitMatchReview = async (matchId: string, review: any) => {
  if (isMockMode()) {
    const newReview = {
      ...review,
      id: `review-${Date.now()}`,
      matchId,
      createdAt: new Date().toISOString(),
    };
    mockReviews.push(newReview);
    return newReview;
  }
  return apiService.post(`/marketplace/match/${matchId}/review`, review);
};

export const getMatchReview = async (matchId: string) => {
  if (isMockMode()) {
    return mockReviews.find((r) => r.matchId === matchId) || null;
  }
  return apiService.get(`/marketplace/match/${matchId}/review`);
};
