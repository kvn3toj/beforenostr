import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRole } from '../../../services/role.service';
import { CreateRoleData } from '../../../types/role.types';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { extractErrorMessage } from '../../../utils/errorUtils';

export const useCreateRoleMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: CreateRoleData) => createRole(data),
    onSuccess: () => {
      toast.success(t('toast_role_created_success'));
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error: any) => {
      const errorMessage = extractErrorMessage(error, t);
      toast.error(t('toast_error_creating_role', { message: errorMessage }));
    },
  });
}; 