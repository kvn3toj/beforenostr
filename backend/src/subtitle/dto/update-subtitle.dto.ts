import { PartialType } from '@nestjs/mapped-types';
import { CreateSubtitleDto } from './create-subtitle.dto.js.js';

export class UpdateSubtitleDto extends PartialType(CreateSubtitleDto) {
  // No se necesita 'id: number;' aquí si el ID viene del parámetro de ruta.
  // PartialType ya hace que todas las propiedades de CreateSubtitleDto sean opcionales.
}
