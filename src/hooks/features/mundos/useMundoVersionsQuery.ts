import { useQuery } from '@tanstack/react-query';
import { fetchMundoVersions } from '../../../services/mundo.service';
import { MundoVersion } from '../../../types/mundo.types';

export const useMundoVersionsQuery = (mundoId: string | undefined) => {
  return useQuery<MundoVersion[]>({
    queryKey: ['mundos', mundoId, 'versions'],
    queryFn: () => fetchMundoVersions(mundoId!),
    enabled: !!mundoId,
  });
}; 