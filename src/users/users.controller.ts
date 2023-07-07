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
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { GetUser } from 'src/_common/decorators/get-user.decorator';
import { GetUserDto } from './dto/get-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/current')
  @UseGuards(AuthGuard('jwt'))
  getCurrent(@GetUser('_id') userId: string): Promise<User> {
    return this.usersService.getById(userId);
  }

  @Get()
  getUserList(
    @Query() getUserDto: GetUserDto,
  ): Promise<{ items: User[]; count: number }> {
    return this.usersService.getList(getUserDto);
  }

  @Get('/:id')
  async getUserByID(@Param('id') id: string): Promise<User | null> {
    return this.usersService.getById(id);
  }

  @Post()
  addUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Patch('/:id')
  updateUser(
    @Param('id') id: string,
    @Body() createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, createUserDto);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(id);
  }
}
