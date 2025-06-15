import { useQuery } from '@tanstack/react-query';
import { fetchPlaylistItems } from '../services/playlistItem.service';
import { PlaylistItem } from '../types/playlistItem.types';

export const usePlaylistItemsQuery = (playlistId: string | undefined) => {
  return useQuery<PlaylistItem[]>({
    queryKey: ['playlistItems', playlistId],
    queryFn: () => fetchPlaylistItems(playlistId!),
    enabled: !!playlistId,
  });
}; 