import { IsNotEmpty, IsString } from 'class-validator';
import { Message } from '../models/message.model.js';

export class UpdateChatDto {
  @IsString()
  @IsNotEmpty()
  message: Message;
}
