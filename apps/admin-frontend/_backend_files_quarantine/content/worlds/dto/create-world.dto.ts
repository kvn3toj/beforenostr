import { IsString, IsOptional } from 'class-validator';

export class CreateWorldDto {
  @IsString()
  name: string; // ONE, DUO, TRIKETA, ECOVILLAS

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  type: string; // TRANSITORIO, MEDIANA_DURACION

  @IsString()
  creatorId: string;

  @IsOptional()
  @IsString()
  status?: string; // ACTIVE, INACTIVE, UNDER_CONSTRUCTION

  @IsOptional()
  @IsString()
  mundoId?: string; // Relación opcional con Mundo existente
} 