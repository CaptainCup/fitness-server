import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendSmsDto {
  @ApiProperty()
  readonly number: string;

  @ApiProperty()
  readonly text: string;

  @ApiPropertyOptional()
  readonly tinyurl?: number;

  @ApiPropertyOptional()
  readonly time?: string;
}
