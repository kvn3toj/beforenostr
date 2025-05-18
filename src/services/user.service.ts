import { supabase } from './supabaseClient';
import { User, CreateUserData, UpdateUserData } from '../types/user.types';

export interface FetchUsersParams {
  page: number; // 0-indexed
  pageSize: number;
  sortBy: string | null;
  sortDirection: 'asc' | 'desc' | null;
  filters: {
    email?: string;
    role_id?: string;
    is_active?: boolean;
  };
}

export const fetchUsers = async (params: FetchUsersParams): Promise<{ data: User[]; count: number }> => {
  let query = supabase
    .from('users')
    .select('*, role:role_id(*)', { count: 'exact' });

  // Aplicar filtrado
  if (params.filters.email) {
    query = query.ilike('email', `%${params.filters.email}%`);
  }
  if (params.filters.role_id) {
    query = query.eq('role_id', params.filters.role_id);
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
    console.error('Error fetching users:', error);
    throw new Error(`Error fetching users: ${error.message}`);
  }

  return { data: data as User[], count: count ?? 0 };
};

export const fetchUserById = async (id: string): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .select('*, role:role_id(*)')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }

  return data as User;
};

// Stub functions for future implementation
export const createUser = async (data: CreateUserData): Promise<User> => {
  const { data: newUser, error } = await supabase
    .from('users')
    .insert([data])
    .select('*, role:role_id(*)')
    .single();

  if (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }

  return newUser as User;
};

export const updateUser = async (id: string, data: UpdateUserData): Promise<User> => {
  const { data: updatedUser, error } = await supabase
    .from('users')
    .update(data)
    .eq('id', id)
    .select('*, role:role_id(*)')
    .single();

  if (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }

  return updatedUser as User;
};

export const deleteUser = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
}; 