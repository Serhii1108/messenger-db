import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { ChatService } from './services/chat.service.js';
import { CreateChatDto } from './dto/create-chat.dto.js';
import { UpdateChatDto } from './dto/update-chat.dto.js';
import { Chat } from './entities/chat.entity.js';

@Controller('api/chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async create(@Body() createChatDto: CreateChatDto): Promise<Chat> {
    return await this.chatService.create(createChatDto);
  }

  @Get('/all')
  async findAll(): Promise<Chat[]> {
    return await this.chatService.findAll();
  }

  @Get('/all/:id')
  async findAllUserChats(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: uuid,
  ): Promise<Chat[]> {
    return await this.chatService.findAllUserChats(id);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return await this.chatService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: uuid,
    @Body() updateChatDto: UpdateChatDto,
  ) {
    return this.chatService.update(id, updateChatDto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: uuid) {
    return await this.chatService.remove(id);
  }
}
