import { ApiProperty } from '@nestjs/swagger';

export class AcceptPhoneDto {
  @ApiProperty()
  readonly phone: string;

  @ApiProperty()
  readonly code: number;
}
