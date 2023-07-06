import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { RegistrationCredentialsDto } from './dto/registration-credentials.dto';
import { AuthTokens } from './interfaces/auth-tokens.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body()
    registrationCredentialsDto: RegistrationCredentialsDto,
  ): Promise<AuthTokens> {
    return this.authService.signUp(registrationCredentialsDto);
  }

  @Post('/signin')
  signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<AuthTokens> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Post('/tokens')
  refreshTokens(
    @Body('refreshToken') refreshToken: string,
  ): Promise<AuthTokens> {
    if (refreshToken) {
      return this.authService.refreshTokens(refreshToken);
    } else {
      throw new UnauthorizedException(
        'Чтобы продолжить войдите на сервис или зарегистрируйтесь',
      );
    }
  }
}
