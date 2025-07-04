export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions:
    | string[]
    | Array<{ id: string; name: string; description?: string }>;
  createdAt: string;
  updatedAt: string;
}

export type AvailablePermission = string;
export type AvailablePermissionsList = AvailablePermission[];

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
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
  avatarUrl?: string;
  isActive?: boolean;
};

export type UpdateUserData = {
  name?: string;
  avatarUrl?: string;
  isActive?: boolean;
};

export interface UserAuditSnapshot {
  id: string;
  email: string;
  name?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
