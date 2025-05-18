import { useQuery } from '@tanstack/react-query';
import { supabaseClient } from '../lib/supabase';
import { Playlist } from '../types/playlist';

export const usePlaylist = (playlistId: string) => {
  return useQuery<Playlist, Error>({
    queryKey: ['playlist', playlistId],
    queryFn: async () => {
      const { data, error } = await supabaseClient
        .from('playlists')
        .select('*')
        .eq('id', playlistId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('Playlist no encontrada');
      }

      return data;
    },
    enabled: Boolean(playlistId),
  });
}; 