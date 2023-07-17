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

    createdExercise.save();

    this.logger.debug(`Exercise ${createExerciseDto.name} created.`);

    const { similar } = createExerciseDto;

    if (similar?.length) {
      await this.exerciseModel.updateMany(
        { _id: { $in: similar } },
        {
          $addToSet: {
            similar: createdExercise._id,
          },
        },
      );
    }

    return createdExercise;
  }

  async getList(
    getExerciseDto: GetExerciseDto,
  ): Promise<{ items: Exercise[]; count: number }> {
    const { search, exclude, limit = '10', offset = '0' } = getExerciseDto;

    const filterQuery: FilterQuery<Exercise> = {};

    if (search) {
      filterQuery.name = { $regex: search, $options: 'i' };
    }

    if (exclude) {
      filterQuery._id = { $nin: exclude.map((id) => id) };
    }

    const items = await this.exerciseModel
      .find(filterQuery)
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .populate('equipment')
      .populate('similar')
      .exec();

    const count = await this.exerciseModel.find(filterQuery).countDocuments();

    this.logger.debug(`Get exercises.`);

    return { items, count };
  }

  async getById(id: string): Promise<Exercise | null> {
    this.logger.debug(`Get exercise ID ${id}.`);
    return this.exerciseModel
      .findById(id)
      .populate('equipment')
      .populate('similar')
      .exec();
  }

  async update(
    id: string,
    createExerciseDto: CreateExerciseDto,
  ): Promise<Exercise> {
    const exercise = await this.exerciseModel.findById(id).exec();

    if (exercise) {
      this.logger.debug(`Exercise ID ${id} updated.`);

      const { similar } = createExerciseDto;

      if (similar?.length) {
        await this.exerciseModel.updateMany(
          { _id: { $in: similar } },
          {
            $addToSet: {
              similar: id,
            },
          },
        );
      }

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
