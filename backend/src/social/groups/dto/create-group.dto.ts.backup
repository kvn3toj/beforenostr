import { IsString, IsOptional } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  ownerId: string;

  @IsString()
  type: string; // CLAN, FRIEND, CLIENT, ALLY, GOVERNANCE_BODY, COMMUNITY_OF_PRACTICE
}
