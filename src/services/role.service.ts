import { supabase } from './supabaseClient';
import { Role, AvailablePermissionsList } from '../types/user.types';
import { CreateRoleData } from '../components/features/roles/components/RoleForm';

export type UpdateRoleData = Pick<Role, 'name'>;

export interface FetchRolesParams {
  page: number; // 0-indexed
  pageSize: number;
  sortBy: string | null;
  sortDirection: 'asc' | 'desc' | null;
  filters: {
    name?: string;
  };
}

export const fetchRoles = async (params: FetchRolesParams): Promise<{ data: Role[]; count: number }> => {
  let query = supabase
    .from('roles')
    .select('*', { count: 'exact' });

  // Aplicar filtrado
  if (params.filters.name) {
    query = query.ilike('name', `%${params.filters.name}%`);
  }

  // Aplicar ordenamiento
  if (params.sortBy) {
    query = query.order(params.sortBy, { ascending: params.sortDirection === 'asc' });
  } else {
    // Ordenamiento por defecto si no se especifica sortBy
    query = query.order('name', { ascending: true });
  }

  // Aplicar paginación (range es inclusivo en ambos extremos)
  const start = params.page * params.pageSize;
  const end = start + params.pageSize - 1;
  query = query.range(start, end);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching roles:', error);
    throw new Error(`Error fetching roles: ${error.message}`);
  }

  return { data: data as Role[], count: count ?? 0 };
};

export const createRole = async (data: CreateRoleData): Promise<Role> => {
  const { data: newRole, error } = await supabase
    .from('roles')
    .insert([
      {
        name: data.name,
        permissions: [], // Start with empty permissions array
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating role:', error);
    throw new Error(`Error creating role: ${error.message}`);
  }

  return newRole as Role;
};

export const updateRole = async (id: string, data: UpdateRoleData): Promise<Role> => {
  const { data: updatedRole, error } = await supabase
    .from('roles')
    .update({ name: data.name })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating role:', error);
    throw new Error(`Error updating role: ${error.message}`);
  }

  return updatedRole as Role;
};

export const deleteRole = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('roles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting role:', error);
    throw new Error(`Error deleting role: ${error.message}`);
  }
};

export const fetchAvailablePermissions = async (): Promise<AvailablePermissionsList> => {
  const { data, error } = await supabase.rpc('get_available_permissions');

  if (error) {
    console.error('Error fetching available permissions:', error);
    throw new Error(`Error fetching available permissions: ${error.message}`);
  }

  if (!Array.isArray(data)) {
    throw new Error('Invalid response format from get_available_permissions');
  }

  return data;
};

export const updateRolePermissions = async (roleId: string, permissions: string[]): Promise<Role> => {
  const { data: updatedRole, error } = await supabase
    .from('roles')
    .update({ permissions })
    .eq('id', roleId)
    .select()
    .single();

  if (error) {
    console.error('Error updating role permissions:', error);
    throw new Error(`Error updating role permissions: ${error.message}`);
  }

  return updatedRole as Role;
}; 