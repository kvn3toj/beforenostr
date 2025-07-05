import { PartialType } from '@nestjs/swagger';
import { CreatePersonalityDto } from './create-personality.dto.js.js';

export class UpdatePersonalityDto extends PartialType(CreatePersonalityDto) {}
