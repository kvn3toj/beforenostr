import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../lib/api-service';

// ============================================================================
// TIPOS Y INTERFACES
// ============================================================================

export interface Video {
  id: string;
  title: string;
  description?: string | null;
  videoUrl: string;
  duration: number;
  order: number;
  isActive: boolean;
  thumbnailUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  playlistId: string;
  rewards?: { meritos?: number, ondas?: number };
  questions: any[]; // Temporalmente any, idealmente definir Question[]
}

export interface Playlist {
  id: string;
  mundoId: string;
  name: string;
  description: string;
  imageUrl: string;
  orderInMundo: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  version: number;
  videoItems: Video[];
}

export interface PlaylistResponse {
  data: Playlist[];
}

// ============================================================================
// SERVICIOS API
// ============================================================================

const PlaylistApiService = {
  // Obtener todas las playlists
  async getPlaylists(): Promise<Playlist[]> {
    console.log('🎪 Obteniendo playlists del backend...');
    const response = await apiService.get<{ data: Playlist[] }>('/playlists?includeItems=true&limit=50');
    console.log('🎪 Respuesta completa del backend:', response);

    // La respuesta directa ya contiene la estructura {data: Array, count, pagination}
    const playlists = response.data || [];
    console.log('🎪 Playlists extraídas:', playlists);
    return playlists;
  },

  // Obtener playlist por ID
  async getPlaylistById(playlistId: string): Promise<Playlist | null> {
    try {
      const response = await apiService.get<{ data: Playlist }>(`/playlists/${playlistId}`);
      return response.data || null;
    } catch (error) {
      console.error(`Error fetching playlist ${playlistId}:`, error);
      return null;
    }
  },
};

// ============================================================================
// HOOKS PRINCIPALES
// ============================================================================

/**
 * Hook para obtener todas las playlists
 */
export const usePlaylists = () => {
  return useQuery({
    queryKey: ['playlists'],
    queryFn: PlaylistApiService.getPlaylists,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    retryDelay: 1000,
  });
};

/**
 * Hook para obtener una playlist específica
 */
export const usePlaylist = (playlistId: string) => {
  return useQuery({
    queryKey: ['playlist', playlistId],
    queryFn: () => PlaylistApiService.getPlaylistById(playlistId),
    enabled: !!playlistId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  });
};

/**
 * Hook para obtener playlists con sus videos agrupados
 */
export const usePlaylistsWithVideos = () => {
  const { data: playlists, ...playlistQuery } = usePlaylists();

  return {
    ...playlistQuery,
    data: playlists,
  };
};

export default {
  usePlaylists,
  usePlaylist,
  usePlaylistsWithVideos,
};
