import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignPersonalityDto {
  @ApiProperty({ description: 'ID del usuario' })
  @IsString()
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'ID de la personalidad' })
  @IsString()
  @IsUUID()
  personalityId: string;
} 