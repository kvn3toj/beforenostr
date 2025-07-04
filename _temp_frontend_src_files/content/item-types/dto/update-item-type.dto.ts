import { IsOptional } from 'class-validator';
import { CreateItemTypeDto } from './create-item-type.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateItemTypeDto extends PartialType(CreateItemTypeDto) {} 