import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Measurement } from '../enums/measurement.enum';

export class CreateExerciseDto {
  @ApiProperty()
  readonly name: string;

  @ApiPropertyOptional()
  readonly description: string;

  @ApiPropertyOptional()
  readonly image: string;

  @ApiProperty()
  readonly measurements: Measurement[];

  @ApiPropertyOptional()
  readonly execution: { image?: string; text: string }[];

  @ApiPropertyOptional()
  readonly equipment: string[];

  @ApiPropertyOptional()
  readonly similar: string[];
}
