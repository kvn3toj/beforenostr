import { IsBoolean, IsString, IsOptional, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateVideoPermissionsDto {
  // Derechos de visualización del jugador
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  showWaveCount: boolean = true;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  showVideos: boolean = true;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  showVideoSubtitles: boolean = true;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  showComments: boolean = true;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  showPublishDate: boolean = true;

  // Configuraciones de video
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  showVideoDuration: boolean = true;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  showLikeButton: boolean = true;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  allowRewindForward: boolean = false;

  // Configuraciones de comentarios
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  allowViewComments: boolean = true;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  allowMakeComments: boolean = true;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  showLikeComments: boolean = true;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  sortCommentsByAffinity: boolean = false;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  showCommenterName: boolean = false;

  // Posición en playlist
  @IsString()
  @IsIn(['position1', 'position2', 'position3', 'final'])
  playlistPosition: string = 'position1';

  // Estado
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isDraft?: boolean = false;

  @IsString()
  @IsOptional()
  createdById?: string;
}
