import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AxiosResponse } from 'axios';
import { SmsService } from './sms.service';
import { AcceptPhoneDto } from './dto/accept-phone.dto';

@ApiTags('SMS')
@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post()
  sendCode(
    @Body() acceptPhoneDto: AcceptPhoneDto,
  ): Promise<AxiosResponse<string>> {
    return this.smsService.sendAcceptCode(acceptPhoneDto);
  }
}
