import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsDto {
  @ApiProperty()
  readonly phone: string;

  @ApiProperty()
  readonly code: string;
}
