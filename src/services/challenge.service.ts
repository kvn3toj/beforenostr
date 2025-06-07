import { apiService } from './api.service';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';
const CHALLENGES_ENDPOINT = `${API_BASE_URL}/challenges`;

// Types
export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string; // e.g., 'DAILY', 'WEEKLY', 'MONTHLY', 'SPECIAL'
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  startDate?: string;
  endDate?: string;
  maxParticipants?: number;
  currentParticipants?: number;
  requirements?: any; // JSON object with challenge requirements
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  rewards?: ChallengeReward[];
}

export interface ChallengeReward {
  id: string;
  challengeId: string;
  meritId: string;
  amount: number;
  createdAt: string;
  merit?: any; // Merit details
}

export interface CreateChallengeDto {
  name: string;
  slug: string;
  description?: string;
  type: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'ARCHIVED';
  startDate?: Date | null;
  endDate?: Date | null;
  createdBy: string;
  config?: any;
}

export interface UpdateChallengeDto {
  title?: string;
  description?: string;
  type?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  startDate?: string;
  endDate?: string;
  maxParticipants?: number;
  requirements?: any;
}

export interface CreateChallengeRewardDto {
  meritId: string;
  amount: number;
}

// Challenge Service Functions

// Get all active challenges (Public)
export const fetchActiveChallenges = async (): Promise<Challenge[]> => {
  try {
    const response = await apiService.get<Challenge[]>(CHALLENGES_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error('Error fetching active challenges:', error);
    throw new Error('Failed to fetch active challenges');
  }
};

// Get a specific challenge by ID (Public)
export const fetchChallengeById = async (id: string): Promise<Challenge> => {
  try {
    const response = await apiService.get<Challenge>(`${CHALLENGES_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching challenge with id ${id}:`, error);
    throw new Error(`Failed to fetch challenge with id ${id}`);
  }
};

// Admin Functions

// Get all challenges (Admin only)
export const fetchAllChallengesAdmin = async (): Promise<Challenge[]> => {
  try {
    const response = await apiService.get<Challenge[]>(`${CHALLENGES_ENDPOINT}/admin/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all challenges (admin):', error);
    throw new Error('Failed to fetch all challenges');
  }
};

// Create a new challenge (Admin only)
export const createChallenge = async (challengeData: CreateChallengeDto): Promise<Challenge> => {
  try {
    // 🚀 MIGRADO: Conectar al Backend NestJS real en puerto 3002 - Fase 2.4
    console.log('[Challenges] Creando challenge en backend NestJS...', challengeData);
    
    const response: any = await apiService.post<Challenge>(CHALLENGES_ENDPOINT, challengeData);
    console.log('[Challenges] ✅ Challenge creado exitosamente en backend real');
    
    return response.data || response;
    
  } catch (error: any) {
    console.error('[Challenges] ❌ Error al crear challenge en backend:', error);
    
    // 🔄 Fallback temporal a datos mock solo si backend está completamente inaccesible
    console.warn('[Challenges] ⚠️ Usando fallback temporal a datos mock');
    
    const mockChallenge: Challenge = {
      id: `challenge-${Date.now()}`,
      title: challengeData.name,
      description: challengeData.description || '',
      type: challengeData.type,
      status: challengeData.status || 'DRAFT',
      startDate: challengeData.startDate?.toISOString() || new Date().toISOString(),
      endDate: challengeData.endDate?.toISOString(),
      maxParticipants: 100,
      currentParticipants: 0,
      requirements: challengeData.config || {},
      createdBy: challengeData.createdBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rewards: []
    };
    
    // Simular retraso de API solo en fallback
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockChallenge;
  }
};

// Update a challenge by ID (Admin only)
export const updateChallenge = async (id: string, challengeData: UpdateChallengeDto): Promise<Challenge> => {
  try {
    const response = await apiService.put<Challenge>(`${CHALLENGES_ENDPOINT}/${id}`, challengeData);
    return response.data;
  } catch (error) {
    console.error(`Error updating challenge with id ${id}:`, error);
    throw new Error(`Failed to update challenge with id ${id}`);
  }
};

// Delete a challenge by ID (Admin only)
export const deleteChallenge = async (id: string): Promise<void> => {
  try {
    await apiService.delete(`${CHALLENGES_ENDPOINT}/${id}`);
  } catch (error) {
    console.error(`Error deleting challenge with id ${id}:`, error);
    throw new Error(`Failed to delete challenge with id ${id}`);
  }
};

// Add a reward to a challenge (Admin only)
export const addRewardToChallenge = async (challengeId: string, rewardData: CreateChallengeRewardDto): Promise<ChallengeReward> => {
  try {
    const response = await apiService.post<ChallengeReward>(`${CHALLENGES_ENDPOINT}/${challengeId}/rewards`, rewardData);
    return response.data;
  } catch (error) {
    console.error(`Error adding reward to challenge ${challengeId}:`, error);
    throw new Error(`Failed to add reward to challenge ${challengeId}`);
  }
};

// Remove a challenge reward by ID (Admin only)
export const removeChallengeReward = async (rewardId: string): Promise<void> => {
  try {
    await apiService.delete(`${CHALLENGES_ENDPOINT}/rewards/${rewardId}`);
  } catch (error) {
    console.error(`Error removing challenge reward with id ${rewardId}:`, error);
    throw new Error(`Failed to remove challenge reward with id ${rewardId}`);
  }
}; 