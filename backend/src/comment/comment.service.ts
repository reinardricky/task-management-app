import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { User } from '../user/user.entity';
import { Task } from '../task/task.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { NotificationGateway } from 'src/notification/notification.gateway';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private notificationGateway: NotificationGateway,
  ) {}

  // Create a comment for a task
  async createComment(
    createCommentDto: CreateCommentDto,
    userId: number,
  ): Promise<Comment> {
    const { content, taskId } = createCommentDto;
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['users'],
    });
    const user = await this.userRepository.findOne({ where: { id: userId } });

    const comment = this.commentRepository.create({ content, task, user });

    if (!task) {
      throw new Error('Task not found');
    }

    // Notify all users assigned to the task
    task.users.forEach((assignedUser) => {
      this.notificationGateway.sendCommentNotification(
        assignedUser.id,
        comment,
      );
    });

    return this.commentRepository.save(comment);
  }

  // Get comments for a specific task
  async getCommentsForTask(taskId: number): Promise<Comment[]> {
    return this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where('comment.taskId = :taskId', { taskId })
      .orderBy('comment.createdAt', 'DESC')
      .getMany();
  }
}
