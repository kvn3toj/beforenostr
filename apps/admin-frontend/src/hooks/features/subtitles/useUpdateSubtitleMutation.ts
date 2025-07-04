import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as subtitleService from '../../../services/subtitle.service';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { extractErrorMessage } from '../../../utils/errorUtils';
import { UpdateSubtitleDto } from '../../../subtitle/dto/update-subtitle.dto';
import { Subtitle } from '@prisma/client';

export const useUpdateSubtitleMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<Subtitle, Error, { id: number, data: UpdateSubtitleDto }>({
    mutationFn: ({ id, data }) => subtitleService.update(id, data),
    onSuccess: (updatedSubtitle) => {
      toast.success(t('toast_subtitle_updated_success'));
      queryClient.invalidateQueries({ queryKey: ['subtitles', { videoItemId: updatedSubtitle.videoItemId }] });
      queryClient.invalidateQueries({ queryKey: ['subtitle', updatedSubtitle.id] }); // Invalidate single subtitle if it exists
    },
    onError: (error) => {
      const errorMessage = extractErrorMessage(error, t);
      toast.error(t('toast_error_updating_subtitle', { message: errorMessage }));
    },
  });
}; 