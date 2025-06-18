import { apiService } from './api.service';
import { Role, AvailablePermissionsList } from '../types/user.types';
import { CreateRoleData } from '../components/features/roles/components/RoleForm';

// Configuración de URLs base
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1111';
const ROLES_ENDPOINT = `${API_BASE_URL}/roles`;
const PERMISSIONS_ENDPOINT = `${API_BASE_URL}/permissions`;

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

// ===== ROLES CRUD =====

export const fetchRoles = async (params: FetchRolesParams): Promise<{ data: Role[]; count: number }> => {
  try {
    // El backend actual no soporta paginación, así que obtenemos todos los roles
    // y aplicamos la paginación en el frontend
    const allRolesRaw = await apiService.get<any[]>('/roles');
    const allRoles = normalizeRoles(allRolesRaw);
    
    // Aplicar filtros
    let filteredRoles = allRoles;
    if (params.filters.name) {
      filteredRoles = allRoles.filter(role => 
        role.name.toLowerCase().includes(params.filters.name!.toLowerCase())
      );
    }
    
    // Aplicar ordenamiento
    if (params.sortBy) {
      filteredRoles.sort((a, b) => {
        const aValue = (a as any)[params.sortBy!];
        const bValue = (b as any)[params.sortBy!];
        const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return params.sortDirection === 'desc' ? -comparison : comparison;
      });
    }
    
    // Aplicar paginación
    const startIndex = params.page * params.pageSize;
    const endIndex = startIndex + params.pageSize;
    const paginatedRoles = filteredRoles.slice(startIndex, endIndex);
    
    return {
      data: paginatedRoles,
      count: filteredRoles.length
    };
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

export const fetchRoleById = async (id: string): Promise<Role> => {
  try {
    const roleRaw = await apiService.get<any>(`/roles/${id}`);
    return normalizeRole(roleRaw);
  } catch (error) {
    console.error('Error fetching role by ID:', error);
    throw error;
  }
};

export const createRole = async (data: CreateRoleData): Promise<Role> => {
  try {
    const roleRaw = await apiService.post<any>('/roles', {
      name: data.name,
    });
    return normalizeRole(roleRaw);
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

export const updateRole = async (id: string, data: UpdateRoleData): Promise<Role> => {
  try {
    const roleRaw = await apiService.put<any>(`/roles/${id}`, { 
      name: data.name 
    });
    return normalizeRole(roleRaw);
  } catch (error) {
    console.error('Error updating role:', error);
    throw error;
  }
};

export const deleteRole = async (id: string): Promise<void> => {
  try {
    await apiService.delete<void>(`/roles/${id}`);
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
};

// ===== PERMISSIONS =====

export const fetchAvailablePermissions = async (): Promise<AvailablePermissionsList> => {
  try {
    // El backend tiene GET /permissions que devuelve todos los permisos
    const permissions = await apiService.get<Array<{ id: string; name: string; description?: string }>>('/permissions');
    // Convertir a la estructura esperada por el frontend (array de strings)
    return permissions.map(permission => permission.name);
  } catch (error) {
    console.error('Error fetching available permissions:', error);
    throw error;
  }
};

// ===== ROLE PERMISSIONS MANAGEMENT =====

export const updateRolePermissions = async (roleId: string, permissions: string[]): Promise<Role> => {
  try {
    // Usar el endpoint de asignación de permisos del backend
    const roleRaw = await apiService.post<any>(`/roles/${roleId}/assign-permissions`, { 
      permissionIds: permissions 
    });
    return normalizeRole(roleRaw);
  } catch (error) {
    console.error('Error updating role permissions:', error);
    throw error;
  }
};

export const assignPermissionsToRole = async (roleId: string, permissionIds: string[]): Promise<Role> => {
  try {
    const roleRaw = await apiService.post<any>(`/roles/${roleId}/assign-permissions`, { 
      permissionIds 
    });
    return normalizeRole(roleRaw);
  } catch (error) {
    console.error('Error assigning permissions to role:', error);
    throw error;
  }
};

export const removePermissionsFromRole = async (roleId: string, permissionIds: string[]): Promise<Role> => {
  try {
    const roleRaw = await apiService.post<any>(`/roles/${roleId}/remove-permissions`, { 
      permissionIds 
    });
    return normalizeRole(roleRaw);
  } catch (error) {
    console.error('Error removing permissions from role:', error);
    throw error;
  }
};

// ===== USER ROLE ASSIGNMENT =====

export const assignRoleToUser = async (userId: string, roleId: string): Promise<void> => {
  try {
    await apiService.post<void>(`/roles/users/${userId}/assign-role`, { 
      roleId 
    });
  } catch (error) {
    console.error('Error assigning role to user:', error);
    throw error;
  }
};

export const removeRoleFromUser = async (userId: string, roleId: string): Promise<void> => {
  try {
    await apiService.delete<void>(`/roles/users/${userId}/roles/${roleId}`);
  } catch (error) {
    console.error('Error removing role from user:', error);
    throw error;
  }
};

// ===== UTILITY FUNCTIONS =====

// Función auxiliar para normalizar roles del backend
const normalizeRole = (role: any): Role => {
  return {
    ...role,
    permissions: Array.isArray(role.permissions) 
      ? role.permissions.map((p: any) => typeof p === 'string' ? p : p.name)
      : Array.isArray(role.rolePermissions)
      ? role.rolePermissions.map((rp: any) => rp.permission?.name || rp.permission)
      : []
  };
};

// Función auxiliar para normalizar array de roles
const normalizeRoles = (roles: any[]): Role[] => {
  return roles.map(normalizeRole);
}; 