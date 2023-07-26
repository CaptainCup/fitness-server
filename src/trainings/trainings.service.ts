import { Model, FilterQuery } from 'mongoose';
import * as moment from 'moment';
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Training } from './schemas/training.schema';
import { CreateTrainingDto } from './dto/create-training.dto';
import { GetTrainingDto } from './dto/get-training.dto';
import { LastExerciseResultsDto } from './dto/last-exercise-results.dto';
import { GetTrainingDatesDto } from './dto/get-dates.dto';

@Injectable()
export class TrainingsService {
  private logger = new Logger('Trainings');

  constructor(
    @InjectModel(Training.name) private trainingModel: Model<Training>,
  ) {}

  async create(createTrainingDto: CreateTrainingDto): Promise<Training> {
    const createdTraining = new this.trainingModel(createTrainingDto);
    this.logger.debug(`Training ${createTrainingDto.date} created.`);
    return createdTraining.save();
  }

  async getList(
    getTrainingDto: GetTrainingDto,
  ): Promise<{ items: Training[]; count: number }> {
    const {
      user,
      date,
      limit = '10',
      offset = '0',
      exercises,
    } = getTrainingDto;

    const filterQuery: FilterQuery<Training> = {};

    if (user) {
      filterQuery.user = user;
    }

    if (date) {
      const fromDate = moment(date).startOf('day').toDate();
      const toDate = moment(date).endOf('day').toDate();

      filterQuery.date = {
        $gte: fromDate,
        $lte: toDate,
      };
    }

    if (exercises?.length) {
      filterQuery['exercises.exercise'] = { $in: exercises };
    }

    const items = await this.trainingModel
      .find(filterQuery)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .populate('exercises.exercise')
      .exec();

    const count = await this.trainingModel.find(filterQuery).countDocuments();

    this.logger.debug(`Get trainings.`);

    return { items, count };
  }

  async getDates(getTrainingDatesDto: GetTrainingDatesDto): Promise<Date[]> {
    const { user } = getTrainingDatesDto;

    const dates = await this.trainingModel
      .find({ user }, { date: 1 })
      .sort({ date: -1 })
      .exec();

    this.logger.debug(`Get trainings dates.`);

    if (dates.length) {
      return dates.map(({ date }) => date);
    } else {
      throw new NotFoundException('Тренировок не найдено');
    }
  }

  async getById(id: string): Promise<Training | null> {
    this.logger.debug(`Get training ID ${id}.`);
    return this.trainingModel
      .findById(id)
      .populate('exercises.exercise')
      .exec();
  }

  async update(
    id: string,
    createTrainingDto: CreateTrainingDto,
  ): Promise<Training> {
    const training = await this.trainingModel.findById(id).exec();

    if (training) {
      this.logger.debug(`Training ID ${id} updated.`);
      return training.updateOne(createTrainingDto);
    } else {
      this.logger.error(`Training ID ${id} not found.`);
      throw new NotFoundException(
        `Тренировка с идентификатором ${id} не найдена`,
      );
    }
  }

  async delete(id: string): Promise<void> {
    const training = await this.trainingModel.findById(id).exec();

    if (training) {
      this.logger.debug(`Training ID ${id} deleted.`);
      training.deleteOne();
    } else {
      this.logger.error(`Training ID ${id} not found.`);
      throw new NotFoundException(
        `Тренировка с идентификатором ${id} не найдена`,
      );
    }
  }

  async lastExerciseResults(
    lastExerciseResultsDto: LastExerciseResultsDto,
  ): Promise<{ approaches: string[][]; date: Date } | null> {
    const { user: userId, exercise: exerciseId } = lastExerciseResultsDto;

    this.logger.debug(`Last results for exercise ID ${exerciseId}.`);

    const items = await this.trainingModel
      .find({
        user: userId,
        exercises: {
          $elemMatch: {
            exercise: exerciseId,
            approaches: { $ne: [] },
          },
        },
      })
      .sort({ date: -1 })
      .exec();

    if (items.length) {
      const lastTrainingWithExercise = items[0];
      const currentExercise = lastTrainingWithExercise.exercises.find(
        ({ exercise }) => exercise.toString() === exerciseId,
      );
      return currentExercise?.approaches
        ? {
            approaches: currentExercise?.approaches,
            date: lastTrainingWithExercise.date,
          }
        : null;
    }

    return null;
  }
}
