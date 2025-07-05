import { PartialType } from '@nestjs/swagger';
import { CreateCosmicTaskDto } from './create-cosmic-task.dto.js.js';

export class UpdateCosmicTaskDto extends PartialType(CreateCosmicTaskDto) {}
