import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as questionService from '../../../services/question.service';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { extractErrorMessage } from '../../../utils/errorUtils';
import { UpdateQuestionDto } from '../../../questions/dto/update-question.dto';
import type { Question } from '@prisma/client';

interface UpdateQuestionMutationParams {
  id: number;
  data: UpdateQuestionDto;
}

export const useUpdateQuestionMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<Question, Error, UpdateQuestionMutationParams>({
    mutationFn: ({ id, data }: UpdateQuestionMutationParams) => questionService.update(id, data),
    onSuccess: (updatedQuestion) => {
      toast.success(t('toast_question_updated_success'));
      queryClient.invalidateQueries({ queryKey: ['questions', { videoItemId: updatedQuestion.videoItemId }] });
      queryClient.invalidateQueries({ queryKey: ['question', updatedQuestion.id] });
    },
    onError: (error) => {
      const errorMessage = extractErrorMessage(error, t);
      toast.error(t('toast_error_updating_question', { message: errorMessage }));
    },
  });
}; 