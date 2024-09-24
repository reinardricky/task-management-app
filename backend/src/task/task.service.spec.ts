import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { NotificationGateway } from '../notification/notification.gateway';

describe('TaskService', () => {
  let service: TaskService;
  let taskRepository: Repository<Task>;
  let userRepository: Repository<User>;
  let notificationGateway: NotificationGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: NotificationGateway,
          useValue: {
            sendCommentNotification: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    notificationGateway = module.get<NotificationGateway>(NotificationGateway);
  });

  describe('assignUsersToTask', () => {
    it('should throw NotFoundException if task is not found', async () => {
      const taskId = 1;
      const userIds = [1, 2, 3];

      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(null);

      await expect(service.assignUsersToTask(taskId, userIds)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if no users are found', async () => {
      const taskId = 1;
      const userIds = [1, 2, 3];
      const task = new Task();

      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(task);
      jest.spyOn(userRepository, 'findByIds').mockResolvedValue([]);

      await expect(service.assignUsersToTask(taskId, userIds)).rejects.toThrow(NotFoundException);
    });

    it('should assign users to the task and save it', async () => {
      const taskId = 1;
      const userIds = [1, 2, 3];
      const task = new Task();
      const users = [new User(), new User(), new User()];

      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(task);
      jest.spyOn(userRepository, 'findByIds').mockResolvedValue(users);
      jest.spyOn(taskRepository, 'save').mockResolvedValue(task);

      const result = await service.assignUsersToTask(taskId, userIds);

      expect(result).toBe(task);
      expect(task.users).toBe(users);
      expect(taskRepository.save).toHaveBeenCalledWith(task);
    });
  });
});