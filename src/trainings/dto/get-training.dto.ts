import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetTrainingDto {
  @ApiPropertyOptional()
  readonly date?: Date;

  @ApiPropertyOptional()
  readonly user?: string;

  @ApiPropertyOptional()
  readonly limit?: string;

  @ApiPropertyOptional()
  readonly offset?: string;
}
