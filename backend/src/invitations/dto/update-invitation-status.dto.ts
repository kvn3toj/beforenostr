import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { InvitationStatus } from './invitations.dto';

export class UpdateInvitationStatusDto {
  @ApiProperty({ description: 'Nuevo estado de la invitación', enum: InvitationStatus })
  @IsEnum(InvitationStatus)
  status: InvitationStatus;
}
