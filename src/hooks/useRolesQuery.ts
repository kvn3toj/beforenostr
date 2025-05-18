import { useQuery } from '@tanstack/react-query';
import { fetchRoles, FetchRolesParams } from '../services/role.service';
import { Role } from '../types/user.types';

export const useRolesQuery = (params: FetchRolesParams) => {
  return useQuery<Role[], Error>({
    queryKey: ['roles', params],
    queryFn: () => fetchRoles(params),
  });
}; 