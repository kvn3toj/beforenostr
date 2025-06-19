import { apiService } from './api.service';
import type { Challenge } from './challenge.service';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';
const USER_CHALLENGES_ENDPOINT = `${API_BASE_URL}/user-challenges`;

// Types
export type UserChallengeStatus = 'STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'EXPIRED';

export interface UserChallenge {
  id: string;
  userId: string;
  challengeId: string;
  status: UserChallengeStatus;
  progress?: any; // JSON object with progress data
  startedAt: string;
  completedAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  challenge?: Challenge;
}

export interface UpdateUserChallengeDto {
  status?: UserChallengeStatus;
  progress?: any;
}

export interface StartChallengeDto {
  challengeId: string;
}

// User Challenge Service Functions

// Start a new challenge
export const startChallenge = async (challengeId: string): Promise<UserChallenge> => {
  try {
    const response = await apiService.post<UserChallenge>(`${USER_CHALLENGES_ENDPOINT}/start`, { challengeId });
    return response.data;
  } catch (error) {
    console.error(`Error starting challenge ${challengeId}:`, error);
    throw new Error(`Failed to start challenge ${challengeId}`);
  }
};

// Update progress for a user challenge
export const updateChallengeProgress = async (userChallengeId: string, updateData: UpdateUserChallengeDto): Promise<UserChallenge> => {
  try {
    const response = await apiService.patch<UserChallenge>(`${USER_CHALLENGES_ENDPOINT}/${userChallengeId}/progress`, updateData);
    return response.data;
  } catch (error) {
    console.error(`Error updating progress for user challenge ${userChallengeId}:`, error);
    throw new Error(`Failed to update progress for user challenge ${userChallengeId}`);
  }
};

// Mark a user challenge as complete and award rewards
export const completeChallenge = async (userChallengeId: string): Promise<UserChallenge> => {
  try {
    const response = await apiService.post<UserChallenge>(`${USER_CHALLENGES_ENDPOINT}/${userChallengeId}/complete`);
    return response.data;
  } catch (error) {
    console.error(`Error completing user challenge ${userChallengeId}:`, error);
    throw new Error(`Failed to complete user challenge ${userChallengeId}`);
  }
};

// Get all user challenges for the authenticated user
export const fetchMyChallenges = async (): Promise<UserChallenge[]> => {
  try {
    const response = await apiService.get<UserChallenge[]>(`${USER_CHALLENGES_ENDPOINT}/me`);
    return response.data;
  } catch (error) {
    console.error('Error fetching my challenges:', error);
    throw new Error('Failed to fetch my challenges');
  }
};

// Get a specific user challenge instance by ID
export const fetchUserChallengeById = async (userChallengeId: string): Promise<UserChallenge> => {
  try {
    const response = await apiService.get<UserChallenge>(`${USER_CHALLENGES_ENDPOINT}/${userChallengeId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user challenge ${userChallengeId}:`, error);
    throw new Error(`Failed to fetch user challenge ${userChallengeId}`);
  }
};

// Admin Functions

// Get all user challenges (Admin only)
export const fetchAllUserChallengesAdmin = async (status?: UserChallengeStatus): Promise<UserChallenge[]> => {
  try {
    const params = status ? `?status=${status}` : '';
    const response = await apiService.get<UserChallenge[]>(`${USER_CHALLENGES_ENDPOINT}/admin/all${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all user challenges (admin):', error);
    throw new Error('Failed to fetch all user challenges');
  }
};

// Get a specific user challenge instance by ID (Admin only)
export const fetchUserChallengeByIdAdmin = async (userChallengeId: string): Promise<UserChallenge> => {
  try {
    const response = await apiService.get<UserChallenge>(`${USER_CHALLENGES_ENDPOINT}/admin/${userChallengeId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user challenge ${userChallengeId} (admin):`, error);
    throw new Error(`Failed to fetch user challenge ${userChallengeId}`);
  }
};

// Update progress for any user challenge (Admin only)
export const updateChallengeProgressAdmin = async (userChallengeId: string, updateData: UpdateUserChallengeDto): Promise<UserChallenge> => {
  try {
    const response = await apiService.patch<UserChallenge>(`${USER_CHALLENGES_ENDPOINT}/admin/${userChallengeId}/progress`, updateData);
    return response.data;
  } catch (error) {
    console.error(`Error updating progress for user challenge ${userChallengeId} (admin):`, error);
    throw new Error(`Failed to update progress for user challenge ${userChallengeId}`);
  }
};

// Mark any user challenge as complete and award rewards (Admin only)
export const completeChallengeAdmin = async (userChallengeId: string): Promise<UserChallenge> => {
  try {
    const response = await apiService.post<UserChallenge>(`${USER_CHALLENGES_ENDPOINT}/admin/${userChallengeId}/complete`);
    return response.data;
  } catch (error) {
    console.error(`Error completing user challenge ${userChallengeId} (admin):`, error);
    throw new Error(`Failed to complete user challenge ${userChallengeId}`);
  }
}; 