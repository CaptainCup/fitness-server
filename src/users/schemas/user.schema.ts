import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AdminPermissions } from '../enums/admin-permissions';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;

  @Prop()
  middleName?: string;

  @Prop()
  avatar?: string;

  @Prop()
  phone: string;

  @Prop()
  tokens: string[];

  @Prop([{ enum: AdminPermissions, type: String }])
  admin: AdminPermissions[];
}

export const UserSchema = SchemaFactory.createForClass(User);
