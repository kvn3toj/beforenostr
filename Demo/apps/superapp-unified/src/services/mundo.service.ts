/**
 * 🌍 Mundo Service - Gestión de mundos en CoomÜnity
 */

import { apiService } from '../lib/api-service';

// Types
export interface Mundo {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  created_at: string;
  updated_at: string;
  contentCount: number;
  participantCount: number;
  adminIds: string[];
}

export interface MundoCreateData {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive?: boolean;
}

export interface MundoUpdateData {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive?: boolean;
}

// Service functions
export const mundoService = {
  // Get all mundos
  getMundos: async (): Promise<Mundo[]> => {
    try {
      const response = await apiService.get('/mundos');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching mundos:', error);
      return [];
    }
  },

  // Get mundo by ID
  getMundoById: async (id: string): Promise<Mundo | null> => {
    try {
      const response = await apiService.get(`/mundos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching mundo:', error);
      return null;
    }
  },

  // Create mundo
  createMundo: async (data: MundoCreateData): Promise<Mundo | null> => {
    try {
      const response = await apiService.post('/mundos', data);
      return response.data;
    } catch (error) {
      console.error('Error creating mundo:', error);
      return null;
    }
  },

  // Update mundo
  updateMundo: async (id: string, data: MundoUpdateData): Promise<Mundo | null> => {
    try {
      const response = await apiService.put(`/mundos/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating mundo:', error);
      return null;
    }
  },

  // Delete mundo
  deleteMundo: async (id: string): Promise<boolean> => {
    try {
      await apiService.delete(`/mundos/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting mundo:', error);
      return false;
    }
  },

  // Join mundo
  joinMundo: async (id: string): Promise<boolean> => {
    try {
      await apiService.post(`/mundos/${id}/join`);
      return true;
    } catch (error) {
      console.error('Error joining mundo:', error);
      return false;
    }
  },

  // Leave mundo
  leaveMundo: async (id: string): Promise<boolean> => {
    try {
      await apiService.post(`/mundos/${id}/leave`);
      return true;
    } catch (error) {
      console.error('Error leaving mundo:', error);
      return false;
    }
  },
}; 