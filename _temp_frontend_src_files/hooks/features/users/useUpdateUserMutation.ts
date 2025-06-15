import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '../../../services/user.service';
import { UpdateUserData } from '../../../types/user.types';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { extractErrorMessage } from '../../../utils/errorUtils';

// Type for update mutation data
type UpdateUserMutationData = {
  id: string;
  data: UpdateUserData;
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: UpdateUserMutationData) => updateUser(id, data),
    onSuccess: () => {
      toast.success(t('toast_user_updated_success'));
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      const errorMessage = extractErrorMessage(error, t);
      toast.error(t('toast_error_updating_user', { message: errorMessage }));
    },
  });
}; 