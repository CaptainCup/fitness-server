import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Exercise } from 'src/exercises/schemas/exercise.schema';

export type EquipmentDocument = HydratedDocument<Equipment>;

@Schema()
export class Equipment {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  image?: string;

  @Prop()
  configuration?: { image?: string; text: string }[];

  @Prop()
  exercises?: Exercise[];
}

export const EquipmentSchema = SchemaFactory.createForClass(Equipment);
