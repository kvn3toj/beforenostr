import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as subtitleService from '../../../services/subtitle.service';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { extractErrorMessage } from '../../../utils/errorUtils';

export const useDeleteSubtitleMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, Error, number>({ // Mutate takes subtitle ID as number
    mutationFn: (id: number) => subtitleService.remove(id),
    onSuccess: (data, deletedId) => {
      toast.success(t('toast_subtitle_deleted_success'));
      // Invalidate all subtitle queries to reflect deletion
      queryClient.invalidateQueries({ queryKey: ['subtitles'] });
    },
    onError: (error) => {
      const errorMessage = extractErrorMessage(error, t);
      toast.error(t('toast_error_deleting_subtitle', { message: errorMessage }));
    },
  });
}; 