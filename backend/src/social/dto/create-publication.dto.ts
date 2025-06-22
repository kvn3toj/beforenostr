import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreatePublicationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500, {
    message: 'El contenido no puede exceder los 500 caracteres',
  })
  content: string;

  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'El tipo no puede exceder los 50 caracteres' })
  type?: string = 'TEXT';
}
