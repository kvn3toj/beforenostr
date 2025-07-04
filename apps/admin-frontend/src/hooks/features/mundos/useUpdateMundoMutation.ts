import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { updateMundo } from '../../../services/mundo.service';
import { UpdateMundoData } from '../../types/mundo.types';
import { extractErrorMessage } from '../../../utils/errorUtils';

type UpdateMundoMutationData = {
  id: string;
  data: UpdateMundoData;
};

export const useUpdateMundoMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateMundoMutationData) => updateMundo(id, data),
    onSuccess: () => {
      toast.success(t('toast_mundo_updated_success'));
      queryClient.invalidateQueries({ queryKey: ['mundos'] });
    },
    onError: (error: any) => {
      const errorMessage = extractErrorMessage(error, t);
      toast.error(t('toast_update_mundo_error', { message: errorMessage }));
    },
  });
}; 