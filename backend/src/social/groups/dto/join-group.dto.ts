import { IsString, IsOptional } from 'class-validator';

export class JoinGroupDto {
  @IsString()
  userId: string;

  @IsString()
  groupId: string;

  @IsOptional()
  @IsString()
  roleInGroup?: string; // MEMBER, LEADER, ARBITRATOR, MODERATOR (default: MEMBER)
}
