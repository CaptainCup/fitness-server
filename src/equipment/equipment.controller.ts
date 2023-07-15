import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/_common/guards/admin.guard';
import { AdminPermissions } from 'src/users/enums/admin-permissions';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { GetEquipmentDto } from './dto/get-equipment.dto';
import { EquipmentService } from './equipment.service';
import { Equipment } from './schemas/equipment.schema';

@ApiTags('Equipment')
@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get()
  getEquipmentList(
    @Query() getEquipmentDto: GetEquipmentDto,
  ): Promise<{ items: Equipment[]; count: number }> {
    return this.equipmentService.getList(getEquipmentDto);
  }

  @Get('/:id')
  async getEquipmentByID(@Param('id') id: string): Promise<Equipment | null> {
    return this.equipmentService.getById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), new AdminGuard(AdminPermissions.trainer))
  addEquipment(
    @Body() createEquipmentDto: CreateEquipmentDto,
  ): Promise<Equipment> {
    return this.equipmentService.create(createEquipmentDto);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard('jwt'), new AdminGuard(AdminPermissions.trainer))
  updateEquipment(
    @Param('id') id: string,
    @Body() createEquipmentDto: CreateEquipmentDto,
  ): Promise<Equipment> {
    return this.equipmentService.update(id, createEquipmentDto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'), new AdminGuard(AdminPermissions.admin))
  deleteEquipment(@Param('id') id: string): Promise<void> {
    return this.equipmentService.delete(id);
  }
}
