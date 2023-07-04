import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EquipmentModule } from './equipment/equipment.module';
import { FilesModule } from './files/files.module';
import { ExercisesModule } from './exercises/exercises.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017'),
    EquipmentModule,
    FilesModule,
    ExercisesModule,
  ],
})
export class AppModule {}
