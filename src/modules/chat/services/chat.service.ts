import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateChatDto } from '../dto/create-chat.dto.js';
import { UpdateChatDto } from '../dto/update-chat.dto.js';
import { Chat } from '../entities/chat.entity.js';
import { User } from 'src/modules/users/entities/user.entity.js';
import { UsersService } from '../../users/services/users.service.js';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    private userService: UsersService,
  ) {}

  async create({ user1Id, user2Id }: CreateChatDto): Promise<Chat> {
    const createdAt = new Date();
    const user1: User = await this.userService.findOne(user1Id);
    const user2: User = await this.userService.findOne(user2Id);

    const createdChat: Chat = this.chatRepository.create({
      user1,
      user2,
      createdAt,
      conversation: [],
    });

    await this.chatRepository.save(createdChat);
    return await this.findOne(createdChat.id);
  }

  async findAll(): Promise<Chat[]> {
    const chats: Chat[] = this.removePassword(
      await this.chatRepository.find({
        relations: ['user1', 'user2'],
      }),
    );

    return chats;
  }

  async findAllUserChats(userId: uuid): Promise<Chat[]> {
    const user: User = await this.userService.findOne(userId);

    const chats: Chat[] = this.removePassword(
      await this.chatRepository.find({
        where: [{ user1: user }, { user2: user }],
        relations: ['user1', 'user2'],
      }),
    );

    return chats;
  }

  async findOne(id: uuid): Promise<Chat> {
    const chat: Chat | undefined = await this.chatRepository.findOne({
      where: { id },
      relations: ['user1', 'user2'],
    });

    if (!chat) throw new NotFoundException('Chat not found');

    return this.removePassword([chat])[0];
  }

  async update(chatId: uuid, { message }: UpdateChatDto): Promise<Chat> {
    const chat: Chat = await this.findOne(chatId);
    chat.conversation.push(message);
    await this.chatRepository.save(chat);
    return await this.findOne(chatId);
  }

  async remove(chatId: uuid) {
    const chat: Chat = await this.findOne(chatId);
    await this.chatRepository.delete(chat.id);
  }

  private removePassword(chats: Chat[]): Chat[] {
    return chats.map((chat: Chat) => {
      delete chat.user1.password;
      delete chat.user2.password;
      return chat;
    });
  }
}
