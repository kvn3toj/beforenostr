import { useQuery } from '@tanstack/react-query';
import { fetchLeastInteractedPlaylists } from '../../services/analytics.service';
import { LeastInteractedPlaylistsMetric } from '../../types/analytics.types';

export const useLeastInteractedPlaylistsQuery = () => {
  return useQuery<LeastInteractedPlaylistsMetric>({
    queryKey: ['analytics', 'leastInteractedPlaylists'],
    queryFn: fetchLeastInteractedPlaylists,
  });
}; 