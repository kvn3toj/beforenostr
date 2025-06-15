import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRole } from '../../../services/role.service';
import { UpdateRoleData } from '../../../types/role.types';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { extractErrorMessage } from '../../../utils/errorUtils';

export const useUpdateRoleMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleData }) => updateRole(id, data),
    onSuccess: () => {
      toast.success(t('toast_role_updated_success'));
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error: any) => {
      const errorMessage = extractErrorMessage(error, t);
      toast.error(t('toast_error_updating_role', { message: errorMessage }));
    },
  });
}; 