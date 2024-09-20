import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Task } from '../task/task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true }) // Store Google ID for OAuth users
  googleId: string;

  @Column({ default: 'local' }) // 'local' for regular login, 'google' for OAuth users
  authProvider: string;

  @OneToMany(() => Task, (task) => task.user)
  task: Task[];

  @Column('simple-array')
  roles: string[]; // e.g., ['admin', 'user']
}
