import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { User } from '../user/user.entity';
import { CreateTaskDto } from './dto/create-task.dto'; // DTO for task creation
import { UpdateTaskDto } from './dto/update-task.dto'; // DTO for task update

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>, // Inject Task repository
    @InjectRepository(User) private userRepository: Repository<User>, // Inject User repository
  ) {}

  /**
   * Create a task assigned to a specific user
   */
  async createTask(
    createTaskDto: CreateTaskDto,
    userId: string,
  ): Promise<Task> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const task = this.taskRepository.create({
      ...createTaskDto,
      user, // Assign the task to the user
    });

    return this.taskRepository.save(task);
  }

  /**
   * Retrieve all task (admin-only)
   */
  async findAll(): Promise<Task[]> {
    const tasks = await this.taskRepository.find({
      relations: ['user'], // Include the user information
    });
    return tasks.length ? tasks : [];
  }

  /**
   * Retrieve task assigned to a specific user
   */
  async findTaskByUser(userId: string): Promise<Task[]> {
    const tasks = await this.taskRepository.find({
      where: { user: { id: userId } }, // Filter by user ID
      relations: ['user'],
    });
    return tasks.length ? tasks : [];
  }

  /**
   * Retrieve a specific task by ID, ensuring it's the user's task
   */
  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!task) {
      throw new NotFoundException(
        `Task with ID ${id} not found`,
      );
    }

    return task;
  }

  /**
   * Update a task if the user owns it
   */
  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);

    Object.assign(task, updateTaskDto);
    return this.taskRepository.save(task);
  }

  /**
   * Delete a task
   */
  async removeTask(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}
