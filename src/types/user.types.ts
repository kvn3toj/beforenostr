export interface Role {
  id: string;
  name: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export type AvailablePermission = string;
export type AvailablePermissionsList = AvailablePermission[];

export interface User {
  id: string;
  email: string;
  role_id: string;
  role: Role; // This comes from the join in the query
  created_at: string;
  updated_at: string;
  last_login: string | null;
  is_active: boolean;
}

// Types for CRUD operations
export type CreateUserData = Omit<User, 'id' | 'created_at' | 'updated_at' | 'last_login' | 'role'> & {
  password: string; // Required for user creation
};

export type UpdateUserData = Partial<Omit<User, 'id' | 'created_at' | 'updated_at' | 'last_login' | 'role'>> & {
  password?: string; // Optional for updates
}; 