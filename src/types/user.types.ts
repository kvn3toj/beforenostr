export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[] | Array<{ id: string; name: string; description?: string }>;
  createdAt: string;
  updatedAt: string;
}

export type AvailablePermission = string;
export type AvailablePermissionsList = AvailablePermission[];

export interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  phone?: string;
  country?: string;
  address?: string;
  avatarUrl?: string;
  isActive: boolean;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  roles?: Role[];
  primaryRole?: Role;
  role?: {
    id: string;
    name: string;
    permissions: string[];
  };
}

export type CreateUserData = {
  email: string;
  password: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  phone?: string;
  country?: string;
  address?: string;
  avatarUrl?: string;
  isActive?: boolean;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  roleId?: string;
};

export type UpdateUserData = {
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  phone?: string;
  country?: string;
  address?: string;
  avatarUrl?: string;
  isActive?: boolean;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  roleId?: string;
};

export interface UserAuditSnapshot {
  id: string;
  email: string;
  name?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
} 