import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetExerciseDto {
  @ApiPropertyOptional()
  readonly search?: string;

  @ApiPropertyOptional()
  readonly exclude?: string[];

  @ApiPropertyOptional()
  readonly limit?: string;

  @ApiPropertyOptional()
  readonly offset?: string;
}
