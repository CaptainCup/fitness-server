import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SmsService } from './sms.service';
import { AcceptPhoneDto } from './dto/accept-phone.dto';

@ApiTags('SMS')
@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post()
  sendCode(@Body() acceptPhoneDto: AcceptPhoneDto): Promise<void> {
    return this.smsService.sendAcceptCode(acceptPhoneDto);
  }
}
