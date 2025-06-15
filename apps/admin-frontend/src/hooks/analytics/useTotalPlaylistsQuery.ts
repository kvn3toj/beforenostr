import { useQuery } from '@tanstack/react-query';
import { fetchTotalPlaylists } from '../../services/analytics.service';
import { TotalCountMetric } from '../../types/analytics.types';

export const useTotalPlaylistsQuery = () => {
  return useQuery<TotalCountMetric, Error>({
    queryKey: ['analytics', 'totalPlaylists'],
    queryFn: fetchTotalPlaylists,
  });
}; 