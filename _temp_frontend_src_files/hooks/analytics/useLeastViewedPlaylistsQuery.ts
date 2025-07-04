import { useQuery } from '@tanstack/react-query';
import { fetchLeastViewedPlaylists } from '../../services/analytics.service';
import { LeastViewedPlaylistsMetric } from '../../types/analytics.types';

export const useLeastViewedPlaylistsQuery = () => {
  return useQuery<LeastViewedPlaylistsMetric>({
    queryKey: ['analytics', 'leastViewedPlaylists'],
    queryFn: fetchLeastViewedPlaylists,
  });
}; 