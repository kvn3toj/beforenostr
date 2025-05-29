import { apiService } from './api.service';
import { PlaylistItem } from '../types/playlistItem.types';
import { fetchContentItemsByPlaylist, fetchContentItemById } from './contentItem.service';

// ===== PLAYLIST ITEMS =====

export const fetchPlaylistItems = async (playlistId: string): Promise<PlaylistItem[]> => {
  try {
    // Usar el nuevo servicio de content items
    const contentItems = await fetchContentItemsByPlaylist(playlistId);
    
    // Convertir content items al formato de playlist items para compatibilidad
    return contentItems.map(item => ({
      id: item.id,
      playlist_id: item.playlistId,
      item_type: item.itemTypeId, // Usar itemTypeId como item_type
      content: item.content,
      order_index: item.order || 0,
      created_at: item.createdAt,
      updated_at: item.updatedAt,
      title: item.title,
      description: item.description,
    }));
  } catch (error) {
    console.error('[PlaylistItems] Error fetching playlist items:', error);
    throw error;
  }
};

export const createPlaylistItem = async (itemData: any): Promise<PlaylistItem> => {
  try {
    // Usar el endpoint de content items para crear
    const response = await apiService.post('/content/playlists/' + itemData.playlist_id + '/items', {
      title: itemData.title,
      description: itemData.description,
      playlistId: itemData.playlist_id,
      itemTypeId: itemData.item_type,
      content: itemData.content,
      order: itemData.order_index,
      isActive: true,
    });
    
    // Convertir la respuesta al formato de playlist item
    return {
      id: response.id,
      playlist_id: response.playlistId,
      item_type: response.itemTypeId,
      content: response.content,
      order_index: response.order || 0,
      created_at: response.createdAt,
      updated_at: response.updatedAt,
      title: response.title,
      description: response.description,
    };
  } catch (error) {
    console.error('[PlaylistItems] Error creating playlist item:', error);
    throw error;
  }
};

export const updatePlaylistItem = async (id: string, itemData: any): Promise<PlaylistItem> => {
  try {
    const response = await apiService.put(`/content/items/${id}`, {
      title: itemData.title,
      description: itemData.description,
      content: itemData.content,
      order: itemData.order_index,
      isActive: itemData.isActive,
    });
    
    // Convertir la respuesta al formato de playlist item
    return {
      id: response.id,
      playlist_id: response.playlistId,
      item_type: response.itemTypeId,
      content: response.content,
      order_index: response.order || 0,
      created_at: response.createdAt,
      updated_at: response.updatedAt,
      title: response.title,
      description: response.description,
    };
  } catch (error) {
    console.error('[PlaylistItems] Error updating playlist item:', error);
    throw error;
  }
};

export const deletePlaylistItem = async (id: string): Promise<void> => {
  try {
    await apiService.delete(`/content/items/${id}`);
  } catch (error) {
    console.error('[PlaylistItems] Error deleting playlist item:', error);
    throw error;
  }
};

export const fetchPlaylistItemById = async (itemId: string): Promise<PlaylistItem> => {
  try {
    // Usar el nuevo servicio de content items
    const contentItem = await fetchContentItemById(itemId);
    
    // Convertir content item al formato de playlist item para compatibilidad
    return {
      id: contentItem.id,
      playlist_id: contentItem.playlistId,
      item_type: contentItem.itemTypeId,
      content: contentItem.content,
      order_index: contentItem.order || 0,
      created_at: contentItem.createdAt,
      updated_at: contentItem.updatedAt,
      title: contentItem.title,
      description: contentItem.description,
    };
  } catch (error) {
    console.error('[PlaylistItems] Error fetching playlist item by ID:', error);
    throw error;
  }
}; 