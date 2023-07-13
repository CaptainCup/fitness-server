import { Model, FilterQuery } from 'mongoose';
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Equipment } from './schemas/equipment.schema';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { GetEquipmentDto } from './dto/get-equipment.dto';
import { Exercise } from 'src/exercises/schemas/exercise.schema';

@Injectable()
export class EquipmentService {
  private logger = new Logger('Equipment');

  constructor(
    @InjectModel(Equipment.name) private equipmentModel: Model<Equipment>,
    @InjectModel(Exercise.name) private exerciseModel: Model<Exercise>,
  ) {}

  async create(createEquipmentDto: CreateEquipmentDto): Promise<Equipment> {
    const createdEquipment = new this.equipmentModel(createEquipmentDto);
    this.logger.debug(`Equipment ${createEquipmentDto.name} created.`);
    return createdEquipment.save();
  }

  async getList(
    getEquipmentDto: GetEquipmentDto,
  ): Promise<{ items: Equipment[]; count: number }> {
    const { search, exclude, limit = '10', offset = '0' } = getEquipmentDto;

    const filterQuery: FilterQuery<Equipment> = {};

    if (search) {
      filterQuery.name = { $regex: search, $options: 'i' };
    }

    if (exclude) {
      filterQuery._id = { $nin: exclude.map((id) => id) };
    }

    const items = await this.equipmentModel
      .find(filterQuery)
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .exec();

    const count = await this.equipmentModel.find(filterQuery).countDocuments();

    this.logger.debug(`Get equipment.`);

    return { items, count };
  }

  async getById(id: string): Promise<Equipment | null> {
    this.logger.debug(`Get equipment ID ${id}.`);

    const exercises = await this.exerciseModel
      .find({ equipment: { $in: id } })
      .exec();

    const equipment = await this.equipmentModel.findById(id).exec();

    if (equipment) {
      equipment.exercises = exercises;
    }

    return equipment;
  }

  async update(
    id: string,
    createEquipmentDto: CreateEquipmentDto,
  ): Promise<Equipment> {
    const equipment = await this.equipmentModel.findById(id).exec();

    if (equipment) {
      this.logger.debug(`Equipment ID ${id} updated.`);
      return equipment.updateOne(createEquipmentDto);
    } else {
      this.logger.error(`Equipment ID ${id} not found.`);
      throw new NotFoundException(
        `Оборудование с идентификатором ${id} не найдено`,
      );
    }
  }

  async delete(id: string): Promise<void> {
    const equipment = await this.equipmentModel.findById(id).exec();

    if (equipment) {
      this.logger.debug(`Equipment ID ${id} deleted.`);
      equipment.deleteOne();
    } else {
      this.logger.error(`Equipment ID ${id} not found.`);
      throw new NotFoundException(
        `Оборудование с идентификатором ${id} не найдено`,
      );
    }
  }
}
