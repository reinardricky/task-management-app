import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Task } from './task.entity';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: {
            findTasksByUser: jest.fn(),
            findOne: jest.fn(),
            assignUsersToTask: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest();
          request.user = { userId: 1 }; // Mock user
          return true;
        },
      })
      .compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findMyTask', () => {
    it('should return tasks assigned to the user', async () => {
      const userId = 1;
      const tasks: Task[] = [
        {
          id: 1,
          title: 'Test Task',
          description: 'Test Description',
          status: 'In Progress',
          dueDate: new Date(),
          comments: [],
          users: [],
        },
      ];

      jest.spyOn(service, 'findTasksByUser').mockResolvedValue(tasks);

      expect(await controller.findMyTask({ user: { userId } })).toBe(tasks);
      expect(service.findTasksByUser).toHaveBeenCalledWith(userId);
    });
  });

  describe('findTaskById', () => {
    it('should return a task by ID', async () => {
      const taskId = 1;
      const task: Task = {
        id: taskId,
        title: 'Test Task',
        description: 'Test Description',
        status: 'In Progress',
        dueDate: new Date(),
        comments: [],
        users: [],
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(task);

      expect(await controller.findTaskById(taskId, { user: { userId: 1 } })).toBe(task);
      expect(service.findOne).toHaveBeenCalledWith(taskId);
    });

    it('should throw NotFoundException if task is not found', async () => {
      const taskId = 1;

      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findTaskById(taskId, { user: { userId: 1 } })).rejects.toThrow(NotFoundException);
    });
  });

  describe('assignUsers', () => {
    it('should assign users to a task and return the task', async () => {
      const taskId = 1;
      const userIds = [1, 2, 3];
      const task: Task = {
        id: taskId,
        title: 'Test Task',
        description: 'Test Description',
        status: 'In Progress',
        dueDate: new Date(),
        comments: [],
        users: [],
      };

      jest.spyOn(service, 'assignUsersToTask').mockResolvedValue(task);

      expect(await controller.assignUsers(taskId, userIds)).toBe(task);
      expect(service.assignUsersToTask).toHaveBeenCalledWith(taskId, userIds);
    });

    it('should throw NotFoundException if task is not found', async () => {
      const taskId = 1;
      const userIds = [1, 2, 3];

      jest.spyOn(service, 'assignUsersToTask').mockRejectedValue(new NotFoundException());

      await expect(controller.assignUsers(taskId, userIds)).rejects.toThrow(NotFoundException);
    });
  });
});