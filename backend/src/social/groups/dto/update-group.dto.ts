import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupDto } from './create-group.dto.js.js';

export class UpdateGroupDto extends PartialType(CreateGroupDto) {}
