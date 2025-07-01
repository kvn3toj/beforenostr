import { PartialType } from '@nestjs/swagger';
import { CreateCosmicTaskDto } from './create-cosmic-task.dto';

export class UpdateCosmicTaskDto extends PartialType(CreateCosmicTaskDto) {}
