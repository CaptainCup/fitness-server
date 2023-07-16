import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTrainingDto } from './dto/create-training.dto';
import { GetTrainingDto } from './dto/get-training.dto';
import { LastExerciseResultsDto } from './dto/last-exercise-results.dto';
import { TrainingsService } from './trainings.service';
import { Training } from './schemas/training.schema';

@ApiTags('Trainings')
@Controller('trainings')
export class TrainingsController {
  constructor(private readonly trainingsService: TrainingsService) {}

  @Get()
  getTrainingList(
    @Query() getTrainingDto: GetTrainingDto,
  ): Promise<{ items: Training[]; count: number }> {
    return this.trainingsService.getList(getTrainingDto);
  }

  @Get('/last-exercise-results')
  getLastExerciseResults(
    @Query() lastExerciseResultsDto: LastExerciseResultsDto,
  ): Promise<{ approaches: string[][]; date: Date } | null> {
    return this.trainingsService.lastExerciseResults(lastExerciseResultsDto);
  }

  @Get('/:id')
  getTrainingByID(@Param('id') id: string): Promise<Training | null> {
    return this.trainingsService.getById(id);
  }

  @Post()
  addTraining(@Body() createTrainingDto: CreateTrainingDto): Promise<Training> {
    return this.trainingsService.create(createTrainingDto);
  }

  @Patch('/:id')
  updateTraining(
    @Param('id') id: string,
    @Body() createTrainingDto: CreateTrainingDto,
  ): Promise<Training> {
    return this.trainingsService.update(id, createTrainingDto);
  }

  @Delete('/:id')
  deleteTraining(@Param('id') id: string): Promise<void> {
    return this.trainingsService.delete(id);
  }
}
