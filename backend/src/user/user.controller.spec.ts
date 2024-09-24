import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getProfile: jest.fn(),
            getAllUsers: jest.fn(),
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

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  const userId = 1;
  const user = {
    id: userId,
    name: 'Test User',
    email: 'test@example.com',
    password: 'password',
    googleId: null,
    authProvider: 'local',
    tasks: [],
    roles: [],
    comments: [],
  };

  describe('getMyProfile', () => {
    it('should return the profile of the logged-in user', async () => {
      jest.spyOn(service, 'getProfile').mockResolvedValue(user);

      expect(await controller.getMyProfile({ user: { userId } })).toBe(user);
    });
  });

  describe('getProfile', () => {
    it('should return the profile of a user by ID', async () => {
      jest.spyOn(service, 'getProfile').mockResolvedValue(user);

      expect(await controller.getProfile(userId)).toBe(user);
    });
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const users = [user];

      jest.spyOn(service, 'getAllUsers').mockResolvedValue(users);

      expect(await controller.getAllUsers()).toBe(users);
    });
  });
});
