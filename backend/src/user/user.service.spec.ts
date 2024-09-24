import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      const email = 'test@example.com';
      const user = new User();
      user.email = email;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      expect(await service.findByEmail(email)).toBe(user);
    });

    it('should return null if user not found', async () => {
      const email = 'test@example.com';

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      expect(await service.findByEmail(email)).toBeNull();
    });
  });

  describe('getProfile', () => {
    it('should return a user if found', async () => {
      const id = 1;
      const user = new User();
      user.id = id;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      expect(await service.getProfile(id)).toBe(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      const id = 1;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getProfile(id)).rejects.toThrow(NotFoundException);
    });
  });
});
