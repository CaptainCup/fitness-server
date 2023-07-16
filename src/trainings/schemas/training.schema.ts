import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type TrainingDocument = HydratedDocument<Training>;

@Schema()
export class Training {
  @Prop({ default: new Date() })
  date: Date;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  user: MongooseSchema.Types.ObjectId;

  @Prop([
    {
      exercise: {
        type: MongooseSchema.Types.ObjectId,
        ref: 'Exercise',
      },
      approaches: [],
      _id: false,
    },
  ])
  exercises: {
    exercise: MongooseSchema.Types.ObjectId;
    approaches: string[][];
  }[];
}

export const TrainingSchema = SchemaFactory.createForClass(Training);
