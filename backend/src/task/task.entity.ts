import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: string; // To Do, In Progress, Done, etc.

  @Column()
  dueDate: Date;

  // Many Task belong to one User
  @ManyToMany(() => User, (user) => user.tasks)
  @JoinTable()
  users: User[];
}
