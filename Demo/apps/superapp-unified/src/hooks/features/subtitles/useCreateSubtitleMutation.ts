import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as subtitleService from '../../../services/subtitle.service';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { extractErrorMessage } from '../../../utils/errorUtils';
import { CreateSubtitleDto } from '../../../subtitle/dto/create-subtitle.dto';
import { Subtitle } from '@prisma/client';

export const useCreateSubtitleMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<Subtitle, Error, CreateSubtitleDto>({
    mutationFn: (data: CreateSubtitleDto) => subtitleService.create(data),
    onSuccess: (newSubtitle) => {
      toast.success(t('toast_subtitle_created_success'));
      queryClient.invalidateQueries({ queryKey: ['subtitles', { videoItemId: newSubtitle.videoItemId }] });
    },
    onError: (error) => {
      const errorMessage = extractErrorMessage(error, t);
      toast.error(t('toast_error_creating_subtitle', { message: errorMessage }));
    },
  });
}; 