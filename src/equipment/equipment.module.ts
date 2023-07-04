import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EquipmentController } from './equipment.controller';
import { Equipment, EquipmentSchema } from './schemas/equipment.schema';
import { EquipmentService } from './equipment.service';
import {
  Exercise,
  ExerciseSchema,
} from 'src/exercises/schemas/exercise.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Equipment.name, schema: EquipmentSchema },
    ]),
    MongooseModule.forFeature([
      { name: Exercise.name, schema: ExerciseSchema },
    ]),
  ],
  controllers: [EquipmentController],
  providers: [EquipmentService],
})
export class EquipmentModule {}
