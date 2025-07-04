/**
 * 🔔 Notifications Service - Real Backend Integration
 *
 * Servicio de notificaciones que se conecta exclusivamente al backend NestJS real.
 * Maneja la funcionalidad completa de notificaciones del usuario con datos reales.
 */

import { apiService } from '../lib/api-service';

// 🏷️ Tipos para el servicio de notificaciones
export interface UserNotification {
  id: string;
  title: string;
  message: string;
  type: 'CHALLENGE_ALERT' | 'MERIT_AWARDED' | 'MARKETPLACE_UPDATE' | 'GROUP_INVITATION' | 'SYSTEM_ANNOUNCEMENT';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  isRead: boolean;
  isStarred: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: {
    imageUrl?: string;
    actionText?: string;
    relatedEntityId?: string;
  };
}

export interface NotificationFilters {
  type?: string;
  priority?: string;
  isRead?: boolean;
  isStarred?: boolean;
  limit?: number;
  offset?: number;
}

export interface NotificationResponse {
  notifications: UserNotification[];
  total: number;
  unreadCount: number;
  starredCount: number;
}

/**
 * 🔔 Servicio de Notificaciones - Backend Real
 *
 * Todas las funciones se conectan directamente al backend NestJS.
 * Implementa gestión completa de notificaciones con datos reales.
 */
class NotificationsService {
  /**
   * 📋 Obtener notificaciones del usuario
   */
  async getUserNotifications(userId: string, filters: NotificationFilters = {}): Promise<NotificationResponse> {
    try {
      console.log('📋 [NotificationsService] Fetching user notifications:', filters);

      // Construir query params
      const queryParams = new URLSearchParams();
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.priority) queryParams.append('priority', filters.priority);
      if (filters.isRead !== undefined) queryParams.append('read', filters.isRead.toString());
      if (filters.isStarred !== undefined) queryParams.append('isStarred', filters.isStarred.toString());
      if (filters.limit) queryParams.append('limit', filters.limit.toString());
      if (filters.offset) queryParams.append('offset', filters.offset.toString());

      // Usar el endpoint correcto del backend
      const endpoint = `/notifications/user/${userId}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await apiService.get<NotificationResponse>(endpoint);

      console.log('✅ [NotificationsService] Notifications fetched successfully:', response);
      return response ?? { notifications: [], total: 0, unreadCount: 0, starredCount: 0 };
    } catch (error: any) {
      console.error('❌ [NotificationsService] Failed to fetch notifications:', error);

      // Si hay error, devolver estructura vacía para evitar fallos en UI
      if (error.statusCode === 404) {
        return {
          notifications: [],
          total: 0,
          unreadCount: 0,
          starredCount: 0,
        };
      }

      throw new Error(error.message || 'Error al cargar las notificaciones');
    }
  }

  /**
   * ✓ Marcar notificación como leída
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      console.log('✓ [NotificationsService] Marking notification as read:', notificationId);

      await apiService.patch(`/notifications/${notificationId}/read`);

      console.log('✅ [NotificationsService] Notification marked as read successfully');
    } catch (error: any) {
      console.error('❌ [NotificationsService] Failed to mark as read:', error);
      throw new Error(error.message || 'Error al marcar como leída');
    }
  }

  /**
   * ⭐ Cambiar estado de destacado
   */
  async toggleStar(notificationId: string): Promise<void> {
    try {
      console.log('⭐ [NotificationsService] Toggling star for notification:', notificationId);

      await apiService.patch(`/notifications/${notificationId}/star`);

      console.log('✅ [NotificationsService] Notification star toggled successfully');
    } catch (error: any) {
      console.error('❌ [NotificationsService] Failed to toggle star:', error);
      throw new Error(error.message || 'Error al cambiar destacado');
    }
  }

  /**
   * 🗑️ Eliminar notificación
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      console.log('🗑️ [NotificationsService] Deleting notification:', notificationId);

      await apiService.delete(`/notifications/${notificationId}`);

      console.log('✅ [NotificationsService] Notification deleted successfully');
    } catch (error: any) {
      console.error('❌ [NotificationsService] Failed to delete notification:', error);
      throw new Error(error.message || 'Error al eliminar notificación');
    }
  }

  /**
   * ✓✓ Marcar todas como leídas
   */
  async markAllAsRead(): Promise<void> {
    try {
      console.log('✓✓ [NotificationsService] Marking all notifications as read');

      await apiService.patch('/notifications/mark-all-read');

      console.log('✅ [NotificationsService] All notifications marked as read successfully');
    } catch (error: any) {
      console.error('❌ [NotificationsService] Failed to mark all as read:', error);
      throw new Error(error.message || 'Error al marcar todas como leídas');
    }
  }

  /**
   * 📊 Obtener estadísticas de notificaciones
   */
  async getNotificationStats(): Promise<{
    total: number;
    unread: number;
    starred: number;
    byType: Record<string, number>;
    byPriority: Record<string, number>;
  }> {
    try {
      console.log('📊 [NotificationsService] Fetching notification stats');

      const response = await apiService.get('/notifications/stats');

      console.log('✅ [NotificationsService] Stats fetched successfully:', response);
      return response;
    } catch (error: any) {
      console.error('❌ [NotificationsService] Failed to fetch stats:', error);

      // Devolver estadísticas vacías en caso de error
      return {
        total: 0,
        unread: 0,
        starred: 0,
        byType: {},
        byPriority: {},
      };
    }
  }

  /**
   * 🔔 Crear nueva notificación (para testing/admin)
   */
  async createNotification(notification: Omit<UserNotification, 'id' | 'createdAt'>): Promise<UserNotification> {
    try {
      console.log('🔔 [NotificationsService] Creating notification:', notification);

      const response = await apiService.post<UserNotification>('/notifications', notification);

      console.log('✅ [NotificationsService] Notification created successfully:', response);
      return response;
    } catch (error: any) {
      console.error('❌ [NotificationsService] Failed to create notification:', error);
      throw new Error(error.message || 'Error al crear notificación');
    }
  }

  /**
   * 🔄 Actualizar configuración de notificaciones
   */
  async updateNotificationSettings(settings: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    challengeAlerts?: boolean;
    meritAwards?: boolean;
    marketplaceUpdates?: boolean;
    groupInvitations?: boolean;
    systemAnnouncements?: boolean;
  }): Promise<void> {
    try {
      console.log('🔄 [NotificationsService] Updating notification settings:', settings);

      await apiService.put('/notifications/settings', settings);

      console.log('✅ [NotificationsService] Settings updated successfully');
    } catch (error: any) {
      console.error('❌ [NotificationsService] Failed to update settings:', error);
      throw new Error(error.message || 'Error al actualizar configuración');
    }
  }

  /**
   * 📱 Obtener configuración de notificaciones
   */
  async getNotificationSettings(): Promise<{
    emailNotifications: boolean;
    pushNotifications: boolean;
    challengeAlerts: boolean;
    meritAwards: boolean;
    marketplaceUpdates: boolean;
    groupInvitations: boolean;
    systemAnnouncements: boolean;
  }> {
    try {
      console.log('📱 [NotificationsService] Fetching notification settings');

      const response = await apiService.get('/notifications/settings');

      console.log('✅ [NotificationsService] Settings fetched successfully:', response);
      return response;
    } catch (error: any) {
      console.error('❌ [NotificationsService] Failed to fetch settings:', error);

      // Devolver configuración por defecto en caso de error
      return {
        emailNotifications: true,
        pushNotifications: true,
        challengeAlerts: true,
        meritAwards: true,
        marketplaceUpdates: true,
        groupInvitations: true,
        systemAnnouncements: true,
      };
    }
  }
}

// 🔗 Exportar instancia única del servicio
export const notificationsService = new NotificationsService();
export default notificationsService;
