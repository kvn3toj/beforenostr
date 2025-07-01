export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  roles: string[];
  permissions: string[];
} 