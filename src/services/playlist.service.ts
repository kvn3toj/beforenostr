import { supabase } from './supabaseClient';
import { Playlist, PlaylistVersion } from '../types/playlist.types';

export type CreatePlaylistData = Pick<Playlist, 'name' | 'mundo_id' | 'published_at' | 'unpublished_at'>;
export type UpdatePlaylistData = Pick<Playlist, 'name' | 'mundo_id' | 'published_at' | 'unpublished_at'>;

export interface FetchPlaylistsParams {
  page: number; // 0-indexed
  pageSize: number;
  sortBy: string | null;
  sortDirection: 'asc' | 'desc' | null;
  filters: {
    name?: string;
    mundo_id?: string;
    is_active?: boolean;
  };
}

export const fetchPlaylists = async (params: FetchPlaylistsParams): Promise<{ data: Playlist[]; count: number }> => {
  let query = supabase
    .from('playlists')
    .select('*, mundo:mundo_id(*)', { count: 'exact' });

  // Aplicar filtrado
  if (params.filters.name) {
    query = query.ilike('name', `%${params.filters.name}%`);
  }
  if (params.filters.mundo_id) {
    query = query.eq('mundo_id', params.filters.mundo_id);
  }
  if (params.filters.is_active !== undefined) {
    query = query.eq('is_active', params.filters.is_active);
  }

  // Aplicar ordenamiento
  if (params.sortBy) {
    query = query.order(params.sortBy, { ascending: params.sortDirection === 'asc' });
  } else {
    // Ordenamiento por defecto si no se especifica sortBy
    query = query.order('created_at', { ascending: false });
  }

  // Aplicar paginación (range es inclusivo en ambos extremos)
  const start = params.page * params.pageSize;
  const end = start + params.pageSize - 1;
  query = query.range(start, end);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching playlists:', error);
    throw error;
  }

  return { data: data || [], count: count ?? 0 };
};

export const createPlaylist = async (playlistData: CreatePlaylistData, userId: string): Promise<Playlist> => {
  console.log('Creando playlist con user ID:', userId);

  const { data, error } = await supabase
    .from('playlists')
    .insert([{
      name: playlistData.name,
      mundo_id: playlistData.mundo_id,
      description: '', // Valor por defecto
      order_index: 0,  // Valor por defecto
      is_active: true, // Valor por defecto
      created_by: userId,
      published_at: playlistData.published_at,
      unpublished_at: playlistData.unpublished_at,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating playlist:', error);
    throw error;
  }

  return data;
};

export const updatePlaylistStatus = async (id: string, isActive: boolean): Promise<Playlist> => {
  const { data, error } = await supabase
    .from('playlists')
    .update({ 
      is_active: isActive, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating playlist status:', error);
    throw error;
  }

  return data;
};

export const deletePlaylist = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('playlists')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting playlist:', error);
    throw error;
  }
};

export const fetchPlaylistById = async (id: string): Promise<Playlist> => {
  const { data, error } = await supabase
    .from('playlists')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching playlist by ID:', error);
    throw error;
  }

  return data;
};

export const fetchPlaylistVersions = async (playlistId: string): Promise<PlaylistVersion[]> => {
  const { data, error } = await supabase
    .from('playlist_versions')
    .select('*')
    .eq('playlist_id', playlistId)
    .order('version', { ascending: false });

  if (error) {
    console.error('Error fetching playlist versions:', error);
    throw error;
  }

  return data || [];
};

export const createPlaylistVersion = async (
  playlistId: string,
  playlistData: Playlist,
  userId: string
): Promise<PlaylistVersion> => {
  // Get the current version number
  const { data: currentVersion } = await supabase
    .from('playlists')
    .select('version')
    .eq('id', playlistId)
    .single();

  const newVersion = (currentVersion?.version || 0) + 1;

  // Create the version record
  const { data, error } = await supabase
    .from('playlist_versions')
    .insert([{
      playlist_id: playlistId,
      version: newVersion,
      timestamp: new Date().toISOString(),
      changed_by_user_id: userId,
      name: playlistData.name,
      description: playlistData.description,
      mundo_id: playlistData.mundo_id,
      order_index: playlistData.order_index,
      is_active: playlistData.is_active,
      published_at: playlistData.published_at,
      unpublished_at: playlistData.unpublished_at,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating playlist version:', error);
    throw error;
  }

  // Update the version number in the main playlist
  await supabase
    .from('playlists')
    .update({ version: newVersion })
    .eq('id', playlistId);

  return data;
};

export const updatePlaylist = async (
  id: string,
  playlistData: UpdatePlaylistData,
  userId: string
): Promise<Playlist> => {
  // First, get the current playlist data
  const currentPlaylist = await fetchPlaylistById(id);

  // Update the playlist
  const { data, error } = await supabase
    .from('playlists')
    .update({
      name: playlistData.name,
      mundo_id: playlistData.mundo_id,
      published_at: playlistData.published_at,
      unpublished_at: playlistData.unpublished_at,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating playlist:', error);
    throw error;
  }

  // Create a new version
  await createPlaylistVersion(id, data, userId);

  return data;
};

export const restorePlaylistVersion = async (
  playlistId: string,
  versionId: string
): Promise<Playlist> => {
  // First, get the version data
  const { data: version, error: versionError } = await supabase
    .from('playlist_versions')
    .select('*')
    .eq('id', versionId)
    .single();

  if (versionError) {
    console.error('Error fetching playlist version:', versionError);
    throw versionError;
  }

  // Get the current version number
  const { data: currentVersion } = await supabase
    .from('playlists')
    .select('version')
    .eq('id', playlistId)
    .single();

  const newVersion = (currentVersion?.version || 0) + 1;

  // Update the playlist with the version data
  const { data: updatedPlaylist, error: updateError } = await supabase
    .from('playlists')
    .update({
      name: version.name,
      description: version.description,
      mundo_id: version.mundo_id,
      order_index: version.order_index,
      is_active: version.is_active,
      published_at: version.published_at,
      unpublished_at: version.unpublished_at,
      updated_at: new Date().toISOString(),
      version: newVersion
    })
    .eq('id', playlistId)
    .select()
    .single();

  if (updateError) {
    console.error('Error restoring playlist version:', updateError);
    throw updateError;
  }

  // Create a new version record for the restoration
  await supabase
    .from('playlist_versions')
    .insert([{
      playlist_id: playlistId,
      version: newVersion,
      timestamp: new Date().toISOString(),
      changed_by_user_id: version.changed_by_user_id,
      name: version.name,
      description: version.description,
      mundo_id: version.mundo_id,
      order_index: version.order_index,
      is_active: version.is_active,
      published_at: version.published_at,
      unpublished_at: version.unpublished_at,
      restored_from_version: versionId
    }]);

  return updatedPlaylist;
}; 