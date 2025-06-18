/**
 * 🔐 Role Types - Tipos para roles y permisos
 */

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'admin';
  description?: string;
}

export interface RoleCreateData {
  name: string;
  description?: string;
  permissionIds: string[];
}

export interface RoleUpdateData {
  name?: string;
  description?: string;
  permissionIds?: string[];
}

export interface UserRoleAssignment {
  userId: string;
  roleId: string;
  assignedAt: string;
  assignedBy: string;
} 