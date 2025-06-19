import { ApiProperty } from '@nestjs/swagger';

export class StudyRoomParticipantDto {
  @ApiProperty({ description: 'ID del participante', type: String })
  id: string;

  @ApiProperty({ description: 'Nombre del participante', type: String })
  name: string;

  @ApiProperty({ description: 'Avatar del participante', required: false, type: String })
  avatarUrl?: string;

  @ApiProperty({ description: 'Indica si es el host de la sala', type: Boolean })
  isHost: boolean;

  @ApiProperty({ description: 'Momento en que se unió a la sala', type: Date })
  joinedAt: Date;
}

export class StudyRoomResponseDto {
  @ApiProperty({ description: 'ID único de la sala', type: String })
  id: string;

  @ApiProperty({ description: 'Nombre de la sala', type: String })
  name: string;

  @ApiProperty({ description: 'Descripción de la sala', required: false, type: String })
  description?: string;

  @ApiProperty({ description: 'ID del video', type: String })
  videoId: string;

  @ApiProperty({ description: 'Título del video', required: false, type: String })
  videoTitle?: string;

  @ApiProperty({ description: 'ID del host', type: String })
  hostId: string;

  @ApiProperty({ description: 'Capacidad máxima', type: Number })
  maxParticipants: number;

  @ApiProperty({ description: 'Número actual de participantes', type: Number })
  currentParticipants: number;

  @ApiProperty({ description: 'Estado de la sala', enum: ['ACTIVE', 'PAUSED', 'ENDED'], type: String })
  status: string;

  @ApiProperty({ description: 'Tiempo actual del video en segundos', type: Number })
  currentTime: number;

  @ApiProperty({ description: 'Indica si el video está pausado', type: Boolean })
  isPaused: boolean;

  @ApiProperty({ 
    description: 'Lista de participantes',
    type: () => [StudyRoomParticipantDto]  // Lazy resolver to avoid circular dependency
  })
  participants: StudyRoomParticipantDto[];

  @ApiProperty({ description: 'Fecha de creación', type: Date })
  createdAt: Date;

  @ApiProperty({ description: 'Última actualización', type: Date })
  updatedAt: Date;
} 