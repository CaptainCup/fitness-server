import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Equipment } from './schemas/equipment.schema';
import { CreateEquipmentDto } from './dto/create-equipment.dto';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectModel(Equipment.name) private equipmentModel: Model<Equipment>,
  ) {}

  async create(createEquipmentDto: CreateEquipmentDto): Promise<Equipment> {
    const createdEquipment = new this.equipmentModel(createEquipmentDto);
    return createdEquipment.save();
  }

  async getList(): Promise<Equipment[]> {
    return this.equipmentModel.find().exec();
  }

  async getById(id: string): Promise<Equipment | null> {
    return this.equipmentModel.findById(id).exec();
  }
}
