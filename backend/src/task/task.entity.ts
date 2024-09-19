import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: string; // To Do, In Progress, Done, etc.

  @Column()
  dueDate: Date;

  // Many Task belong to one User
  @ManyToOne(() => User, (user) => user.task, { eager: true }) // Define the inverse relationship
  user: User; // The User who is assigned this task
}
