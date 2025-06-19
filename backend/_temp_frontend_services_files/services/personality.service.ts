import { apiService } from './api.service';

// Interfaces para personalidades
export interface Personality {
  id: string;
  name: string;
  description?: string;
  traits: string; // JSON string de características
  createdAt: string;
}

export interface PersonalityStats {
  totalPersonalities: number;
  totalUsersWithPersonality: number;
  personalitiesWithUserCount: Array<{
    id: string;
    name: string;
    _count: {
      users: number;
    };
  }>;
}

export interface AssignPersonalityData {
  userId: string;
  personalityId: string;
}

// Funciones del servicio de personalidades
export const fetchPersonalities = async (): Promise<Personality[]> => {
  try {
    return await apiService.get<Personality[]>('/personality');
  } catch (error) {
    console.error('Error fetching personalities:', error);
    throw error;
  }
};

export const fetchPersonalityById = async (id: string): Promise<Personality> => {
  try {
    return await apiService.get<Personality>(`/personality/${id}`);
  } catch (error) {
    console.error(`Error fetching personality ${id}:`, error);
    throw error;
  }
};

export const fetchPersonalityStats = async (): Promise<PersonalityStats> => {
  try {
    return await apiService.get<PersonalityStats>('/personality/stats');
  } catch (error) {
    console.error('Error fetching personality stats:', error);
    throw error;
  }
};

export const assignPersonalityToUser = async (data: AssignPersonalityData): Promise<void> => {
  try {
    await apiService.post<void>('/personality/assign', data);
  } catch (error) {
    console.error('Error assigning personality to user:', error);
    throw error;
  }
};

export const removePersonalityFromUser = async (userId: string): Promise<void> => {
  try {
    await apiService.delete<void>(`/personality/user/${userId}`);
  } catch (error) {
    console.error(`Error removing personality from user ${userId}:`, error);
    throw error;
  }
};

export const fetchUsersByPersonality = async (personalityId: string): Promise<any[]> => {
  try {
    return await apiService.get<any[]>(`/personality/${personalityId}/users`);
  } catch (error) {
    console.error(`Error fetching users by personality ${personalityId}:`, error);
    throw error;
  }
};

// Export del objeto personalityService para compatibilidad
export const personalityService = {
  fetchPersonalities,
  fetchPersonalityById,
  fetchPersonalityStats,
  assignPersonalityToUser,
  removePersonalityFromUser,
  fetchUsersByPersonality,
  // Alias para compatibilidad
  getAllPersonalities: fetchPersonalities,
  getPersonalityStats: fetchPersonalityStats,
  assignToUser: assignPersonalityToUser,
  removeFromUser: removePersonalityFromUser
}; 