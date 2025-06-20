/**
 * 📝 Playlist Service - Gestión de playlists
 */

import { apiService } from '../lib/api-service';

// Types
export interface Playlist {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  itemCount: number;
  isPublic: boolean;
  created_at: string;
  updated_at: string;
  authorId: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface PlaylistCreateData {
  title: string;
  description?: string;
  isPublic?: boolean;
}

export interface PlaylistUpdateData {
  title?: string;
  description?: string;
  isPublic?: boolean;
}

// Service functions
export const playlistService = {
  // Get all playlists
  getPlaylists: async (): Promise<Playlist[]> => {
    try {
      const response = await apiService.get('/playlists');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching playlists:', error);
      return [];
    }
  },

  // Get playlist by ID
  getPlaylistById: async (id: string): Promise<Playlist | null> => {
    try {
      const response = await apiService.get(`/playlists/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching playlist:', error);
      return null;
    }
  },

  // Create playlist
  createPlaylist: async (data: PlaylistCreateData): Promise<Playlist | null> => {
    try {
      const response = await apiService.post('/playlists', data);
      return response.data;
    } catch (error) {
      console.error('Error creating playlist:', error);
      return null;
    }
  },

  // Update playlist
  updatePlaylist: async (id: string, data: PlaylistUpdateData): Promise<Playlist | null> => {
    try {
      const response = await apiService.put(`/playlists/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating playlist:', error);
      return null;
    }
  },

  // Delete playlist
  deletePlaylist: async (id: string): Promise<boolean> => {
    try {
      await apiService.delete(`/playlists/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting playlist:', error);
      return false;
    }
  },
}; 