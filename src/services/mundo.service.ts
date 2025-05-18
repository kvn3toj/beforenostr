import { supabase } from './supabaseClient';
import { Mundo, CreateMundoData, UpdateMundoData, MundoVersion } from '../types/mundo.types';
import { useAuthStore } from '../store/authStore';

export interface FetchMundosParams {
  page: number; // 0-indexed
  pageSize: number;
  sortBy: string | null;
  sortDirection: 'asc' | 'desc' | null;
  filters: {
    name?: string;
    is_active?: boolean;
  };
}

export const fetchMundos = async (params: FetchMundosParams): Promise<{ data: Mundo[]; count: number }> => {
  let query = supabase
    .from('mundos')
    .select('*', { count: 'exact' });

  // Aplicar filtrado
  if (params.filters.name) {
    query = query.ilike('name', `%${params.filters.name}%`);
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
    console.error('Error fetching mundos:', error);
    throw error;
  }

  return { data: data || [], count: count ?? 0 };
};

export const createMundo = async (data: CreateMundoData, userId: string): Promise<Mundo> => {
  const { data: newMundo, error } = await supabase
    .from('mundos')
    .insert([{
      ...data,
      created_by: userId,
      published_at: data.published_at,
      unpublished_at: data.unpublished_at,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating mundo:', error);
    throw error;
  }

  return newMundo;
};

export const fetchMundoVersions = async (mundoId: string): Promise<MundoVersion[]> => {
  const { data, error } = await supabase
    .from('mundo_versions')
    .select('*')
    .eq('mundo_id', mundoId)
    .order('version', { ascending: false });

  if (error) {
    console.error('Error fetching mundo versions:', error);
    throw error;
  }

  return data || [];
};

export const createMundoVersion = async (
  mundoId: string,
  mundoData: Mundo,
  userId: string
): Promise<MundoVersion> => {
  // Get the current version number
  const { data: currentVersion } = await supabase
    .from('mundos')
    .select('version')
    .eq('id', mundoId)
    .single();

  const newVersion = (currentVersion?.version || 0) + 1;

  // Create the version record
  const { data, error } = await supabase
    .from('mundo_versions')
    .insert([{
      mundo_id: mundoId,
      version: newVersion,
      timestamp: new Date().toISOString(),
      changed_by_user_id: userId,
      name: mundoData.name,
      description: mundoData.description,
      thumbnail_url: mundoData.thumbnail_url,
      is_active: mundoData.is_active,
      published_at: mundoData.published_at,
      unpublished_at: mundoData.unpublished_at,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating mundo version:', error);
    throw error;
  }

  // Update the version number in the main mundo
  await supabase
    .from('mundos')
    .update({ version: newVersion })
    .eq('id', mundoId);

  return data;
};

export const updateMundo = async (
  id: string,
  data: UpdateMundoData,
  userId: string
): Promise<Mundo> => {
  // First, get the current mundo data
  const { data: currentMundo, error: fetchError } = await supabase
    .from('mundos')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('Error fetching current mundo:', fetchError);
    throw fetchError;
  }

  // Update the mundo
  const { data: updatedMundo, error: updateError } = await supabase
    .from('mundos')
    .update({
      ...data,
      published_at: data.published_at,
      unpublished_at: data.unpublished_at,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    console.error('Error updating mundo:', updateError);
    throw updateError;
  }

  // Create a new version
  await createMundoVersion(id, updatedMundo, userId);

  return updatedMundo;
};

export const deleteMundo = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('mundos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting mundo:', error);
    throw error;
  }
};

export const restoreMundoVersion = async (
  mundoId: string,
  versionId: string
): Promise<Mundo> => {
  // First, get the version data
  const { data: version, error: versionError } = await supabase
    .from('mundo_versions')
    .select('*')
    .eq('id', versionId)
    .single();

  if (versionError) {
    console.error('Error fetching mundo version:', versionError);
    throw versionError;
  }

  // Get the current version number
  const { data: currentVersion } = await supabase
    .from('mundos')
    .select('version')
    .eq('id', mundoId)
    .single();

  const newVersion = (currentVersion?.version || 0) + 1;

  // Update the mundo with the version data
  const { data: updatedMundo, error: updateError } = await supabase
    .from('mundos')
    .update({
      name: version.name,
      description: version.description,
      thumbnail_url: version.thumbnail_url,
      is_active: version.is_active,
      published_at: version.published_at,
      unpublished_at: version.unpublished_at,
      updated_at: new Date().toISOString(),
      version: newVersion
    })
    .eq('id', mundoId)
    .select()
    .single();

  if (updateError) {
    console.error('Error restoring mundo version:', updateError);
    throw updateError;
  }

  // Create a new version record for the restoration
  await supabase
    .from('mundo_versions')
    .insert([{
      mundo_id: mundoId,
      version: newVersion,
      timestamp: new Date().toISOString(),
      changed_by_user_id: version.changed_by_user_id,
      name: version.name,
      description: version.description,
      thumbnail_url: version.thumbnail_url,
      is_active: version.is_active,
      published_at: version.published_at,
      unpublished_at: version.unpublished_at,
      restored_from_version: versionId
    }]);

  return updatedMundo;
};

export const fetchMundoById = async (id: string): Promise<Mundo> => {
  const { data, error } = await supabase
    .from('mundos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching mundo by ID:', error);
    throw error;
  }

  return data;
}; 