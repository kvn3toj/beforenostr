import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(280, { message: 'El comentario no puede exceder los 280 caracteres' })
  content: string;
} 