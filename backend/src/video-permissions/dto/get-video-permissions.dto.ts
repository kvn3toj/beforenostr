import { IsNumberString } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetVideoPermissionsDto {
  @IsNumberString()
  @Transform(({ value }) => parseInt(value, 10))
  videoItemId: number;
}
