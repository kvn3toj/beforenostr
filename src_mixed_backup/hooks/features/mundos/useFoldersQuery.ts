import { useQuery } from '@tanstack/react-query';
import { fetchFolders } from '../../../services/folder.service';

export const useFoldersQuery = (params: any) => {
  return useQuery({
    queryKey: ['folders', params],
    queryFn: () => fetchFolders(params),
  });
}; 