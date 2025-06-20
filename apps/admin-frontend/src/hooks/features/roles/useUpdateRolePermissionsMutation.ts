import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRolePermissions } from '../../../services/role.service';
import { Role } from '../../../types/user.types';
import { toast } from 'sonner';

type UpdateRolePermissionsInput = {
  roleId: string;
  permissions: string[];
};

export const useUpdateRolePermissionsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Role, Error, UpdateRolePermissionsInput>({
    mutationFn: ({ roleId, permissions }) => updateRolePermissions(roleId, permissions),
    onSuccess: () => {
      toast.success('Permisos del rol actualizados con éxito');
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar los permisos: ${error.message}`);
    }
  });
}; 