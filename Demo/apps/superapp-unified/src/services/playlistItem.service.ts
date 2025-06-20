/**
 * 📄 Playlist Item Service - Gestión de elementos de playlist
 */

import { apiService } from '../lib/api-service';

// Types
export interface PlaylistItem {
  id: string;
  playlistId: string;
  contentId: string;
  contentType: 'video' | 'article' | 'link';
  order: number;
  title: string;
  description?: string;
  thumbnail?: string;
  duration?: number;
  url?: string;
  created_at: string;
  updated_at: string;
}

export interface PlaylistItemCreateData {
  playlistId: string;
  contentId: string;
  contentType: 'video' | 'article' | 'link';
  order?: number;
}

export interface PlaylistItemUpdateData {
  order?: number;
  title?: string;
  description?: string;
}

// Service functions
export const playlistItemService = {
  // Get items by playlist ID
  getPlaylistItems: async (playlistId: string): Promise<PlaylistItem[]> => {
    try {
      const response = await apiService.get(`/playlists/${playlistId}/items`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching playlist items:', error);
      return [];
    }
  },

  // Get playlist item by ID
  getPlaylistItemById: async (id: string): Promise<PlaylistItem | null> => {
    try {
      const response = await apiService.get(`/playlist-items/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching playlist item:', error);
      return null;
    }
  },

  // Create playlist item
  createPlaylistItem: async (data: PlaylistItemCreateData): Promise<PlaylistItem | null> => {
    try {
      const response = await apiService.post('/playlist-items', data);
      return response.data;
    } catch (error) {
      console.error('Error creating playlist item:', error);
      return null;
    }
  },

  // Update playlist item
  updatePlaylistItem: async (id: string, data: PlaylistItemUpdateData): Promise<PlaylistItem | null> => {
    try {
      const response = await apiService.put(`/playlist-items/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating playlist item:', error);
      return null;
    }
  },

  // Delete playlist item
  deletePlaylistItem: async (id: string): Promise<boolean> => {
    try {
      await apiService.delete(`/playlist-items/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting playlist item:', error);
      return false;
    }
  },

  // Reorder playlist items
  reorderPlaylistItems: async (playlistId: string, itemIds: string[]): Promise<boolean> => {
    try {
      await apiService.put(`/playlists/${playlistId}/reorder`, { itemIds });
      return true;
    } catch (error) {
      console.error('Error reordering playlist items:', error);
      return false;
    }
  },
}; 