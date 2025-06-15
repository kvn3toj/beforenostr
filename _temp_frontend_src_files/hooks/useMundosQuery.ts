import { useQuery } from '@tanstack/react-query';
import { fetchMundos, FetchMundosParams } from '../services/mundo.service';
import { Mundo } from '../types/mundo.types';

export const useMundosQuery = (params: FetchMundosParams) => {
  return useQuery<{ data: Mundo[]; count: number }>({
    queryKey: ['mundos', params],
    queryFn: () => fetchMundos(params),
  });
}; 