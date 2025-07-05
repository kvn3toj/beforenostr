import { PartialType } from '@nestjs/swagger';
import { CreateMeritDto } from './create-merit.dto.js.js';

export class UpdateMeritDto extends PartialType(CreateMeritDto) {}
