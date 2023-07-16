import { ApiProperty } from '@nestjs/swagger';

export class LastExerciseResultsDto {
  @ApiProperty()
  readonly user: string;

  @ApiProperty()
  readonly exercise: string;
}
