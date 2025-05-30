import { IsString, IsOptional } from 'class-validator';

export class CreateExperienceDto {
  @IsString()
  stageId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  type: string; // GAMIFIED_SOLVER, GAMIFIED_CLIENT, REFORMATORY

  @IsOptional()
  @IsString()
  gamificationFramework?: string; // Default: "Octalysis"

  @IsString()
  creatorId: string;
} 