import { useQuery } from '@tanstack/react-query';
import { fetchPlaylistsCreatedOverTime } from '../../services/analytics.service';
import { TimeRangeParams, TimeSeriesDataPoint } from '../../types/analytics.types';

export const usePlaylistsCreatedOverTimeQuery = (params: TimeRangeParams) => {
  return useQuery<TimeSeriesDataPoint[], Error>({
    queryKey: ['analytics', 'playlistsCreatedOverTime', params.interval, params.startDate, params.endDate],
    queryFn: () => fetchPlaylistsCreatedOverTime(params),
    // Mantenemos los datos en caché por 5 minutos
    staleTime: 5 * 60 * 1000,
    // Refrescamos en segundo plano cada minuto
    refetchInterval: 60 * 1000,
  });
}; 