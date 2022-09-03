import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

import { User } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserLoginDto } from './dto/update-user.dto.js';
import { UpdatePasswordDto } from './dto/update-password.dto.js';
import { DeleteUserDto } from './dto/delete-user.dto.js';

import { hashPassword } from '../../utils/hashPassword.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create({ login, password, phoneNumber }: CreateUserDto): Promise<User> {
    const createdAt = new Date();
    const hashedPass = await hashPassword(password);

    await this.checkUniq(login);

    const createdUser: User = this.usersRepository.create({
      login,
      createdAt,
      phoneNumber,
      password: hashedPass,
    });

    await this.usersRepository.save(createdUser);

    return await this.findOne(createdUser.id);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: uuid): Promise<User> {
    const user: User | undefined = await this.usersRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async updateUserLogin(
    id: uuid,
    { login: newLogin }: UpdateUserLoginDto,
  ): Promise<User> {
    const user: User = await this.findOne(id);

    await this.checkUniq(newLogin);

    user.login = newLogin ?? user.login;

    await this.usersRepository.save(user);

    return await this.findOne(user.id);
  }

  async updatePassword(
    id: uuid,
    { oldPassword, newPassword }: UpdatePasswordDto,
  ): Promise<User> {
    const user: User = await this.findOne(id);

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) throw new ForbiddenException('Password is wrong');

    const hash = await hashPassword(newPassword);
    user.password = hash;

    await this.usersRepository.save(user);

    return await this.findOne(user.id);
  }

  async remove(id: uuid, { password }: DeleteUserDto) {
    const user: User = await this.findOne(id);

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new ForbiddenException('Password is wrong');

    await this.usersRepository.delete(user);
  }

  private async checkUniq(login: string) {
    if ((await this.usersRepository.findOneBy({ login })) === null) {
      throw new ForbiddenException('User with this login already exist');
    }
  }
}
