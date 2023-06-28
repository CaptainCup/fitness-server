import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EquipmentDocument = HydratedDocument<Equipment>;

@Schema()
export class Equipment {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  configuration: { image?: string; text: string }[];
}

export const EquipmentSchema = SchemaFactory.createForClass(Equipment);
