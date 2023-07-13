import { Model, FilterQuery, QueryOptions } from 'mongoose';
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  private logger = new Logger('Users');

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    this.logger.debug(`User ${createUserDto.firstName} created.`);
    return createdUser.save();
  }

  async getList(
    getUserDto: GetUserDto,
  ): Promise<{ items: User[]; count: number }> {
    const { search, limit = '10', offset = '0' } = getUserDto;

    const filterQuery: FilterQuery<User> = {};

    if (search) {
      filterQuery.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await this.userModel
      .find(filterQuery)
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .exec();

    const count = await this.userModel.find(filterQuery).countDocuments();

    this.logger.debug(`Get users.`);

    return { items, count };
  }

  async getById(id: string): Promise<User> {
    this.logger.debug(`Get user ID ${id}.`);

    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async update(id: string, createUserDto: QueryOptions): Promise<User> {
    const user = await this.userModel.findById(id).exec();

    if (user) {
      this.logger.debug(`User ID ${id} updated.`);
      return user.updateOne(createUserDto);
    } else {
      this.logger.error(`User ID ${id} not found.`);
      throw new NotFoundException(
        `Пользователь с идентификатором ${id} не найден`,
      );
    }
  }

  async delete(id: string): Promise<void> {
    const user = await this.userModel.findById(id).exec();

    if (user) {
      this.logger.debug(`User ID ${id} deleted.`);
      user.deleteOne();
    } else {
      this.logger.error(`User ID ${id} not found.`);
      throw new NotFoundException(
        `Пользователь с идентификатором ${id} не найден`,
      );
    }
  }

  async getOne(query: FilterQuery<User>): Promise<User> {
    const user = await this.userModel.findOne(query).exec();

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }
}
