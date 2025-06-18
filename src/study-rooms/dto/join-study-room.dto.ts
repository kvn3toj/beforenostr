import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class JoinStudyRoomDto {
  @ApiProperty({
    description: 'ID de la sala de estudio a la que unirse',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'Debe ser un UUID válido' })
  roomId: string;
} 