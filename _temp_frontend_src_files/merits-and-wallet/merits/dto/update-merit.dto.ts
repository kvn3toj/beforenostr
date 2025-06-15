import { PartialType } from '@nestjs/swagger';
import { CreateMeritDto } from './create-merit.dto';

export class UpdateMeritDto extends PartialType(CreateMeritDto) {} 