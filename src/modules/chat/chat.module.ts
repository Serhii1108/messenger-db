import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { ChatService } from './services/chat.service.js';
import { ChatController } from './chat.controller.js';
import { Chat } from './entities/chat.entity.js';
import { User } from '../users/entities/user.entity.js';
import { UsersService } from '../users/services/users.service.js';
import { WebSocketsGateway } from './gateway/web-sockets.gateway.js';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, User])],
  controllers: [ChatController],
  providers: [ChatService, UsersService, JwtService, WebSocketsGateway],
})
export class ChatModule {}
