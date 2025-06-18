import { apiService } from './api.service';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1111';
const MERITS_ENDPOINT = `${API_BASE_URL}/merits`;

// Types
export interface Merit {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

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
export const fetchMerits = async (): Promise<Merit[]> => {
  try {
    const response = await apiService.get<Merit[]>(MERITS_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error('Error fetching merits:', error);
    throw new Error('Failed to fetch merits');
  }
};

export const fetchMeritById = async (id: string): Promise<Merit> => {
  try {
    const response = await apiService.get<Merit>(`${MERITS_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching merit with id ${id}:`, error);
    throw new Error(`Failed to fetch merit with id ${id}`);
  }
};

export const createMerit = async (meritData: CreateMeritDto): Promise<Merit> => {
  try {
    const response = await apiService.post<Merit>(MERITS_ENDPOINT, meritData);
    return response.data;
  } catch (error) {
    console.error('Error creating merit:', error);
    throw new Error('Failed to create merit');
  }
};

export const updateMerit = async (id: string, meritData: UpdateMeritDto): Promise<Merit> => {
  try {
    const response = await apiService.patch<Merit>(`${MERITS_ENDPOINT}/${id}`, meritData);
    return response.data;
  } catch (error) {
    console.error(`Error updating merit with id ${id}:`, error);
    throw new Error(`Failed to update merit with id ${id}`);
  }
};

export const deleteMerit = async (id: string): Promise<Merit> => {
  try {
    const response = await apiService.delete<Merit>(`${MERITS_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting merit with id ${id}:`, error);
    throw new Error(`Failed to delete merit with id ${id}`);
  }
}; 