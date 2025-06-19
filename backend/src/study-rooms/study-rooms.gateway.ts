import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { StudyRoomsService } from './study-rooms.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
  };
}

@WebSocketGateway({
  namespace: '/study-rooms',
  cors: {
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    credentials: true,
  },
})
export class StudyRoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(StudyRoomsGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly studyRoomsService: StudyRoomsService,
  ) {
    // ✅ DEBUGGING: Verificar que los servicios se inyecten correctamente
    this.logger.log('>>> StudyRoomsGateway constructor initialized');
    this.logger.log('>>> JwtService injected:', !!this.jwtService);
    this.logger.log('>>> PrismaService injected:', !!this.prisma);
    this.logger.log('>>> StudyRoomsService injected:', !!this.studyRoomsService);
    
    if (!this.jwtService) {
      this.logger.error('>>> CRITICAL: JwtService is undefined - WebSocket auth will fail');
    }
    if (!this.jwtService?.verify) {
      this.logger.error('>>> CRITICAL: JwtService.verify is undefined');
    }
  }

  async handleConnection(client: AuthenticatedSocket) {
    try {
      this.logger.log('>>> WebSocket connection attempt started');
      
      // ✅ DEBUGGING: Verificar servicios antes de usar
      if (!this.jwtService) {
        this.logger.error('>>> CRITICAL: JwtService is undefined during connection');
        client.disconnect();
        return;
      }
      
      if (!this.jwtService.verify) {
        this.logger.error('>>> CRITICAL: JwtService.verify method is undefined');
        client.disconnect();
        return;
      }

      // Extraer token JWT de la query o headers
      const token = client.handshake.auth?.token || client.handshake.query?.token;
      
      this.logger.log('>>> Token extraction attempt:', {
        hasAuthToken: !!client.handshake.auth?.token,
        hasQueryToken: !!client.handshake.query?.token,
        tokenPresent: !!token,
        tokenLength: token ? token.length : 0
      });
      
      if (!token) {
        this.logger.warn(`>>> WebSocket connection rejected: No token provided`);
        client.emit('auth-error', { message: 'Token de autenticación requerido' });
        client.disconnect();
        return;
      }

      this.logger.log('>>> Attempting JWT verification...');

      // Verificar y decodificar el token
      const payload = this.jwtService.verify(token);
      
      this.logger.log('>>> JWT verification successful:', {
        userId: payload.sub,
        email: payload.email,
        exp: payload.exp
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, name: true, email: true, isActive: true },
      });

      if (!user || !user.isActive) {
        this.logger.warn(`>>> WebSocket connection rejected: Invalid user ${payload.sub}`);
        client.emit('auth-error', { message: 'Usuario no válido o inactivo' });
        client.disconnect();
        return;
      }

      client.userId = user.id;
      client.user = user;

      this.logger.log(`>>> User ${user.name} (${user.id}) connected to study rooms WebSocket`);
      client.emit('connection-success', { message: 'Conectado al chat de salas de estudio', user });

    } catch (error) {
      this.logger.error(`>>> WebSocket authentication failed:`, {
        error: error.message,
        stack: error.stack,
        jwtServiceAvailable: !!this.jwtService,
        verifyMethodAvailable: !!this.jwtService?.verify
      });
      
      client.emit('auth-error', { 
        message: 'Error de autenticación',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.user) {
      this.logger.log(`User ${client.user.name} (${client.userId}) disconnected from study rooms WebSocket`);
    }
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string },
  ) {
    try {
      if (!client.userId) {
        throw new WsException('No autenticado');
      }

      const { roomId } = data;

      // Verificar que el usuario está en la sala
      const participant = await this.prisma.studyRoomParticipant.findUnique({
        where: {
          studyRoomId_userId: {
            studyRoomId: roomId,
            userId: client.userId,
          },
        },
      });

      if (!participant || !participant.isActive) {
        throw new WsException('No tienes acceso a esta sala');
      }

      // Unirse al room de Socket.IO
      await client.join(roomId);
      
      this.logger.log(`User ${client.user?.name} joined room ${roomId} via WebSocket`);

      // Notificar a otros participantes
      client.to(roomId).emit('user-joined-room', {
        userId: client.userId,
        userName: client.user?.name,
        timestamp: new Date(),
      });

      // Enviar confirmación al usuario
      client.emit('room-joined', {
        roomId,
        message: 'Te has unido al chat de la sala exitosamente',
      });

    } catch (error) {
      this.logger.error(`Error joining room: ${error.message}`);
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('leave-room')
  async handleLeaveRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string },
  ) {
    try {
      const { roomId } = data;

      await client.leave(roomId);
      
      this.logger.log(`User ${client.user?.name} left room ${roomId} via WebSocket`);

      // Notificar a otros participantes
      client.to(roomId).emit('user-left-room', {
        userId: client.userId,
        userName: client.user?.name,
        timestamp: new Date(),
      });

    } catch (error) {
      this.logger.error(`Error leaving room: ${error.message}`);
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string; message: string },
  ) {
    try {
      if (!client.userId) {
        throw new WsException('No autenticado');
      }

      const { roomId, message } = data;

      if (!message || message.trim().length === 0) {
        throw new WsException('El mensaje no puede estar vacío');
      }

      if (message.length > 1000) {
        throw new WsException('El mensaje es demasiado largo (máximo 1000 caracteres)');
      }

      // Verificar que el usuario está en la sala
      const participant = await this.prisma.studyRoomParticipant.findUnique({
        where: {
          studyRoomId_userId: {
            studyRoomId: roomId,
            userId: client.userId,
          },
        },
      });

      if (!participant || !participant.isActive) {
        throw new WsException('No tienes acceso a esta sala');
      }

      // Guardar mensaje en la base de datos
      const savedMessage = await this.prisma.studyRoomMessage.create({
        data: {
          studyRoomId: roomId,
          userId: client.userId,
          message: message.trim(),
          messageType: 'CHAT',
        },
        include: {
          user: {
            select: { id: true, name: true, avatarUrl: true },
          },
        },
      });

      // Construir objeto de mensaje para enviar
      const messagePayload = {
        id: savedMessage.id,
        message: savedMessage.message,
        messageType: savedMessage.messageType,
        createdAt: savedMessage.createdAt,
        user: {
          id: savedMessage.user.id,
          name: savedMessage.user.name || 'Usuario',
          avatarUrl: savedMessage.user.avatarUrl,
        },
      };

      // Enviar mensaje a todos los participantes de la sala (incluyendo el remitente)
      this.server.to(roomId).emit('new-message', messagePayload);

      this.logger.log(`Message sent in room ${roomId} by user ${client.user?.name}: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`);

    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`);
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('get-messages')
  async handleGetMessages(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string; page?: number; limit?: number },
  ) {
    try {
      if (!client.userId) {
        throw new WsException('No autenticado');
      }

      const { roomId, page = 1, limit = 50 } = data;

      // Verificar que el usuario está en la sala
      const participant = await this.prisma.studyRoomParticipant.findUnique({
        where: {
          studyRoomId_userId: {
            studyRoomId: roomId,
            userId: client.userId,
          },
        },
      });

      if (!participant || !participant.isActive) {
        throw new WsException('No tienes acceso a esta sala');
      }

      // Obtener mensajes de la sala
      const messages = await this.prisma.studyRoomMessage.findMany({
        where: { studyRoomId: roomId },
        include: {
          user: {
            select: { id: true, name: true, avatarUrl: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      });

      const formattedMessages = messages.reverse().map(msg => ({
        id: msg.id,
        message: msg.message,
        messageType: msg.messageType,
        createdAt: msg.createdAt,
        user: {
          id: msg.user.id,
          name: msg.user.name || 'Usuario',
          avatarUrl: msg.user.avatarUrl,
        },
      }));

      client.emit('messages-history', {
        roomId,
        messages: formattedMessages,
        page,
        hasMore: messages.length === limit,
      });

      this.logger.log(`Sent ${formattedMessages.length} messages to user ${client.user?.name} for room ${roomId}`);

    } catch (error) {
      this.logger.error(`Error getting messages: ${error.message}`);
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('video-sync')
  async handleVideoSync(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string; currentTime: number; isPaused: boolean },
  ) {
    try {
      if (!client.userId) {
        throw new WsException('No autenticado');
      }

      const { roomId, currentTime, isPaused } = data;

      // Verificar que el usuario es host de la sala
      const participant = await this.prisma.studyRoomParticipant.findUnique({
        where: {
          studyRoomId_userId: {
            studyRoomId: roomId,
            userId: client.userId,
          },
        },
      });

      if (!participant || !participant.isActive || !participant.isHost) {
        throw new WsException('Solo el host puede sincronizar el video');
      }

      // Actualizar estado en la base de datos
      await this.studyRoomsService.updateVideoSync(roomId, client.userId, currentTime, isPaused);

      // Emitir evento de sincronización a todos los participantes excepto el host
      client.to(roomId).emit('video-sync-update', {
        currentTime,
        isPaused,
        hostName: client.user?.name,
        timestamp: new Date(),
      });

      this.logger.log(`Video sync updated for room ${roomId}: time=${currentTime}, paused=${isPaused}`);

    } catch (error) {
      this.logger.error(`Error syncing video: ${error.message}`);
      client.emit('error', { message: error.message });
    }
  }

  // Método auxiliar para notificar eventos a una sala específica
  notifyRoom(roomId: string, event: string, data: any) {
    this.server.to(roomId).emit(event, data);
    this.logger.log(`Notified room ${roomId} with event: ${event}`);
  }
} 