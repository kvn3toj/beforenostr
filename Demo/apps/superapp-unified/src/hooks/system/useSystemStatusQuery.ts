import { useQuery } from '@tanstack/react-query';
import { fetchSystemStatus } from '../../services/system.service';

export const useSystemStatusQuery = () => {
  return useQuery({
    queryKey: ['admin', 'system', 'status'],
    queryFn: fetchSystemStatus,
    refetchInterval: 30000, // Refrescar cada 30 segundos
  });
}; 