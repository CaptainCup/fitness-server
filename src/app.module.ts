import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EquipmentModule } from './equipment/equipment.module';
import { FilesModule } from './files/files.module';
import { ExercisesModule } from './exercises/exercises.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SmsModule } from './sms/sms.module';
import { TrainingsModule } from './trainings/trainings.module';

const dbURL =
  process.env.NODE_ENV !== 'production'
    ? 'mongodb://127.0.0.1:27017'
    : 'mongodb://45.84.227.184:27017';

@Module({
  imports: [
    MongooseModule.forRoot(dbURL),
    EquipmentModule,
    FilesModule,
    ExercisesModule,
    UsersModule,
    AuthModule,
    SmsModule,
    TrainingsModule,
  ],
})
export class AppModule {}
