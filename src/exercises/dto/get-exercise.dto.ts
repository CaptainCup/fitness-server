import { ApiPropertyOptional } from '@nestjs/swagger';
import { Muscule } from '../enums/muscules.enum';

export class GetExerciseDto {
  @ApiPropertyOptional()
  readonly search?: string;

  @ApiPropertyOptional()
  readonly exclude?: string[];

  @ApiPropertyOptional()
  readonly muscules?: Muscule[];

  @ApiPropertyOptional()
  readonly limit?: string;

  @ApiPropertyOptional()
  readonly offset?: string;
}
