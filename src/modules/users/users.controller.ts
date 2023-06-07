import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  ParseUUIDPipe,
  Put,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import { User } from './entities/user.entity.js';
import { UsersService } from './services/users.service.js';

import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserLoginDto } from './dto/update-user.dto.js';
import { UpdatePasswordDto } from './dto/update-password.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('api/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get('/login/:login')
  async findOneByLogin(@Param('login') login: string): Promise<User> {
    return await this.usersService.findOneByLogin(login);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: uuid,
  ): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  async updateUserLogin(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: uuid,
    @Body() updateUserDto: UpdateUserLoginDto,
  ): Promise<User> {
    return await this.usersService.updateUserLogin(id, updateUserDto);
  }

  @Put(':id')
  async updatePassword(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: uuid,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    return await this.usersService.updatePassword(id, updatePasswordDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: uuid) {
    return await this.usersService.remove(id);
  }
}
