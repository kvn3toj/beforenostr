import { useQuery } from '@tanstack/react-query';
import { fetchPlaylists, FetchPlaylistsParams } from '../services/playlist.service';
import { Playlist } from '../types/playlist.types';

export const usePlaylistsQuery = (params: FetchPlaylistsParams) => {
  return useQuery<{ data: Playlist[]; count: number }>({
    queryKey: ['playlists', params],
    queryFn: () => fetchPlaylists(params),
  });
}; 