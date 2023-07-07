import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from '../users/users.service';

const jwtConfig = 'secret code';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || jwtConfig,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { user: userId } = payload;
    const user = await this.usersService.getById(userId);

    if (!user) {
      throw new UnauthorizedException('Вы не авторизованы');
    }

    return user;
  }
}
