import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SmsService } from './sms.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SmsToken, SmsTokenSchema } from './schemas/sms.schema';
import { SmsController } from './sms.controller';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: SmsToken.name, schema: SmsTokenSchema },
    ]),
  ],
  providers: [SmsService],
  exports: [SmsService],
  controllers: [SmsController],
})
export class SmsModule {}
