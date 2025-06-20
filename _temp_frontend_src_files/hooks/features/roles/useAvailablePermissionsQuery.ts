import { useQuery } from '@tanstack/react-query';
import { fetchAvailablePermissions } from '../../../services/role.service';
import { AvailablePermissionsList } from '../../../types/user.types';

export const useAvailablePermissionsQuery = () => {
  return useQuery<AvailablePermissionsList, Error>({
    queryKey: ['roles', 'availablePermissions'],
    queryFn: fetchAvailablePermissions
  });
}; 