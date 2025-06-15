import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { createMundo } from '../../../services/mundo.service';
import { CreateMundoData } from '../../types/mundo.types';
import { useAuth } from '../../useAuth';
import { extractErrorMessage } from '../../../utils/errorUtils';

export const useCreateMundoMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (data: CreateMundoData) => {
      if (!user?.id) {
        throw new Error(t('error_user_not_authenticated'));
      }
      return createMundo(data, user.id);
    },
    onSuccess: () => {
      toast.success(t('toast_mundo_created_success'));
      queryClient.invalidateQueries({ queryKey: ['mundos'] });
    },
    onError: (error: any) => {
      const errorMessage = extractErrorMessage(error, t);
      toast.error(t('toast_create_mundo_error', { message: errorMessage }));
    },
  });
}; 