import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import bcrypt from 'bcrypt';

import { User } from '../entities/user.entity.js';
import { CreateUserDto } from '../dto/create-user.dto.js';
import { UpdateUserLoginDto } from '../dto/update-user.dto.js';
import { UpdatePasswordDto } from '../dto/update-password.dto.js';

import { hashPassword } from '../../../utils/hashPassword.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create({ login, password, phoneNumber }: CreateUserDto): Promise<User> {
    const createdAt = new Date();
    const hashedPass = await hashPassword(password);

    await this.checkUniq(login, phoneNumber);

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

  async findOneByLogin(login: string): Promise<User> {
    const user: User | undefined = await this.usersRepository.findOneBy({
      login,
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findAllByLogin(login: string): Promise<User[]> {
    const user: User[] | undefined = await this.usersRepository.findBy({
      login: Like(`%${login}%`),
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async updateUserLogin(
    id: uuid,
    { login: newLogin, phoneNumber: newPhoneNumber }: UpdateUserLoginDto,
  ): Promise<User> {
    const user: User = await this.findOne(id);

    await this.checkUniq(newLogin ?? '', newPhoneNumber ?? '');

    user.login = newLogin ?? user.login;
    user.phoneNumber = newPhoneNumber ?? user.phoneNumber;

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

  async remove(id: uuid) {
    const user: User = await this.findOne(id);
    await this.usersRepository.delete(user);
  }

  private async checkUniq(login: string, phoneNumber: string) {
    if ((await this.usersRepository.findOneBy({ login })) !== null) {
      throw new ForbiddenException('User with this login already exist');
    }
    if ((await this.usersRepository.findOneBy({ phoneNumber })) !== null) {
      throw new ForbiddenException('User with this phone number already exist');
    }
  }
}
