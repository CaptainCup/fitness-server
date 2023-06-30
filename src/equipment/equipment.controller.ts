import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { EquipmentService } from './equipment.service';
import { Equipment } from './schemas/equipment.schema';

@ApiTags('Equipment')
@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get()
  getEquipmentList(): Promise<Equipment[]> {
    return this.equipmentService.getList();
  }

  @Get('/:id')
  async getServiceByID(@Param('id') id: string): Promise<Equipment | null> {
    return this.equipmentService.getById(id);
  }

  @Post()
  addEquipment(
    @Body() createEquipmentDto: CreateEquipmentDto,
  ): Promise<Equipment> {
    return this.equipmentService.create(createEquipmentDto);
  }
}
