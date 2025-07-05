import { PartialType } from '@nestjs/swagger';
import { CreateContestDto } from './create-contest.dto.js.js';

export class UpdateContestDto extends PartialType(CreateContestDto) {}
