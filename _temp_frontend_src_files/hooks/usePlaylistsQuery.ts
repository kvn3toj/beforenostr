import { useQuery } from '@tanstack/react-query';
import { fetchPlaylists } from '../services/playlist.service';
import { Playlist } from '../types/playlist.types';

export interface FetchPlaylistsParams {
  page: number;
  pageSize: number;
  sortBy: string | null;
  sortDirection: 'asc' | 'desc' | null;
  filters: {
    name?: string;
    mundo_id?: string;
    is_active?: boolean;
  };
}

export const usePlaylistsQuery = (params: FetchPlaylistsParams) => {
  return useQuery<{ data: Playlist[]; count: number }>({
    queryKey: ['playlists', params],
    queryFn: async () => {
      const data = await fetchPlaylists();
      return { data, count: data.length };
    },
  });
};

export type { FetchPlaylistsParams }; 