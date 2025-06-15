import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as questionService from '../../../services/question.service';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { extractErrorMessage } from '../../../utils/errorUtils';
import { CreateQuestionDto } from '../../../questions/dto/create-question.dto';
import type { Question } from '@prisma/client';

export const useCreateQuestionMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<Question, Error, CreateQuestionDto>({
    mutationFn: (data: CreateQuestionDto) => questionService.create(data),
    onSuccess: (newQuestion) => {
      toast.success(t('toast_question_created_success'));
      queryClient.invalidateQueries({ queryKey: ['questions', { videoItemId: newQuestion.videoItemId }] });
    },
    onError: (error) => {
      const errorMessage = extractErrorMessage(error, t);
      toast.error(t('toast_error_creating_question', { message: errorMessage }));
    },
  });
}; 