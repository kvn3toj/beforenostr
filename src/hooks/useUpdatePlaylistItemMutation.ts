import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UpdatePlaylistItemArgs {
  itemId: string;
  title: string;
  description: string;
}

// Placeholder for the actual API call
const updatePlaylistItem = async ({ itemId, title, description }: UpdatePlaylistItemArgs): Promise<void> => {
  console.log(`Updating item ${itemId} with title: ${title}, description: ${description}`);
  // In a real application, this would be an API call (e.g., fetch('/api/playlist-items/${itemId}', { method: 'PUT', body: JSON.stringify({ title, description }) }))
  // Simulate a network request delay
  await new Promise(resolve => setTimeout(resolve, 1000));
};

export const useUpdatePlaylistItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePlaylistItem,
    onSuccess: (_, variables) => {
      toast.success('Configuración del video guardada exitosamente');
      // Optionally invalidate relevant queries here, e.g.:
      queryClient.invalidateQueries({ queryKey: ['playlistItem', variables.itemId] });
      // queryClient.invalidateQueries({ queryKey: ['playlistItems'] }); // If needed
    },
    onError: (error) => {
      toast.error(`Error al guardar la configuración del video: ${error.message}`);
    },
  });
}; 