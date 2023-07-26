import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTrainingDto {
  @ApiPropertyOptional()
  readonly date?: Date;

  @ApiProperty()
  readonly user: string;

  @ApiPropertyOptional()
  readonly exercises?: {
    exercise: string;
    approaches: string[][];
  };
}
