import { useMutation, useQueryClient } from '@tanstack/react-query';
import { restorePlaylistVersion } from '../../../services/playlist.service';
import { Playlist } from '../../../types/playlist.types';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { extractErrorMessage } from '../../../utils/errorUtils';

interface RestorePlaylistVersionInput {
  playlistId: string;
  versionId: string;
}

export const useRestorePlaylistVersionMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<Playlist, unknown, RestorePlaylistVersionInput>({
    mutationFn: ({ playlistId, versionId }) => restorePlaylistVersion(playlistId, versionId),
    onSuccess: (data, variables) => {
      toast.success(t('toast_playlist_version_restored_success'));
      
      // Invalidate and refetch the playlist and its versions
      queryClient.invalidateQueries({ queryKey: ['playlists', variables.playlistId] });
      queryClient.invalidateQueries({ queryKey: ['playlists', variables.playlistId, 'versions'] });
    },
    onError: (error: any) => {
      const errorMessage = extractErrorMessage(error, t);
      toast.error(t('toast_error_restoring_playlist_version', { message: errorMessage }));
    },
  });
}; 