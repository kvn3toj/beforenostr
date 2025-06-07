import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRolePermissions } from '../../../services/role.service';
import { Role } from '../../../types/user.types';
import { toast } from 'sonner';
import { analyticsService } from '../../../services/analytics.service';

type UpdateRolePermissionsInput = {
  roleId: string;
  permissions: string[];
};

export const useUpdateRolePermissionsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Role, Error, UpdateRolePermissionsInput>({
    mutationFn: ({ roleId, permissions }) => updateRolePermissions(roleId, permissions),
    onSuccess: (data, variables) => {
      toast.success('Permisos del rol actualizados con éxito');
      
      // Track successful permissions update
      analyticsService.trackPermissionsFunnel('PERMISSIONS_SAVE_SUCCESS', {
        roleId: variables.roleId,
        newPermissionCount: variables.permissions.length,
        updatedPermissions: variables.permissions,
        timestamp: new Date().toISOString()
      });

      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error: Error, variables) => {
      toast.error(`Error al actualizar los permisos: ${error.message}`);
      
      // Track failed permissions update
      analyticsService.trackPermissionsFunnel('PERMISSIONS_SAVE_FAILED', {
        roleId: variables.roleId,
        attemptedPermissionCount: variables.permissions.length,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      analyticsService.trackError('permissions_update_error', error, {
        funnel: 'permissions_management',
        step: 'permissions_save',
        roleId: variables.roleId,
        permissionCount: variables.permissions.length
      });
    }
  });
}; 