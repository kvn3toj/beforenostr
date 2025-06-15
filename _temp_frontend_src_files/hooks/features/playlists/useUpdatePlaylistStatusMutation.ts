import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePlaylistStatus } from '../../../services/playlist.service';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { extractErrorMessage } from '../../../utils/errorUtils';

interface UpdatePlaylistStatusVariables {
  id: string;
  isActive: boolean;
}

export const useUpdatePlaylistStatusMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, Error, UpdatePlaylistStatusVariables>({
    mutationFn: ({ id, isActive }) => updatePlaylistStatus(id, isActive),
    onSuccess: () => {
      toast.success(t('toast_playlist_status_updated_success'));
      // Invalidate queries related to playlists or the specific playlist
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      // You might also want to invalidate a specific playlist query if you have one
      // queryClient.invalidateQueries({ queryKey: ['playlist', variables.id] });
    },
    onError: (error) => {
      const errorMessage = extractErrorMessage(error, t);
      toast.error(t('toast_error_updating_playlist_status', { message: errorMessage }));
    },
  });
}; 