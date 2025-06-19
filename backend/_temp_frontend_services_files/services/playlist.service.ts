import { Playlist, PlaylistVersion, CreatePlaylistData, UpdatePlaylistData } from '../types/playlist.types';
import { apiService } from './api.service';

// Configuración del backend - ajustar según tu configuración
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';
const PLAYLISTS_ENDPOINT = `${API_BASE_URL}/playlists`;

export interface FetchPlaylistsParams {
  page: number; // 0-indexed
  pageSize: number;
  sortBy: string | null;
  sortDirection: 'asc' | 'desc' | null;
  filters: {
    name?: string;
    mundo_id?: string;
    is_active?: boolean;
  };
}

// Helper function para manejar respuestas HTTP
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // Si no se puede parsear el JSON, usar el mensaje por defecto
    }
    throw new Error(errorMessage);
  }
  return response.json();
};

export const fetchPlaylists = async (): Promise<Playlist[]> => {
  console.log('[Playlists] fetchPlaylists llamado');
  try {
    // Usar el endpoint que funciona con datos reales
    const url = '/playlists-direct';
    console.log('[Playlists] Haciendo petición a:', url);
    
    const response = await apiService.get(url);
    console.log('[Playlists] Respuesta recibida:', response);
    
    // El backend devuelve un array directo
    if (Array.isArray(response)) {
      console.log('[Playlists] Respuesta es array. Items:', response.length);
      return response;
    }
    
    // Si viene en formato { data: [...] }, extraer el array
    if (response && response.data && Array.isArray(response.data)) {
      console.log('[Playlists] Respuesta en formato {data: [...]}. Items:', response.data.length);
      return response.data;
    }
    
    console.warn('[Playlists] Respuesta inesperada del backend:', response);
    return [];
  } catch (error) {
    console.error('[Playlists] Error detallado:', error);
    console.error('[Playlists] Error message:', error?.message);
    console.error('[Playlists] Error stack:', error?.stack);
    console.error('Error fetching playlists:', error);
    throw error;
  }
};

export const createPlaylist = async (data: CreatePlaylistData): Promise<Playlist> => {
  try {
    console.log('[Playlists] Creating playlist with data:', data);
    return await apiService.post<Playlist>('/playlists', data);
  } catch (error) {
    console.error('Error creating playlist:', error);
    throw error;
  }
};

export const updatePlaylist = async (id: string, data: UpdatePlaylistData): Promise<Playlist> => {
  try {
    return await apiService.put<Playlist>(`/playlists/${id}`, data);
  } catch (error) {
    console.error(`Error updating playlist ${id}:`, error);
    throw error;
  }
};

export const deletePlaylist = async (id: string): Promise<void> => {
  try {
    await apiService.delete<void>(`/playlists/${id}`);
  } catch (error) {
    console.error(`Error deleting playlist ${id}:`, error);
    throw error;
  }
};

export const fetchPlaylistById = async (id: string): Promise<Playlist> => {
  try {
    return await apiService.get<Playlist>(`/playlists/${id}`);
  } catch (error) {
    console.error(`Error fetching playlist ${id}:`, error);
    throw error;
  }
};

export const fetchPlaylistVersions = async (playlistId: string): Promise<PlaylistVersion[]> => {
  const response = await fetch(`${PLAYLISTS_ENDPOINT}/${playlistId}/versions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Agregar headers de autenticación si es necesario
      // 'Authorization': `Bearer ${token}`,
    },
  });

  const data = await handleResponse(response);
  return data || [];
};

export const createPlaylistVersion = async (
  playlistId: string,
  playlistData: Playlist,
  userId: string
): Promise<PlaylistVersion> => {
  const response = await fetch(`${PLAYLISTS_ENDPOINT}/${playlistId}/versions`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      // Agregar headers de autenticación si es necesario
      // 'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      playlist_id: playlistId,
      changed_by_user_id: userId,
      name: playlistData.name,
      description: playlistData.description,
      mundo_id: playlistData.mundo_id,
      order_index: playlistData.order_index,
      is_active: playlistData.is_active,
      published_at: playlistData.published_at,
      unpublished_at: playlistData.unpublished_at,
    }),
  });

  return handleResponse(response);
};

export const updatePlaylistStatus = async (id: string, isActive: boolean): Promise<Playlist> => {
  const response = await fetch(`${PLAYLISTS_ENDPOINT}/${id}`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      // Agregar headers de autenticación si es necesario
      // 'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ 
      is_active: isActive, 
      updated_at: new Date().toISOString() 
    }),
  });

  return handleResponse(response);
};

export const restorePlaylistVersion = async (
  playlistId: string,
  versionId: string
): Promise<Playlist> => {
  const response = await fetch(`${PLAYLISTS_ENDPOINT}/${playlistId}/versions/${versionId}/restore`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      // Agregar headers de autenticación si es necesario
      // 'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}; 