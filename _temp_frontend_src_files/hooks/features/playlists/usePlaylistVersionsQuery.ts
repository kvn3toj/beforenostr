import { useQuery } from '@tanstack/react-query';
import { fetchPlaylistVersions } from '../../../services/playlist.service';
import { PlaylistVersion } from '../../../types/playlist.types';

export const usePlaylistVersionsQuery = (playlistId: string | undefined) => {
  return useQuery<PlaylistVersion[]>({
    queryKey: ['playlists', playlistId, 'versions'],
    queryFn: () => fetchPlaylistVersions(playlistId!),
    enabled: !!playlistId,
  });
}; 