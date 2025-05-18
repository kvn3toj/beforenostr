import { useQuery } from '@tanstack/react-query';
import { supabase } from '../services/supabaseClient';
import { Playlist } from '../types/playlist.types';

export const usePlaylist = (playlistId: string | undefined) => {
  return useQuery<Playlist | null>({
    queryKey: ['playlist', playlistId],
    queryFn: async () => {
      if (!playlistId) return null;

      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('id', playlistId)
        .single();

      if (error) {
        console.error('Error fetching playlist:', error);
        throw error;
      }

      return data;
    },
    enabled: !!playlistId,
  });
}; 