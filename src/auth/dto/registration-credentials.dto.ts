import { ApiProperty } from '@nestjs/swagger';

export class RegistrationCredentialsDto {
  @ApiProperty()
  readonly phone: string;

  @ApiProperty()
  readonly code: number;
}
