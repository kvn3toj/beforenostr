import { useQuery } from '@tanstack/react-query';
import { fetchUsers, FetchUsersParams } from '../services/user.service';

export const useUsersQuery = (params: FetchUsersParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => fetchUsers(params),
  });
}; 