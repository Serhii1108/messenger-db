import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: uuid;

  @Column()
  login: string;

  @Column()
  phoneNumber: string;

  @Column('date')
  createdAt: Date;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;
}
