import { useQuery } from '@tanstack/react-query';
import { fetchRoles, FetchRolesParams } from '../services/role.service';
import { Role } from '../types/user.types';
import { QUERY_KEYS } from '../constants/queryKeys';

export const useRolesQuery = (params: FetchRolesParams) => {
  return useQuery<{ data: Role[]; count: number }, Error>({
    queryKey: [QUERY_KEYS.ROLES, params],
    queryFn: () => fetchRoles(params),
  });
}; 