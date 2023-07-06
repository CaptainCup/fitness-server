import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosResponse } from 'axios';
import { SendSmsDto } from './dto/send-sms.dto';
import { AcceptPhoneDto } from './dto/accept-phone.dto';
import { SmsToken } from './schemas/sms.schema';

const smscConfig = {
  login: 'poi.lincoln@gmail.com',
  api: 'zUjjIdG4aw7qY6TRnv2KNyXIGm',
  sign: 'Fitness',
};

@Injectable()
export class SmsService {
  constructor(
    @InjectModel(SmsToken.name) private smsTokenModel: Model<SmsToken>,
    private readonly httpService: HttpService,
  ) {}

  phoneToken = () => {
    const possible = '0123456789';
    let string = '';
    for (let i = 0; i < 4; i++) {
      string += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return string;
  };

  async send(smsDto: SendSmsDto): Promise<AxiosResponse<string>> {
    const { login, api, sign } = smscConfig;
    const params = { ...smsDto, sign };

    const query = Object.entries(params)
      .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
      .join('&');

    const baseUrl = `https://${login}:${api}@gate.smsaero.ru/v2/sms/send?${query}`;
    const result = await this.httpService.get(baseUrl).toPromise();
    return result?.data;
  }

  async sendAcceptCode(
    acceptPhoneDto: AcceptPhoneDto,
  ): Promise<AxiosResponse<string>> {
    const { phone } = acceptPhoneDto;
    const currentDate = Date.now();
    const code = this.phoneToken();
    await this.smsTokenModel.create({
      phone,
      token: code,
      createdAt: currentDate,
      endAt: currentDate + 1000 * 60 * 5,
    });

    const message = await this.send({
      number: phone,
      text: code,
    });
    return message;
  }

  async acceptPhone(acceptPhoneDto: AcceptPhoneDto) {
    const { code, phone } = acceptPhoneDto;
    const smsToken = await this.getToken(phone);
    const currentTime = new Date();

    if (smsToken && smsToken.token === +code) {
      if (currentTime < smsToken.endAt) {
        return { success: true, message: 'Номер телефона подтвержден' };
      } else {
        throw new BadRequestException('Срок действия кода проверки истек');
      }
    } else {
      throw new BadRequestException('Неверный код проверки');
    }
  }

  async getToken(phone: string) {
    const token = await this.smsTokenModel
      .findOne({ phone })
      .sort({ createdAt: 'desc' });

    if (!token) {
      throw new NotFoundException('Токен проверки не найден');
    }

    return token;
  }
}
