import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';
import { Task } from '../task/task.entity';
import { Comment } from 'src/comment/comment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true }) // Store Google ID for OAuth users
  googleId: string;

  @Column({ default: 'local' }) // 'local' for regular login, 'google' for OAuth users
  authProvider: string;

  // Many-to-Many relationship with Task
  @ManyToMany(() => Task, (task) => task.users)
  tasks: Task[];

  @Column('simple-array')
  roles: string[]; // e.g., ['admin', 'user']

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
