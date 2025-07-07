import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import {
  CreateNotificationDto,
  CreateBulkNotificationDto,
  // UpdateNotificationDto, // Unused import
  NotificationFilterDto,
  NotificationType,
} from './dto/notifications.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/rbac/guards/roles.guard';
import { Roles } from '@/rbac/decorators/roles.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(
    @Inject(NotificationsService)
    private readonly notificationsService: NotificationsService
  ) {
    // //     console.log('>>> NotificationsController CONSTRUCTOR: this.notificationsService IS', this.notificationsService ? 'DEFINED' : 'UNDEFINED');
  }

  /**
   * Crear una notificación individual
   */
  @Post()
  @Roles('admin', 'user')
  async createNotification(@Body() dto: CreateNotificationDto) {
    //     console.log('>>> NotificationsController.createNotification: Creating notification', dto);
    return await this.notificationsService.createNotification(dto);
  }

  /**
   * Crear notificaciones en lote
   */
  @Post('bulk')
  @Roles('admin')
  async createBulkNotifications(@Body() dto: CreateBulkNotificationDto) {
    //     console.log('>>> NotificationsController.createBulkNotifications: Creating bulk notifications', dto);
    return await this.notificationsService.createBulkNotifications(dto);
  }

  /**
   * Obtener notificaciones de un usuario
   */
  @Get('user/:userId')
  @Roles('admin', 'user')
  async getUserNotifications(
    @Param('userId') userId: string,
    @Query('type') type?: string,
    @Query('read') read?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    //     console.log('>>> NotificationsController.getUserNotifications: Getting notifications for user', userId);

    const filters: NotificationFilterDto = {
      type: type as NotificationType,
      read: read ? read === 'true' : undefined,
      limit,
      offset,
    };

    return await this.notificationsService.getUserNotifications(
      userId,
      filters
    );
  }

  /**
   * Obtener conteo de notificaciones no leídas
   */
  @Get('user/:userId/unread-count')
  @Roles('admin', 'user')
  async getUnreadCount(@Param('userId') userId: string) {
    //     console.log('>>> NotificationsController.getUnreadCount: Getting unread count for user', userId);
    return await this.notificationsService.getUnreadCount(userId);
  }

  /**
   * Marcar notificación como leída
   */
  @Put(':notificationId/read')
  @Roles('admin', 'user')
  async markAsRead(
    @Param('notificationId') notificationId: string,
    @Query('userId') userId: string
  ) {
    //     console.log('>>> NotificationsController.markAsRead: Marking notification as read', notificationId);
    return await this.notificationsService.markAsRead(notificationId, userId);
  }

  /**
   * Marcar todas las notificaciones como leídas
   */
  @Put('user/:userId/mark-all-read')
  @Roles('admin', 'user')
  async markAllAsRead(@Param('userId') userId: string) {
    //     console.log('>>> NotificationsController.markAllAsRead: Marking all notifications as read for user', userId);
    return await this.notificationsService.markAllAsRead(userId);
  }

  /**
   * Eliminar notificación
   */
  @Delete(':notificationId')
  @Roles('admin', 'user')
  async deleteNotification(
    @Param('notificationId') notificationId: string,
    @Query('userId') userId: string
  ) {
    //     console.log('>>> NotificationsController.deleteNotification: Deleting notification', notificationId);
    return await this.notificationsService.deleteNotification(
      notificationId,
      userId
    );
  }

  /**
   * Limpiar notificaciones antiguas (solo admin)
   */
  @Post('cleanup')
  @Roles('admin')
  async cleanupOldNotifications() {
    //     console.log('>>> NotificationsController.cleanupOldNotifications: Cleaning up old notifications');
    return await this.notificationsService.cleanupOldNotifications();
  }

  /**
   * Endpoint de prueba para verificar conectividad
   */
  @Get('ping')
  async ping() {
    //     console.log('>>> NotificationsController.ping: Notifications module is working');
    return {
      message: 'Notifications module is working',
      timestamp: new Date().toISOString(),
      module: 'Notifications System',
    };
  }
}
