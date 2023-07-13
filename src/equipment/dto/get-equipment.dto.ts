import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetEquipmentDto {
  @ApiPropertyOptional()
  readonly search?: string;

  @ApiPropertyOptional()
  readonly exclude?: string[];

  @ApiPropertyOptional()
  readonly limit?: string;

  @ApiPropertyOptional()
  readonly offset?: string;
}
