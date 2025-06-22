import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudyRoomDto } from './dto/create-study-room.dto';
import {
  StudyRoomResponseDto,
  StudyRoomParticipantDto,
} from './dto/study-room-response.dto';
import { StudyRoomStatus, StudyRoom, User } from '../generated/prisma';

type StudyRoomWithRelations = StudyRoom & {
  video: { id: number; title: string };
  host: { id: string; name: string; avatarUrl: string };
  participants: ({
    user: { id: string; name: string; avatarUrl: string };
  } & {
    id: string;
    studyRoomId: string;
    userId: string;
    isHost: boolean;
    isActive: boolean;
    joinedAt: Date;
    leftAt: Date | null;
  })[];
};

@Injectable()
export class StudyRoomsService {
  private readonly logger = new Logger(StudyRoomsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createStudyRoom(
    hostId: string,
    createStudyRoomDto: CreateStudyRoomDto
  ): Promise<StudyRoomResponseDto> {
    this.logger.log(
      `Creating study room for host ${hostId} with video ${createStudyRoomDto.videoId}`
    );

    try {
      // Verificar que el video existe
      const videoExists = await this.prisma.videoItem.findUnique({
        where: { id: parseInt(createStudyRoomDto.videoId) },
        select: { id: true, title: true },
      });

      if (!videoExists) {
        throw new NotFoundException(
          `Video con ID ${createStudyRoomDto.videoId} no encontrado`
        );
      }

      // Crear la sala de estudio
      const studyRoom = await this.prisma.studyRoom.create({
        data: {
          name: createStudyRoomDto.name,
          description: createStudyRoomDto.description,
          videoId: parseInt(createStudyRoomDto.videoId),
          hostId,
          maxParticipants: createStudyRoomDto.maxParticipants || 10,
          status: StudyRoomStatus.ACTIVE,
          currentTime: 0,
          isPaused: false,
        },
        include: {
          video: {
            select: { id: true, title: true },
          },
          host: {
            select: { id: true, name: true, avatarUrl: true },
          },
          participants: {
            include: {
              user: {
                select: { id: true, name: true, avatarUrl: true },
              },
            },
          },
        },
      });

      // Agregar el host como participante
      await this.prisma.studyRoomParticipant.create({
        data: {
          studyRoomId: studyRoom.id,
          userId: hostId,
          isHost: true,
        },
      });

      // Crear mensaje de sistema de bienvenida
      await this.prisma.studyRoomMessage.create({
        data: {
          studyRoomId: studyRoom.id,
          userId: hostId,
          message: `¡Bienvenidos a la sala de estudio "${studyRoom.name}"! 🎓`,
          messageType: 'SYSTEM',
        },
      });

      this.logger.log(`Study room ${studyRoom.id} created successfully`);
      return this.mapToStudyRoomResponse(studyRoom as StudyRoomWithRelations);
    } catch (error) {
      this.logger.error(`Failed to create study room: ${error.message}`);
      throw error;
    }
  }

  async getAllStudyRooms(
    page: number = 1,
    limit: number = 10
  ): Promise<{ rooms: StudyRoomResponseDto[]; total: number }> {
    this.logger.log(`Fetching study rooms - page: ${page}, limit: ${limit}`);

    const [rooms, total] = await Promise.all([
      this.prisma.studyRoom.findMany({
        where: { isActive: true },
        include: {
          video: { select: { id: true, title: true } },
          host: { select: { id: true, name: true, avatarUrl: true } },
          participants: {
            where: { isActive: true },
            include: {
              user: { select: { id: true, name: true, avatarUrl: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.studyRoom.count({
        where: { isActive: true },
      }),
    ]);

    const mappedRooms = rooms.map((room) =>
      this.mapToStudyRoomResponse(room as StudyRoomWithRelations)
    );

    this.logger.log(
      `Found ${total} study rooms, returning ${mappedRooms.length} for current page`
    );
    return { rooms: mappedRooms, total };
  }

  async getStudyRoomById(roomId: string): Promise<StudyRoomResponseDto> {
    this.logger.log(`Fetching study room ${roomId}`);

    const room = await this.prisma.studyRoom.findUnique({
      where: { id: roomId },
      include: {
        video: { select: { id: true, title: true } },
        host: { select: { id: true, name: true, avatarUrl: true } },
        participants: {
          where: { isActive: true },
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
      },
    });

    if (!room) {
      throw new NotFoundException(`Sala de estudio ${roomId} no encontrada`);
    }

    return this.mapToStudyRoomResponse(room as StudyRoomWithRelations);
  }

  async joinStudyRoom(
    roomId: string,
    userId: string
  ): Promise<StudyRoomResponseDto> {
    this.logger.log(`User ${userId} attempting to join study room ${roomId}`);

    // Verificar que la sala existe y está activa
    const room = await this.prisma.studyRoom.findUnique({
      where: { id: roomId, isActive: true },
      include: {
        participants: {
          where: { isActive: true },
        },
      },
    });

    if (!room) {
      throw new NotFoundException(
        `Sala de estudio ${roomId} no encontrada o no activa`
      );
    }

    // Verificar capacidad
    if (room.participants.length >= room.maxParticipants) {
      throw new BadRequestException('La sala ha alcanzado su capacidad máxima');
    }

    // Verificar si el usuario ya está en la sala
    const existingParticipant =
      await this.prisma.studyRoomParticipant.findUnique({
        where: {
          studyRoomId_userId: {
            studyRoomId: roomId,
            userId,
          },
        },
      });

    if (existingParticipant) {
      if (existingParticipant.isActive) {
        throw new BadRequestException('Ya estás en esta sala de estudio');
      } else {
        // Reactivar participación
        await this.prisma.studyRoomParticipant.update({
          where: { id: existingParticipant.id },
          data: { isActive: true, leftAt: null },
        });
      }
    } else {
      // Crear nueva participación
      await this.prisma.studyRoomParticipant.create({
        data: {
          studyRoomId: roomId,
          userId,
          isHost: false,
        },
      });
    }

    // Crear mensaje de sistema
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    await this.prisma.studyRoomMessage.create({
      data: {
        studyRoomId: roomId,
        userId,
        message: `${user?.name || 'Usuario'} se ha unido a la sala 👋`,
        messageType: 'SYSTEM',
      },
    });

    this.logger.log(`User ${userId} joined study room ${roomId} successfully`);
    return this.getStudyRoomById(roomId);
  }

  async leaveStudyRoom(roomId: string, userId: string): Promise<void> {
    this.logger.log(`User ${userId} leaving study room ${roomId}`);

    const participant = await this.prisma.studyRoomParticipant.findUnique({
      where: {
        studyRoomId_userId: {
          studyRoomId: roomId,
          userId,
        },
      },
    });

    if (!participant || !participant.isActive) {
      throw new NotFoundException('No estás en esta sala de estudio');
    }

    // Marcar como inactivo y registrar tiempo de salida
    await this.prisma.studyRoomParticipant.update({
      where: { id: participant.id },
      data: {
        isActive: false,
        leftAt: new Date(),
      },
    });

    // Crear mensaje de sistema
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    await this.prisma.studyRoomMessage.create({
      data: {
        studyRoomId: roomId,
        userId,
        message: `${user?.name || 'Usuario'} ha salido de la sala 👋`,
        messageType: 'SYSTEM',
      },
    });

    // Si era el host, transferir ownership al siguiente participante
    if (participant.isHost) {
      const nextHost = await this.prisma.studyRoomParticipant.findFirst({
        where: {
          studyRoomId: roomId,
          isActive: true,
          userId: { not: userId },
        },
        orderBy: { joinedAt: 'asc' },
      });

      if (nextHost) {
        await this.prisma.studyRoomParticipant.update({
          where: { id: nextHost.id },
          data: { isHost: true },
        });

        await this.prisma.studyRoom.update({
          where: { id: roomId },
          data: { hostId: nextHost.userId },
        });

        // Mensaje de nuevo host
        const newHostUser = await this.prisma.user.findUnique({
          where: { id: nextHost.userId },
          select: { name: true },
        });

        await this.prisma.studyRoomMessage.create({
          data: {
            studyRoomId: roomId,
            userId: nextHost.userId,
            message: `${newHostUser?.name || 'Usuario'} es ahora el host de la sala 👑`,
            messageType: 'SYSTEM',
          },
        });
      } else {
        // No hay más participantes, desactivar la sala
        await this.prisma.studyRoom.update({
          where: { id: roomId },
          data: {
            isActive: false,
            status: StudyRoomStatus.ENDED,
          },
        });
      }
    }

    this.logger.log(`User ${userId} left study room ${roomId} successfully`);
  }

  async updateVideoSync(
    roomId: string,
    userId: string,
    currentTime: number,
    isPaused: boolean
  ): Promise<void> {
    this.logger.log(
      `Updating video sync for room ${roomId}: time=${currentTime}, paused=${isPaused}`
    );

    // Verificar que el usuario es host o participante activo
    const participant = await this.prisma.studyRoomParticipant.findUnique({
      where: {
        studyRoomId_userId: {
          studyRoomId: roomId,
          userId,
        },
      },
    });

    if (!participant || !participant.isActive) {
      throw new ForbiddenException(
        'No tienes permisos para controlar la reproducción'
      );
    }

    // Solo el host puede controlar la reproducción por defecto
    if (!participant.isHost) {
      throw new ForbiddenException(
        'Solo el host puede controlar la reproducción'
      );
    }

    // Actualizar estado de reproducción
    await this.prisma.studyRoom.update({
      where: { id: roomId },
      data: {
        currentTime,
        isPaused,
        updatedAt: new Date(),
      },
    });

    // Crear mensaje de evento de video
    const eventType = isPaused ? 'pausó' : 'reprodujo';
    await this.prisma.studyRoomMessage.create({
      data: {
        studyRoomId: roomId,
        userId,
        message: `Video ${eventType} en ${Math.floor(currentTime)}s`,
        messageType: 'VIDEO_EVENT',
        metadata: JSON.stringify({ currentTime, isPaused }),
      },
    });

    this.logger.log(`Video sync updated for room ${roomId}`);
  }

  async deleteStudyRoom(roomId: string, userId: string): Promise<void> {
    this.logger.log(`User ${userId} attempting to delete study room ${roomId}`);

    const room = await this.prisma.studyRoom.findUnique({
      where: { id: roomId },
      select: { hostId: true },
    });

    if (!room) {
      throw new NotFoundException(`Sala de estudio ${roomId} no encontrada`);
    }

    if (room.hostId !== userId) {
      throw new ForbiddenException('Solo el host puede eliminar la sala');
    }

    // Soft delete: marcar como inactiva
    await this.prisma.studyRoom.update({
      where: { id: roomId },
      data: {
        isActive: false,
        status: StudyRoomStatus.ENDED,
      },
    });

    // Desactivar todos los participantes
    await this.prisma.studyRoomParticipant.updateMany({
      where: { studyRoomId: roomId },
      data: {
        isActive: false,
        leftAt: new Date(),
      },
    });

    this.logger.log(`Study room ${roomId} deleted successfully`);
  }

  private mapToStudyRoomResponse(
    room: StudyRoomWithRelations
  ): StudyRoomResponseDto {
    const participants: StudyRoomParticipantDto[] = room.participants.map(
      (p) => ({
        id: p.user.id,
        name: p.user.name || 'Usuario',
        avatarUrl: p.user.avatarUrl,
        isHost: p.isHost,
        joinedAt: p.joinedAt,
      })
    );

    return {
      id: room.id,
      name: room.name,
      description: room.description,
      videoId: room.videoId.toString(),
      videoTitle: room.video?.title,
      hostId: room.hostId,
      maxParticipants: room.maxParticipants,
      currentParticipants: participants.length,
      status: room.status,
      currentTime: room.currentTime,
      isPaused: room.isPaused,
      participants,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
    };
  }
}
