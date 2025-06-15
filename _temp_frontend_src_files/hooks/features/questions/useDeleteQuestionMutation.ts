import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as questionService from '../../../services/question.service';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { extractErrorMessage } from '../../../utils/errorUtils';

interface DeleteQuestionMutationParams {
  id: number;
  videoItemId: number; // Necesario para invalidar queries
}

export const useDeleteQuestionMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, Error, DeleteQuestionMutationParams>({
    mutationFn: ({ id }: DeleteQuestionMutationParams) => questionService.remove(id),
    onSuccess: (_, { videoItemId }) => {
      toast.success(t('toast_question_deleted_success'));
      queryClient.invalidateQueries({ queryKey: ['questions', { videoItemId }] });
    },
    onError: (error) => {
      const errorMessage = extractErrorMessage(error, t);
      toast.error(t('toast_error_deleting_question', { message: errorMessage }));
    },
  });
}; 