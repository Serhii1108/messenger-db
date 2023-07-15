export interface Message {
  senderId: uuid;
  message: string;
  messageId: number;
  isSeen: boolean;
  sendDate: Date;
}
