import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEquipmentDto {
  @ApiProperty()
  readonly name: string;

  @ApiPropertyOptional()
  readonly description: string;

  @ApiPropertyOptional()
  readonly image: string;

  @ApiPropertyOptional()
  readonly configuration: { image?: string; text: string }[];
}
