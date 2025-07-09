import { ApiProperty } from '@nestjs/swagger';

export class ConfirmMatchDto {
  @ApiProperty({
    description: 'Role of the user in the match',
    enum: ['buyer', 'seller'],
    example: 'buyer',
  })
  role: 'buyer' | 'seller';
}
