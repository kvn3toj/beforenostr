import { useQuery } from '@tanstack/react-query';
import { fetchPlaylistById } from '../services/playlist.service';
import { Playlist } from '../types/playlist.types';

export const usePlaylist = (playlistId: string | undefined) => {
  return useQuery<Playlist | null>({
    queryKey: ['playlist', playlistId],
    queryFn: async () => {
      if (!playlistId) return null;
      return await fetchPlaylistById(playlistId);
    },
    enabled: !!playlistId,
  });
}; 