import { useQuery } from '@tanstack/react-query';
import { fetchTopViewedPlaylists } from '../../services/analytics.service';
import { TopViewedPlaylistsMetric } from '../../types/analytics.types';

export const useTopViewedPlaylistsQuery = () => {
  return useQuery<TopViewedPlaylistsMetric, Error>({
    queryKey: ['analytics', 'topViewedPlaylists'],
    queryFn: fetchTopViewedPlaylists,
  });
}; 