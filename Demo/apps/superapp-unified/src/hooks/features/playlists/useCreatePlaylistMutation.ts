import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPlaylist } from '../../../services/playlist.service';
import { CreatePlaylistData } from '../../../types/playlist.types';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { extractErrorMessage } from '../../../utils/errorUtils';

export const useCreatePlaylistMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: CreatePlaylistData) => createPlaylist(data),
    onSuccess: () => {
      toast.success(t('toast_playlist_created_success'));
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
    onError: (error: any) => {
      const errorMessage = extractErrorMessage(error, t);
      toast.error(t('toast_error_creating_playlist', { message: errorMessage }));
    },
  });
}; 