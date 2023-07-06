import {
  Injectable,
  Logger,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/schemas/user.schema';
import { SmsService } from 'src/sms/sms.service';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthTokens } from './interfaces/auth-tokens.interface';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { RegistrationCredentialsDto } from './dto/registration-credentials.dto';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    private readonly jwtService: JwtService,
    private readonly smsService: SmsService,
    private readonly usersService: UsersService,
  ) {}

  private async checkVerificationCode(
    registrationCredentialsDto: RegistrationCredentialsDto,
  ): Promise<void> {
    const { phone, code } = registrationCredentialsDto;

    const item = await this.smsService.getToken(phone);

    if (item?.token !== code)
      throw new BadRequestException('Неверный код верификации');
  }

  async signUp(
    registrationCredentialsDto: RegistrationCredentialsDto,
  ): Promise<AuthTokens> {
    const { phone } = registrationCredentialsDto;

    const userExists = await this.usersService
      .getOne({ phone })
      .catch(() => null);

    if (userExists) {
      throw new BadRequestException('Такой пользователь уже существует');
    }

    await this.checkVerificationCode(registrationCredentialsDto);

    const user = await this.usersService.create({ phone });

    return this.authUser(user);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<AuthTokens> {
    const { phone } = authCredentialsDto;

    await this.checkVerificationCode(authCredentialsDto);

    const user = await this.usersService.getOne({ phone });

    return this.authUser(user);
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    const payload: any = this.jwtService.decode(refreshToken);
    const user = await this.usersService.getById(payload.user);

    if (user.tokens.includes(refreshToken)) {
      const tokens = user.tokens.filter((token) => token !== refreshToken);
      return this.authUser(user, tokens);
    } else {
      this.logger.error(
        `Failed to refresh tokens, Data: ${JSON.stringify(refreshToken)}`,
      );

      throw new UnauthorizedException(
        'Чтобы продолжить войдите на сервис или зарегистрируйтесь',
      );
    }
  }

  private async authUser(user: any, tokens?: string[]): Promise<AuthTokens> {
    const userTokens: string[] = tokens || user.tokens;
    const payload: JwtPayload = { user: user._id };

    const accessToken = await this.jwtService.sign(payload);
    const refreshToken = await this.jwtService.sign(payload, {
      keyid: 'secretRefresh',
      expiresIn: 60 * 60 * 24 * 30,
    });

    if (userTokens.length > 9) {
      userTokens.shift();
    }

    userTokens.push(refreshToken);

    await this.usersService.update(user._id, {
      tokens: userTokens,
    });

    this.logger.verbose(`Refresh tokens for user: ${user._id}`);
    return { accessToken, refreshToken };
  }
}
