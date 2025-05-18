import { supabase } from './supabaseClient';
import { PlaylistItem } from '../types/playlistItem.types';

export const fetchPlaylistItems = async (playlistId: string): Promise<PlaylistItem[]> => {
  const { data, error } = await supabase
    .from('playlist_items')
    .select('*')
    .eq('playlist_id', playlistId)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching playlist items:', error);
    throw error;
  }

  return data || [];
};

export const createPlaylistItem = async (
  itemData: {
    playlist_id: string;
    content: string;
    item_type?: string;
    order_index?: number;
  }
): Promise<PlaylistItem> => {
  const { data, error } = await supabase
    .from('playlist_items')
    .insert([
      {
        playlist_id: itemData.playlist_id,
        content: itemData.content,
        item_type: itemData.item_type || 'video_embed',
        order_index: itemData.order_index || 0,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating playlist item:', error);
    throw error;
  }

  return data;
};

export const fetchPlaylistItemById = async (itemId: string): Promise<PlaylistItem> => {
  const { data, error } = await supabase
    .from('playlist_items')
    .select('*')
    .eq('id', itemId)
    .single();

  if (error) {
    console.error('Error fetching playlist item:', error);
    throw error;
  }

  return data;
};

export const deletePlaylistItem = async (itemId: string): Promise<void> => {
  const { error } = await supabase
    .from('playlist_items')
    .delete()
    .eq('id', itemId);

  if (error) {
    console.error('Error deleting playlist item:', error);
    throw error;
  }
}; 