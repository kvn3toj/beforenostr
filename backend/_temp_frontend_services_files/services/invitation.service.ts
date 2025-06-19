import { apiService } from './api.service';

export interface CreateGiftCardData {
  inviterId: string;
  invitedName: string;
  invitedEmail: string;
  unitsAmount: number;
  suggestions?: string[];
  templateId?: string;
}

export interface GiftCardResponse {
  id: string;
  token: string;
  inviterId: string;
  invitedName: string;
  invitedEmail: string;
  unitsAmount: number;
  suggestions: string[];
  status: 'SENT' | 'REDEEMED' | 'EXPIRED' | 'CANCELLED';
  createdAt: string;
  expiresAt: string;
  redeemedAt?: string;
}

export interface InvitationStats {
  total: number;
  pending: number;
  redeemed: number;
  expired: number;
  cancelled: number;
  totalUnitsDistributed: number;
  conversionRate: number;
}

export const invitationService = {
  /**
   * Crear una nueva gift card
   */
  createGiftCard: async (data: CreateGiftCardData): Promise<GiftCardResponse> => {
    return apiService.post<GiftCardResponse>('/invitations/gift-cards', data);
  },

  /**
   * Obtener estadísticas de invitaciones
   */
  getInvitationStats: async (
    inviterId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<InvitationStats> => {
    const params = new URLSearchParams();
    if (inviterId) params.append('inviterId', inviterId);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const url = `/invitations/stats${params.toString() ? `?${params.toString()}` : ''}`;
    return apiService.get<InvitationStats>(url);
  },

  /**
   * Obtener gift cards de un usuario
   */
  getUserGiftCards: async (userId: string): Promise<GiftCardResponse[]> => {
    return apiService.get<GiftCardResponse[]>(`/invitations/gift-cards/user/${userId}`);
  },

  /**
   * Cancelar una gift card
   */
  cancelGiftCard: async (giftCardId: string, userId: string): Promise<void> => {
    return apiService.delete(`/invitations/gift-cards/${giftCardId}?userId=${userId}`);
  }
}; 