import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({
    description: 'Message content',
    example: 'Hello, I am interested in your service',
  })
  content: string;
}
