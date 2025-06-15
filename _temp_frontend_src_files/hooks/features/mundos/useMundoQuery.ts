import { useQuery } from '@tanstack/react-query';
import { fetchMundoById } from '../../../services/mundo.service';

export const useMundoQuery = (mundoId?: string) => {
  return useQuery({
    queryKey: ['mundo', mundoId],
    queryFn: () => mundoId ? fetchMundoById(mundoId) : Promise.resolve(null),
    enabled: !!mundoId,
  });
}; 