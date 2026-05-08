import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

jest.mock('argon2', () => ({
  hash: jest.fn(),
  verify: jest.fn(),
}));

jest.mock('src/users/users.service', () => ({
  UsersService: class UsersService {},
}));

import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: {
    findOneByEmail: jest.Mock;
    signUp: jest.Mock;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn(),
            signUp: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('throws ConflictException when email already exists', async () => {
    usersService.findOneByEmail.mockResolvedValue({
      id: 1,
      name: 'User',
      email: 'user@example.com',
      password: 'hashed-password',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(
      service.signUp({
        name: 'User',
        email: 'user@example.com',
        password: 'plain-password',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
