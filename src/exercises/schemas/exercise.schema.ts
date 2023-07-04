import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Measurement } from '../enums/measurement.enum';

export type ExerciseDocument = HydratedDocument<Exercise>;

@Schema()
export class Exercise {
  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiPropertyOptional()
  @Prop()
  description: string;

  @ApiPropertyOptional()
  @Prop()
  image?: string;

  @ApiProperty()
  @Prop({ required: true })
  measurements: Measurement[];

  @ApiPropertyOptional()
  @Prop()
  execution?: { image?: string; text: string }[];

  @ApiPropertyOptional()
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Equipment',
  })
  equipment?: MongooseSchema.Types.ObjectId[];

  @ApiPropertyOptional()
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Exercise' })
  similar?: MongooseSchema.Types.ObjectId[];
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
