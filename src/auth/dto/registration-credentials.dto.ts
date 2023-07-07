import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegistrationCredentialsDto {
  @ApiPropertyOptional()
  firstName?: string;

  @ApiPropertyOptional()
  lastName?: string;

  @ApiPropertyOptional()
  middleName?: string;

  @ApiPropertyOptional()
  avatar?: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  code: string;
}
