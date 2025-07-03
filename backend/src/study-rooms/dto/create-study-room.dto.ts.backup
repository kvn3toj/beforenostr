import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateStudyRoomDto {
  @ApiProperty({
    description: 'Nombre de la sala de estudio',
    example: 'Sala de Matemáticas Avanzadas',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Descripción opcional de la sala',
    example: 'Sala para estudiar álgebra linear y cálculo',
    maxLength: 500,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'La descripción no puede exceder 500 caracteres' })
  description?: string;

  @ApiProperty({
    description: 'ID del video que se reproducirá en la sala',
    example: '1',
  })
  @IsString()
  videoId: string;

  @ApiProperty({
    description: 'Capacidad máxima de participantes',
    example: 10,
    default: 10,
  })
  @IsOptional()
  maxParticipants?: number = 10;
}
