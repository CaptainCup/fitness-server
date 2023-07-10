import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTrainingDto {
  @ApiProperty()
  readonly date: Date;

  @ApiProperty()
  readonly user: string;

  @ApiPropertyOptional()
  readonly exercises: {
    exercise: string;
    approaches: string[][];
  };
}
