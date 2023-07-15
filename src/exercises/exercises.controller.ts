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
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { GetExerciseDto } from './dto/get-exercise.dto';
import { ExercisesService } from './exercises.service';
import { Exercise } from './schemas/exercise.schema';

@ApiTags('Exercises')
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get()
  getExerciseList(
    @Query() getExerciseDto: GetExerciseDto,
  ): Promise<{ items: Exercise[]; count: number }> {
    return this.exercisesService.getList(getExerciseDto);
  }

  @Get('/:id')
  async getExerciseByID(@Param('id') id: string): Promise<Exercise | null> {
    return this.exercisesService.getById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), new AdminGuard(AdminPermissions.trainer))
  addExercise(@Body() createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    return this.exercisesService.create(createExerciseDto);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard('jwt'), new AdminGuard(AdminPermissions.trainer))
  updateExercise(
    @Param('id') id: string,
    @Body() createExerciseDto: CreateExerciseDto,
  ): Promise<Exercise> {
    return this.exercisesService.update(id, createExerciseDto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'), new AdminGuard(AdminPermissions.admin))
  deleteExercise(@Param('id') id: string): Promise<void> {
    return this.exercisesService.delete(id);
  }
}
