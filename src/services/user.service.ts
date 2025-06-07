import { apiService } from './api.service';

// Interfaces aligned with backend DTOs
export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  // Role information if included in response
  role?: {
    id: string;
    name: string;
    permissions: string[];
  };
}

export interface CreateUserData {
  email: string;
  password: string;
  name?: string;
  avatarUrl?: string;
  isActive?: boolean;
}

export interface UpdateUserData {
  name?: string;
  avatarUrl?: string;
  isActive?: boolean;
  personalityId?: string;
}

export interface FetchUsersParams {
  page: number; // 0-indexed
  pageSize: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  filters?: {
    email?: string;
    role_id?: string;
    is_active?: boolean;
  };
}

export interface UsersResponse {
  data: User[];
  count: number;
  total: number;
  page: number;
  pageSize: number;
}

// Main user service functions
export const fetchUsers = async (params: FetchUsersParams): Promise<UsersResponse> => {
  try {
    const searchParams = new URLSearchParams();
    
    // Paginación
    searchParams.append('page', params.page.toString());
    searchParams.append('pageSize', params.pageSize.toString());
    
    // Ordenamiento
    if (params.sortBy) {
      searchParams.append('sortBy', params.sortBy);
      searchParams.append('sortDirection', params.sortDirection || 'asc');
    }
    
    // Filtros
    if (params.filters?.email) {
      searchParams.append('email', params.filters.email);
    }
    if (params.filters?.role_id) {
      searchParams.append('role_id', params.filters.role_id);
    }
    if (params.filters?.is_active !== undefined) {
      searchParams.append('is_active', params.filters.is_active.toString());
    }

    const response = await apiService.get<UsersResponse>(
      `/users?${searchParams.toString()}`
    );
    
    return response;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchUserById = async (id: string): Promise<User> => {
  try {
    return await apiService.get<User>(`/users/${id}`);
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
};

export const fetchCurrentUserProfile = async (): Promise<User> => {
  try {
    return await apiService.get<User>('/users/me');
  } catch (error) {
    console.error('Error fetching current user profile:', error);
    throw error;
  }
};

export const createUser = async (data: CreateUserData): Promise<User> => {
  try {
    const response = await apiService.post<{ user: User; access_token: string }>('/auth/register', data);
    return response.user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (id: string, data: UpdateUserData): Promise<User> => {
  try {
    return await apiService.patch<User>(`/users/${id}`, data);
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await apiService.delete<void>(`/users/${id}`);
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
};

// Admin-specific functions (if needed in the future)
export const fetchAllUsersAdmin = async (): Promise<User[]> => {
  try {
    return await apiService.get<User[]>('/admin/users');
  } catch (error) {
    console.error('Error fetching all users (admin):', error);
    throw error;
  }
};

// Role assignment functions (using the roles endpoints)
export const assignRoleToUser = async (userId: string, roleId: string): Promise<void> => {
  try {
    await apiService.post<void>(`/roles/users/${userId}/assign-role`, { roleId });
  } catch (error) {
    console.error(`Error assigning role ${roleId} to user ${userId}:`, error);
    throw error;
  }
};

export const removeRoleFromUser = async (userId: string, roleId: string): Promise<void> => {
  try {
    await apiService.delete<void>(`/roles/users/${userId}/roles/${roleId}`);
  } catch (error) {
    console.error(`Error removing role ${roleId} from user ${userId}:`, error);
    throw error;
  }
};

// Export a userService object for compatibility
export const userService = {
  fetchUsers,
  fetchUserById,
  fetchCurrentUserProfile,
  createUser,
  updateUser,
  deleteUser,
  fetchAllUsersAdmin,
  assignRoleToUser,
  removeRoleFromUser,
  // Alias for getUsers to match the NewInvitationPage import - Fixed to use correct endpoint
  getUsers: () => fetchUsers({ page: 0, pageSize: 100 }).then(response => response.data)
}; 