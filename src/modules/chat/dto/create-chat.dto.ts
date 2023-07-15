import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatDto {
  @IsString()
  @IsNotEmpty()
  user1Id: uuid;

  @IsString()
  @IsNotEmpty()
  user2Id: uuid;
}
