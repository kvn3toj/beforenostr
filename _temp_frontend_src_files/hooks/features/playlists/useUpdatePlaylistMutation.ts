import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePlaylist } from '../../../services/playlist.service';
import { UpdatePlaylistData } from '../../../types/playlist.types';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { extractErrorMessage } from '../../../utils/errorUtils';

export const useUpdatePlaylistMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePlaylistData }) => updatePlaylist(id, data),
    onSuccess: () => {
      toast.success(t('toast_playlist_updated_success'));
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
    onError: (error: any) => {
      const errorMessage = extractErrorMessage(error, t);
      toast.error(t('toast_error_updating_playlist', { message: errorMessage }));
    },
  });
}; 