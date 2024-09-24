import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Comment } from '../comment/comment.entity';

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

  @OneToMany(() => Comment, (comment) => comment.task)
  comments: Comment[];
}
