import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePlaylist } from '../../../services/playlist.service';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { extractErrorMessage } from '../../../utils/errorUtils';

export const useDeletePlaylistMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string) => deletePlaylist(id),
    onSuccess: () => {
      toast.success(t('toast_playlist_deleted_success'));
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
    onError: (error: any) => {
      const errorMessage = extractErrorMessage(error, t);
      toast.error(t('toast_error_deleting_playlist', { message: errorMessage }));
    },
  });
}; 