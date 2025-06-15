import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePlaylistItem } from '../services/playlistItem.service';

export const useDeletePlaylistItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => deletePlaylistItem(itemId),
    onSuccess: (_, itemId) => {
      // Invalidar consultas que podrían contener este elemento
      queryClient.invalidateQueries({ queryKey: ['playlistItems'] });
    },
  });
}; 