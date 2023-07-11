import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { catchError, lastValueFrom } from 'rxjs';
import { SendSmsDto } from './dto/send-sms.dto';
import { AcceptPhoneDto } from './dto/accept-phone.dto';
import { SmsToken } from './schemas/sms.schema';

const smscConfig = {
  login: 'poi.lincoln@gmail.com',
  api: 'zUjjIdG4aw7qY6TRnv2KNyXIGm',
  sign: 'SMS Aero',
};

@Injectable()
export class SmsService {
  private logger = new Logger('SMS');

  constructor(
    @InjectModel(SmsToken.name) private smsTokenModel: Model<SmsToken>,
    private readonly httpService: HttpService,
  ) {}

  phoneToken = () => {
    const possible = '123456789';
    let string = '';
    for (let i = 0; i < 4; i++) {
      string += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return string;
  };

  async send(smsDto: SendSmsDto): Promise<void> {
    const { login, api, sign } = smscConfig;
    const params = { ...smsDto, sign };

    const query = Object.entries(params)
      .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
      .join('&');

    const baseUrl = `https://${login}:${api}@gate.smsaero.ru/v2/sms/${
      process.env.NODE_ENV !== 'production' ? 'testsend' : 'send'
    }?${query}`;

    const request = await this.httpService
      .get(baseUrl, {
        auth: {
          username: login,
          password: api,
        },
      })
      .pipe(
        catchError((error) => {
          this.logger.error(error.response.data);
          throw new BadRequestException('Произошла ошибка при отправке кода');
        }),
      );

    await lastValueFrom(request);

    this.logger.debug(`Send message to ${smsDto.number}`);
  }

  async sendAcceptCode(acceptPhoneDto: AcceptPhoneDto): Promise<void> {
    const { phone } = acceptPhoneDto;
    const currentDate = Date.now();
    const code = this.phoneToken();

    await this.smsTokenModel.create({
      phone,
      token: code,
      createdAt: currentDate,
      endAt: currentDate + 1000 * 60 * 5,
    });

    await this.send({
      number: phone,
      text: `Код: ${code}`,
    });
  }

  async acceptPhone(acceptPhoneDto: AcceptPhoneDto) {
    const { code, phone } = acceptPhoneDto;
    const smsToken = await this.getToken(phone);
    const currentTime = new Date();

    if (smsToken && smsToken.token === code) {
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
