import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTrainingDto {
  @ApiPropertyOptional({ default: new Date() })
  readonly date?: Date;

  @ApiProperty()
  readonly user: string;

  @ApiPropertyOptional()
  readonly exercises?: {
    exercise: string;
    approaches: string[][];
  };
}
