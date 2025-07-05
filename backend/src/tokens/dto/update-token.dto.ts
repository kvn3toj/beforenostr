import { PartialType } from '@nestjs/mapped-types';
import { CreateTokenDto } from './create-token.dto.js.js';

export class UpdateTokenDto extends PartialType(CreateTokenDto) {}
