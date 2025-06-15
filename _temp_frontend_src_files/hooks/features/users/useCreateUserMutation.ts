import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '../../../services/user.service';
import { CreateUserData } from '../../../types/user.types';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { extractErrorMessage } from '../../../utils/errorUtils';

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: CreateUserData) => createUser(data),
    onSuccess: () => {
      toast.success(t('toast_user_created_success'));
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      const errorMessage = extractErrorMessage(error, t);
      toast.error(t('toast_create_user_error', { message: errorMessage }));
    },
  });
}; 