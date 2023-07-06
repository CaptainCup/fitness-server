import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SmsTokenDocument = HydratedDocument<SmsToken>;

@Schema()
export class SmsToken {
  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  token: number;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  endAt: Date;
}

export const SmsTokenSchema = SchemaFactory.createForClass(SmsToken);
