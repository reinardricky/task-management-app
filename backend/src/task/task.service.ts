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
import { NotificationGateway } from 'src/notification/notification.gateway';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>, // Inject Task repository
    @InjectRepository(User) private userRepository: Repository<User>, // Inject User repository
    private notificationGateway: NotificationGateway,
  ) {}

  /**
   * Create a task assigned to a specific user
   */
  async createTask(
    createTaskDto: CreateTaskDto,
    userIds: number[],
  ): Promise<Task> {
    const { title, description, status, dueDate } = createTaskDto;

    // Find users by their IDs
    const users = await this.userRepository.findByIds(userIds);
    if (!users.length) {
      throw new NotFoundException('No valid users found for task assignment');
    }

    const task = this.taskRepository.create({
      title,
      description,
      status,
      dueDate,
      users, // Assign the found users to the task
    });

    // Send notification to each assigned user
    userIds.forEach((userId) => {
      this.notificationGateway.sendTaskAssignmentNotification(userId, task);
    });

    return this.taskRepository.save(task);
  }
  /**
   * Retrieve all task (admin-only)
   */
  async findAll(): Promise<Task[]> {
    const tasks = await this.taskRepository.find({
      relations: ['users'], // Include the user information
    });
    return tasks.length ? tasks : [];
  }

  /**
   * Retrieve task assigned to a specific user
   */
  async findTasksByUser(userId: number): Promise<Task[]> {
    // Find tasks where the user is part of the assigned users
    return this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.users', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  /**
   * Retrieve a specific task by ID, ensuring it's the user's task
   */
  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.users', 'user')
      .addSelect(['user.id', 'user.email'])
      .where('task.id = :id', { id })
      .getOne();

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  /**
   * Update a task if the user owns it
   */
  async updateTask(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.users', 'user')
      .addSelect(['user.id', 'user.email'])
      .where('task.id = :id', { id })
      .getOne();

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    // Fetch users based on userIds
    const users = await this.userRepository.findByIds(updateTaskDto.userIds);

    // Assign users to the task
    task.users = users;

    // Update other task properties
    Object.assign(task, updateTaskDto);

    // Send notification to each assigned user
    updateTaskDto.userIds.forEach((userId) => {
      this.notificationGateway.sendTaskAssignmentNotification(userId, task);
    });

    return this.taskRepository.save(task);
  }

  /**
   * Delete a task
   */
  async removeTask(id: number): Promise<void> {
    const task = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.users', 'user')
      .addSelect(['user.id', 'user.email'])
      .where('task.id = :id', { id })
      .getOne();

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const result = await this.taskRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  // Assign multiple users to a task
  async assignUsersToTask(taskId: number, userIds: number[]): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['users'],
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Find all users by their IDs
    const users = await this.userRepository.findByIds(userIds);
    if (!users.length) {
      throw new NotFoundException('No users found');
    }

    task.users = users; // Assign multiple users to the task
    return this.taskRepository.save(task);
  }
}
