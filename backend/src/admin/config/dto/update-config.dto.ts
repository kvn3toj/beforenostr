import { PartialType } from '@nestjs/swagger';
import { CreateConfigDto } from './create-config.dto.js.js';

export class UpdateConfigDto extends PartialType(CreateConfigDto) {}
