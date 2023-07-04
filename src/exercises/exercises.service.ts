import { Model, FilterQuery } from 'mongoose';
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exercise } from './schemas/exercise.schema';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { GetExerciseDto } from './dto/get-exercise.dto';

@Injectable()
export class ExercisesService {
  private logger = new Logger('Exercises');

  constructor(
    @InjectModel(Exercise.name) private exerciseModel: Model<Exercise>,
  ) {}

  async create(createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    const createdExercise = new this.exerciseModel(createExerciseDto);
    this.logger.debug(`Exercise ${createExerciseDto.name} created.`);
    return createdExercise.save();
  }

  async getList(
    getExerciseDto: GetExerciseDto,
  ): Promise<{ items: Exercise[]; count: number }> {
    const { search, limit = '10', offset = '0' } = getExerciseDto;

    const filterQuery: FilterQuery<Exercise> = {};

    if (search) {
      filterQuery.name = { $regex: search, $options: 'i' };
    }

    const items = await this.exerciseModel
      .find(filterQuery)
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .populate('equipment')
      .exec();

    const count = await this.exerciseModel.find(filterQuery).countDocuments();

    this.logger.debug(`Get exercises.`);

    return { items, count };
  }

  async getById(id: string): Promise<Exercise | null> {
    this.logger.debug(`Get exercise ID ${id}.`);
    return this.exerciseModel.findById(id).populate('equipment').exec();
  }

  async update(
    id: string,
    createExerciseDto: CreateExerciseDto,
  ): Promise<Exercise> {
    const exercise = await this.exerciseModel.findById(id).exec();

    if (exercise) {
      this.logger.debug(`Exercise ID ${id} updated.`);
      return exercise.updateOne(createExerciseDto);
    } else {
      this.logger.error(`Exercise ID ${id} not found.`);
      throw new NotFoundException(
        `Упражнение с идентификатором ${id} не найдено`,
      );
    }
  }

  async delete(id: string): Promise<void> {
    const exercise = await this.exerciseModel.findById(id).exec();

    if (exercise) {
      this.logger.debug(`Exercise ID ${id} deleted.`);
      exercise.deleteOne();
    } else {
      this.logger.error(`Exercise ID ${id} not found.`);
      throw new NotFoundException(
        `Упражнение с идентификатором ${id} не найдено`,
      );
    }
  }
}
