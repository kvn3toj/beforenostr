import { useQuery } from '@tanstack/react-query';
import { fetchMundos, FetchMundosParams } from '../services/mundo.service';
import { Mundo } from '../types/mundo.types';

export const useMundosQuery = (params: FetchMundosParams) => {
  console.log('[useMundosQuery] Hook llamado con params:', params);
  
  const query = useQuery<{ data: Mundo[]; count: number }>({
    queryKey: ['mundos', params],
    queryFn: () => {
      console.log('[useMundosQuery] queryFn ejecutándose...');
      return fetchMundos(params);
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
  });
  
  console.log('[useMundosQuery] Query state:', {
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    data: query.data,
    status: query.status
  });
  
  return query;
}; 