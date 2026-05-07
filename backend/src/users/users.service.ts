import { ConflictException, Injectable } from '@nestjs/common';
import { User } from 'src/interfaces/user.interface';

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: 1,
      name: 'Test User 1',
      email: 'test1@mail.com',
      password: 'password1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: 'Test User 2',
      email: 'test2@mail.com',
      password: 'password2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  findOneByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
  }

  signUp(email: string, password: string, name: string): User {
    const existingUser = this.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    const newUser: User = {
      id: this.users.length + 1,
      name,
      email,
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }
}