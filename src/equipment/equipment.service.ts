import { Model, FilterQuery } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Equipment } from './schemas/equipment.schema';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { GetEquipmentDto } from './dto/get-equipment.dto';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectModel(Equipment.name) private equipmentModel: Model<Equipment>,
  ) {}

  async create(createEquipmentDto: CreateEquipmentDto): Promise<Equipment> {
    const createdEquipment = new this.equipmentModel(createEquipmentDto);
    return createdEquipment.save();
  }

  async getList(
    getEquipmentDto: GetEquipmentDto,
  ): Promise<{ items: Equipment[]; count: number }> {
    const { search, limit = '10', offset = '0' } = getEquipmentDto;

    const filterQuery: FilterQuery<Equipment> = {};

    if (search) {
      filterQuery.name = { $regex: search, $options: 'i' };
    }

    const items = await this.equipmentModel
      .find(filterQuery)
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .exec();

    const count = await this.equipmentModel.find(filterQuery).countDocuments();

    return { items, count };
  }

  async getById(id: string): Promise<Equipment | null> {
    return this.equipmentModel.findById(id).exec();
  }

  async update(
    id: string,
    createEquipmentDto: CreateEquipmentDto,
  ): Promise<Equipment> {
    const equipment = await this.equipmentModel.findById(id).exec();

    if (equipment) {
      return equipment.updateOne(createEquipmentDto);
    } else {
      throw new NotFoundException(
        `Оборудование с идентификатором ${id} не найдено`,
      );
    }
  }

  async delete(id: string): Promise<void> {
    const equipment = await this.equipmentModel.findById(id).exec();

    if (equipment) {
      equipment.deleteOne();
    } else {
      throw new NotFoundException(
        `Оборудование с идентификатором ${id} не найдено`,
      );
    }
  }
}
