import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js.js';
import {
  CreateNotificationDto,
  CreateBulkNotificationDto,
  UpdateNotificationDto,
  NotificationFilterDto,
  NotificationType,
} from './dto/notifications.dto.js.js';
import type { Notification } from '../generated/prisma.js.js.js';

@Injectable()
export class NotificationsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
    // //     console.log('>>> NotificationsService CONSTRUCTOR: this.prisma IS', this.prisma ? 'DEFINED' : 'UNDEFINED');
  }

  /**
   * Crear una notificación individual
   */
  async createNotification(dto: CreateNotificationDto): Promise<Notification> {
    //     console.log('>>> NotificationsService.createNotification: Creating notification', dto);

    // Verificar que el usuario existe
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const notification = await this.prisma.notification.create({
      data: {
        userId: dto.userId,
        type: dto.type,
        message: dto.message,
        read: false,
      },
    });

    // Aquí se podría integrar con un servicio de push notifications real
    await this.sendPushNotification(notification);

    return notification;
  }

  /**
   * Crear notificaciones en lote para múltiples usuarios
   */
  async createBulkNotifications(dto: CreateBulkNotificationDto) {
    //     console.log('>>> NotificationsService.createBulkNotifications: Creating bulk notifications', dto);

    // Verificar que todos los usuarios existen
    const users = await this.prisma.user.findMany({
      where: { id: { in: dto.userIds } },
    });

    if (users.length !== dto.userIds.length) {
      throw new NotFoundException('Algunos usuarios no fueron encontrados');
    }

    const notifications = await this.prisma.notification.createMany({
      data: dto.userIds.map((userId) => ({
        userId,
        type: dto.type,
        message: dto.message,
        read: false,
      })),
    });

    // Enviar push notifications en lote
    const createdNotifications = await this.prisma.notification.findMany({
      where: {
        userId: { in: dto.userIds },
        type: dto.type,
        message: dto.message,
      },
      orderBy: { createdAt: 'desc' },
      take: dto.userIds.length,
    });

    await Promise.all(
      createdNotifications.map((notification) =>
        this.sendPushNotification(notification)
      )
    );

    return {
      message: `Se crearon ${notifications.count} notificaciones`,
      count: notifications.count,
    };
  }

  /**
   * Obtener notificaciones de un usuario con filtros
   */
  async getUserNotifications(userId: string, filters: NotificationFilterDto) {
    //     console.log('>>> NotificationsService.getUserNotifications: Getting notifications for user', userId);

    const limit = filters.limit ? parseInt(filters.limit, 10) : 50;
    const offset = filters.offset ? parseInt(filters.offset, 10) : 0;

    const where: {
      userId: string;
      type?: NotificationType;
      read?: boolean;
    } = { userId };

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.read !== undefined) {
      where.read = filters.read;
    }

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      notifications,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    };
  }

  /**
   * Marcar notificación como leída
   */
  async markAsRead(notificationId: string, userId: string) {
    //     console.log('>>> NotificationsService.markAsRead: Marking notification as read', notificationId);

    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notificación no encontrada');
    }

    return await this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }

  /**
   * Marcar todas las notificaciones de un usuario como leídas
   */
  async markAllAsRead(userId: string) {
    //     console.log('>>> NotificationsService.markAllAsRead: Marking all notifications as read for user', userId);

    const result = await this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });

    return {
      message: `Se marcaron ${result.count} notificaciones como leídas`,
      count: result.count,
    };
  }

  /**
   * Obtener conteo de notificaciones no leídas
   */
  async getUnreadCount(userId: string) {
    //     console.log('>>> NotificationsService.getUnreadCount: Getting unread count for user', userId);

    const count = await this.prisma.notification.count({
      where: { userId, read: false },
    });

    return { unreadCount: count };
  }

  /**
   * Eliminar notificación
   */
  async deleteNotification(notificationId: string, userId: string) {
    //     console.log('>>> NotificationsService.deleteNotification: Deleting notification', notificationId);

    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notificación no encontrada');
    }

    await this.prisma.notification.delete({
      where: { id: notificationId },
    });

    return { message: 'Notificación eliminada exitosamente' };
  }

  /**
   * Crear notificación automática para méritos otorgados
   */
  async notifyMeritAwarded(
    userId: string,
    meritType: string,
    amount: number,
    source: string
  ) {
    //     console.log('>>> NotificationsService.notifyMeritAwarded: Creating merit notification', { userId, meritType, amount });

    const message = `¡Has recibido ${amount} ${meritType}! Fuente: ${source}`;

    return await this.createNotification({
      userId,
      type: NotificationType.MERIT_AWARDED,
      message,
      metadata: { meritType, amount, source },
    });
  }

  /**
   * Crear notificación automática para transacciones completadas
   */
  async notifyTransactionCompleted(
    userId: string,
    transactionType: string,
    amount: number,
    isIncoming: boolean
  ) {
    //     console.log('>>> NotificationsService.notifyTransactionCompleted: Creating transaction notification', { userId, transactionType, amount });

    const direction = isIncoming ? 'recibido' : 'enviado';
    const message = `Transacción completada: ${direction} ${amount} ${transactionType}`;

    return await this.createNotification({
      userId,
      type: NotificationType.TRANSACTION_COMPLETED,
      message,
      metadata: { transactionType, amount, direction },
    });
  }

  /**
   * Crear notificación automática para tokens próximos a caducar
   */
  async notifyTokenExpiry(
    userId: string,
    tokenType: string,
    amount: number,
    daysToExpiry: number
  ) {
    //     console.log('>>> NotificationsService.notifyTokenExpiry: Creating token expiry notification', { userId, tokenType, amount });

    const message = `¡Atención! Tienes ${amount} ${tokenType} que caducarán en ${daysToExpiry} días`;

    return await this.createNotification({
      userId,
      type: NotificationType.TOKEN_EXPIRY_WARNING,
      message,
      metadata: { tokenType, amount, daysToExpiry },
    });
  }

  /**
   * Crear notificación automática para invitaciones a grupos
   */
  async notifyGroupInvitation(
    userId: string,
    groupName: string,
    inviterName: string
  ) {
    //     console.log('>>> NotificationsService.notifyGroupInvitation: Creating group invitation notification', { userId, groupName });

    const message = `${inviterName} te ha invitado a unirte al grupo "${groupName}"`;

    return await this.createNotification({
      userId,
      type: NotificationType.GROUP_INVITATION,
      message,
      metadata: { groupName, inviterName },
    });
  }

  /**
   * Simular envío de push notification (aquí se integraría con un servicio real)
   */
  private async sendPushNotification(notification: Notification) {
    // console.log('>>> NotificationsService.sendPushNotification: Sending push notification', {
    //   userId: notification.userId,
    //   type: notification.type,
    //   message: notification.message
    // });

    // Aquí se integraría con servicios como:
    // - Firebase Cloud Messaging (FCM)
    // - Apple Push Notification Service (APNs)
    // - OneSignal
    // - Pusher
    // etc.

    // Por ahora, solo simulamos el envío
    return Promise.resolve();
  }

  /**
   * Limpiar notificaciones antiguas (más de 30 días)
   */
  async cleanupOldNotifications() {
    //     console.log('>>> NotificationsService.cleanupOldNotifications: Cleaning up old notifications');

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await this.prisma.notification.deleteMany({
      where: {
        createdAt: { lt: thirtyDaysAgo },
        read: true,
      },
    });

    return {
      message: `Se eliminaron ${result.count} notificaciones antiguas`,
      count: result.count,
    };
  }
}
