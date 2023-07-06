import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { SmsModule } from 'src/sms/sms.module';

@Module({
  imports: [
    SmsModule,
    UsersModule,
    JwtModule.register({
      global: true,
      secret: 'secret code',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
