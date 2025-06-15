import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMundo } from '../../../services/mundo.service';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { extractErrorMessage } from '../../../utils/errorUtils';

export const useDeleteMundoMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string) => deleteMundo(id),
    onSuccess: () => {
      toast.success(t('toast_mundo_deleted_success'));
      queryClient.invalidateQueries({ queryKey: ['mundos'] });
    },
    onError: (error: any) => {
      const errorMessage = extractErrorMessage(error, t);
      toast.error(t('toast_delete_mundo_error', { message: errorMessage }));
    },
  });
}; 