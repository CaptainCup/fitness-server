import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EquipmentModule } from './equipment/equipment.module';
import { FilesModule } from './files/files.module';
import { ExercisesModule } from './exercises/exercises.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SmsModule } from './sms/sms.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017'),
    EquipmentModule,
    FilesModule,
    ExercisesModule,
    UsersModule,
    AuthModule,
    SmsModule,
  ],
})
export class AppModule {}
