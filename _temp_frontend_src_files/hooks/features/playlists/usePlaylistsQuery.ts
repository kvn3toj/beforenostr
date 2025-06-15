import { useQuery } from '@tanstack/react-query';
import { fetchPlaylists } from '../../../services/playlist.service';

export const usePlaylistsQuery = (params: any) => {
  return useQuery({
    queryKey: ['playlists', params],
    queryFn: () => fetchPlaylists(params),
  });
}; 