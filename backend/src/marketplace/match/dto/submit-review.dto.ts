import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SubmitReviewDto {
  @ApiProperty({
    description: 'Overall rating (1-5)',
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  rating: number;

  @ApiPropertyOptional({
    description: 'Optional comment about the experience',
    example: 'Great service, very professional',
  })
  comment?: string;

  @ApiPropertyOptional({
    description: 'Communication rating (1-5)',
    minimum: 1,
    maximum: 5,
    example: 5,
  })
  communication?: number;

  @ApiPropertyOptional({
    description: 'Quality rating (1-5)',
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  quality?: number;

  @ApiPropertyOptional({
    description: 'Delivery rating (1-5)',
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  delivery?: number;

  @ApiPropertyOptional({
    description: 'Value rating (1-5)',
    minimum: 1,
    maximum: 5,
    example: 5,
  })
  value?: number;
}
