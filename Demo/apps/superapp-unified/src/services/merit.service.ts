import { apiService } from '../../lib/api-service'; // Updated import path

// API_BASE_URL is already handled by apiService.
// Services should use relative paths.
const MERITS_BASE_PATH = '/merits';

import { MeritModel } from '../../types/domain/wallet.model'; // Import MeritModel

// Types
// Local Merit interface is removed, MeritModel will be used.

export interface CreateMeritDto {
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  color?: string;
}

export interface UpdateMeritDto {
  name?: string;
  slug?: string;
  description?: string;
  iconUrl?: string;
  color?: string;
}

// Merit Service Functions
export const fetchMerits = async (): Promise<MeritModel[]> => {
  try {
    const response = await apiService.get<MeritModel[]>(MERITS_BASE_PATH);
    return response;
  } catch (error) {
    console.error('Error fetching merits:', error);
    throw new Error('Failed to fetch merits');
  }
};

export const fetchMeritById = async (id: string): Promise<MeritModel> => {
  try {
    const response = await apiService.get<MeritModel>(`${MERITS_BASE_PATH}/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching merit with id ${id}:`, error);
    throw new Error(`Failed to fetch merit with id ${id}`);
  }
};

export const createMerit = async (meritData: CreateMeritDto): Promise<MeritModel> => {
  try {
    const response = await apiService.post<MeritModel>(MERITS_BASE_PATH, meritData);
    return response;
  } catch (error) {
    console.error('Error creating merit:', error);
    throw new Error('Failed to create merit');
  }
};

export const updateMerit = async (id: string, meritData: UpdateMeritDto): Promise<MeritModel> => {
  try {
    const response = await apiService.patch<MeritModel>(`${MERITS_BASE_PATH}/${id}`, meritData);
    return response;
  } catch (error) {
    console.error(`Error updating merit with id ${id}:`, error);
    throw new Error(`Failed to update merit with id ${id}`);
  }
};

export const deleteMerit = async (id: string): Promise<MeritModel> => {
  try {
    const response = await apiService.delete<MeritModel>(`${MERITS_BASE_PATH}/${id}`);
    return response;
  } catch (error) {
    console.error(`Error deleting merit with id ${id}:`, error);
    throw new Error(`Failed to delete merit with id ${id}`);
  }
}; 