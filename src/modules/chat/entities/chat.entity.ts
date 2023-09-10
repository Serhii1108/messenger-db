import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../../users/entities/user.entity.js';
import { Message } from '../models/message.model.js';

@Entity('chat')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: uuid;

  @ManyToOne(() => User)
  user1: User;

  @ManyToOne(() => User)
  user2: User;

  @Column('json')
  conversation: Message[];

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'boolean', default: false })
  isOnline: boolean;
}
