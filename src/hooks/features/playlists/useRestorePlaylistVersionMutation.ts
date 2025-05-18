import { useMutation, useQueryClient } from '@tanstack/react-query';
import { restorePlaylistVersion } from '../../../services/playlist.service';
import { Playlist } from '../../../types/playlist.types';
import { toast } from 'sonner';

interface RestorePlaylistVersionInput {
  playlistId: string;
  versionId: string;
}

export const useRestorePlaylistVersionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Playlist, Error, RestorePlaylistVersionInput>({
    mutationFn: ({ playlistId, versionId }) => restorePlaylistVersion(playlistId, versionId),
    onSuccess: (data, variables) => {
      toast.success('Versión restaurada con éxito');
      
      // Invalidate and refetch the playlist and its versions
      queryClient.invalidateQueries({ queryKey: ['playlists', variables.playlistId] });
      queryClient.invalidateQueries({ queryKey: ['playlists', variables.playlistId, 'versions'] });
    },
    onError: (error) => {
      toast.error(`Error al restaurar la versión: ${error.message}`);
    },
  });
}; 