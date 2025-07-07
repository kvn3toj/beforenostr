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
  Request,
  Logger,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StudyRoomsService } from './study-rooms.service';
import { CreateStudyRoomDto } from './dto/create-study-room.dto';
// import { JoinStudyRoomDto } from './dto/join-study-room.dto'; // Unused import
import { StudyRoomResponseDto } from './dto/study-room-response.dto';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}

@ApiTags('Study Rooms - ÜPlay Social Collaboration')
@Controller('study-rooms')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StudyRoomsController {
  private readonly logger = new Logger(StudyRoomsController.name);

  constructor(private readonly studyRoomsService: StudyRoomsService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva sala de estudio',
    description:
      'Permite a un usuario crear una sala de estudio colaborativa para un video específico. El creador se convierte automáticamente en el host.',
  })
  @ApiResponse({
    status: 201,
    description: 'Sala de estudio creada exitosamente',
    type: StudyRoomResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Video no encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticación requerido',
  })
  async createStudyRoom(
    @Request() req: AuthenticatedRequest,
    @Body() createStudyRoomDto: CreateStudyRoomDto
  ): Promise<StudyRoomResponseDto> {
    this.logger.log(
      `Creating study room: ${createStudyRoomDto.name} for user ${req.user.id}`
    );
    return this.studyRoomsService.createStudyRoom(
      req.user.id,
      createStudyRoomDto
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las salas de estudio activas',
    description: 'Lista todas las salas de estudio disponibles con paginación',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número de página (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Elementos por página (default: 10)',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de salas de estudio obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        rooms: {
          type: 'array',
          items: { type: 'object' }, // Simplified to avoid circular reference
        },
        total: {
          type: 'number',
          description: 'Número total de salas',
        },
      },
    },
  })
  async getAllStudyRooms(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    this.logger.log(`Fetching study rooms - page: ${page}, limit: ${limit}`);
    return this.studyRoomsService.getAllStudyRooms(page, limit);
  }

  @Get(':roomId')
  @ApiOperation({
    summary: 'Obtener detalles de una sala de estudio específica',
    description:
      'Obtiene información detallada de una sala de estudio incluyendo participantes y estado del video',
  })
  @ApiParam({
    name: 'roomId',
    description: 'ID único de la sala de estudio',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles de la sala obtenidos exitosamente',
    type: StudyRoomResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Sala de estudio no encontrada',
  })
  async getStudyRoomById(
    @Param('roomId') roomId: string
  ): Promise<StudyRoomResponseDto> {
    this.logger.log(`Fetching study room details: ${roomId}`);
    return this.studyRoomsService.getStudyRoomById(roomId);
  }

  @Post(':roomId/join')
  @ApiOperation({
    summary: 'Unirse a una sala de estudio',
    description: 'Permite a un usuario unirse a una sala de estudio existente',
  })
  @ApiParam({
    name: 'roomId',
    description: 'ID único de la sala de estudio',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario se unió a la sala exitosamente',
    type: StudyRoomResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Sala de estudio no encontrada',
  })
  @ApiResponse({
    status: 400,
    description: 'Error al unirse (capacidad llena, ya está en la sala, etc.)',
  })
  async joinStudyRoom(
    @Request() req: AuthenticatedRequest,
    @Param('roomId') roomId: string
  ): Promise<StudyRoomResponseDto> {
    this.logger.log(`User ${req.user.id} joining study room: ${roomId}`);
    return this.studyRoomsService.joinStudyRoom(roomId, req.user.id);
  }

  @Post(':roomId/leave')
  @ApiOperation({
    summary: 'Salir de una sala de estudio',
    description:
      'Permite a un usuario salir de una sala de estudio. Si el host sale, se transfiere el rol al siguiente participante.',
  })
  @ApiParam({
    name: 'roomId',
    description: 'ID único de la sala de estudio',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario salió de la sala exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no está en la sala o sala no encontrada',
  })
  async leaveStudyRoom(
    @Request() req: AuthenticatedRequest,
    @Param('roomId') roomId: string
  ): Promise<{ message: string }> {
    this.logger.log(`User ${req.user.id} leaving study room: ${roomId}`);
    await this.studyRoomsService.leaveStudyRoom(roomId, req.user.id);
    return { message: 'Has salido de la sala de estudio exitosamente' };
  }

  @Put(':roomId/sync')
  @ApiOperation({
    summary: 'Sincronizar estado del video',
    description:
      'Permite al host sincronizar el tiempo y estado de reproducción del video para todos los participantes',
  })
  @ApiParam({
    name: 'roomId',
    description: 'ID único de la sala de estudio',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado del video sincronizado exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'Solo el host puede controlar la reproducción',
  })
  @ApiResponse({
    status: 404,
    description: 'Sala de estudio no encontrada',
  })
  async updateVideoSync(
    @Request() req: AuthenticatedRequest,
    @Param('roomId') roomId: string,
    @Body() syncData: { currentTime: number; isPaused: boolean }
  ): Promise<{ message: string }> {
    this.logger.log(
      `Updating video sync for room ${roomId}: time=${syncData.currentTime}, paused=${syncData.isPaused}`
    );
    await this.studyRoomsService.updateVideoSync(
      roomId,
      req.user.id,
      syncData.currentTime,
      syncData.isPaused
    );
    return { message: 'Estado del video sincronizado exitosamente' };
  }

  @Delete(':roomId')
  @ApiOperation({
    summary: 'Eliminar una sala de estudio',
    description:
      'Permite al host eliminar permanentemente una sala de estudio. Todos los participantes son removidos automáticamente.',
  })
  @ApiParam({
    name: 'roomId',
    description: 'ID único de la sala de estudio',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Sala de estudio eliminada exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'Solo el host puede eliminar la sala',
  })
  @ApiResponse({
    status: 404,
    description: 'Sala de estudio no encontrada',
  })
  async deleteStudyRoom(
    @Request() req: AuthenticatedRequest,
    @Param('roomId') roomId: string
  ): Promise<{ message: string }> {
    this.logger.log(`User ${req.user.id} deleting study room: ${roomId}`);
    await this.studyRoomsService.deleteStudyRoom(roomId, req.user.id);
    return { message: 'Sala de estudio eliminada exitosamente' };
  }
}
