import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoPermissionsDto } from './create-video-permissions.dto.js.js';

export class UpdateVideoPermissionsDto extends PartialType(
  CreateVideoPermissionsDto
) {}
