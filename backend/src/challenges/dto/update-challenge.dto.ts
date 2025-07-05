import { PartialType } from '@nestjs/swagger';
import { CreateChallengeDto } from './create-challenge.dto.js.js';

export class UpdateChallengeDto extends PartialType(CreateChallengeDto) {}
