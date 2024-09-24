import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Task } from './task.entity';  // Import the Task entity
import { User } from '../user/user.entity';  // Import the User entity if needed
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User]),  // Register Task and User entities with TypeORM
    NotificationModule,
  ],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
