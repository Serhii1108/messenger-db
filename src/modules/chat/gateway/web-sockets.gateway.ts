import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { ChatService } from '../services/chat.service.js';
import { SendMessageModel, socketEvents } from '../models/message.model.js';
import { Chat } from '../entities/chat.entity.js';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebSocketsGateway {
  constructor(private chatService: ChatService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage(socketEvents.JOIN_ROOM)
  async handleJoinRoom(
    client: Socket,
    payload: {
      roomName: string;
    },
  ): Promise<void> {
    client.join(payload.roomName);

    if ((await this.server.in(payload.roomName).fetchSockets()).length === 2) {
      this.server
        .to(payload.roomName)
        .emit(socketEvents.CHAT_ONLINE, { chatId: payload.roomName });
    }
  }

  @SubscribeMessage(socketEvents.SEND_MESSAGE)
  async handleSendMessage(client: Socket, payload: SendMessageModel) {
    this.chatService.update(payload.chatId, { message: payload.message });
    this.server.to(payload.chatId).emit(socketEvents.SHARE_MESSAGE, payload);
  }

  @SubscribeMessage(socketEvents.CHECK_ONLINE)
  async handleCheckOnline(
    client: Socket,
    payload: {
      roomName: string;
    },
  ) {
    if ((await this.server.in(payload.roomName).fetchSockets()).length !== 2) {
      this.server
        .to(payload.roomName)
        .emit(socketEvents.CHAT_OFFLINE, { chatId: payload.roomName });
    }
  }

  @SubscribeMessage(socketEvents.MARK_MESSAGES_AS_READ)
  async handleMarkMessagesAsRead(
    client: Socket,
    payload: {
      roomName: string;
      userId: uuid;
    },
  ) {
    const chat: Chat = await this.chatService.updateMessagesSeen(
      payload.roomName,
      payload.userId,
    );
    this.server.to(payload.roomName).emit(socketEvents.MESSAGES_READ, { chat });
  }
}
