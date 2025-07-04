/**
 * 🎥 Video Permissions Types - Tipos para permisos de videos
 */

export interface VideoPermission {
  id: string;
  videoId: string;
  userId: string;
  permissionType: 'view' | 'edit' | 'delete' | 'share' | 'download';
  granted: boolean;
  grantedBy: string;
  grantedAt: string;
  expiresAt?: string;
}

export interface VideoPermissionCreateData {
  videoId: string;
  userId: string;
  permissionType: 'view' | 'edit' | 'delete' | 'share' | 'download';
  granted: boolean;
  expiresAt?: string;
}

export interface VideoPermissionUpdateData {
  granted?: boolean;
  expiresAt?: string;
}

export interface VideoAccessLevel {
  public: boolean;
  requiresLogin: boolean;
  allowedRoles: string[];
  allowedUsers: string[];
} 