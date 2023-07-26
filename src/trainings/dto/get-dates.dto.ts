import { ApiProperty } from '@nestjs/swagger';

export class GetTrainingDatesDto {
  @ApiProperty()
  readonly user?: string;
}
