export interface Message {
  senderId: uuid;
  message: string;
  messageId: number;
  isSeen: boolean;
  sendDate: Date;
}

export interface SendMessageModel {
  message: Message;
  chatId: string;
}

export enum socketEvents {
  JOIN_ROOM = 'join_room',
  SEND_MESSAGE = 'send_message',
  SHARE_MESSAGE = 'share_message',
  CHAT_ONLINE = 'chat_online',
  CHAT_OFFLINE = 'chat_offline',
  CHECK_ONLINE = 'check_online',
}
