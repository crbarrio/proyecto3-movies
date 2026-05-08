import 'dotenv/config';

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/generated/prisma/client';

describe('MoviesService', () => {
  let service: MoviesService;
  let prisma: PrismaService;
  let testUser: User;

  const testUserEmail = 'movies-service-spec@example.com';
  const existingMovieId = 10001;
  const secondMovieId = 10002;
  const newMovieId = 10003;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService, PrismaService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    prisma = module.get<PrismaService>(PrismaService);

    await prisma.$connect();

    testUser = await prisma.user.upsert({
      where: { email: testUserEmail },
      update: { name: 'Movies Service Spec User' },
      create: {
        name: 'Movies Service Spec User',
        email: testUserEmail,
        password: 'hashed-password-for-tests',
      },
    });
  });

  beforeEach(async () => {
    await prisma.movieUser.deleteMany({
      where: { userId: testUser.id },
    });
  });

  afterAll(async () => {
    if (!testUser) {
      await prisma.$disconnect();
      return;
    }

    await prisma.movieUser.deleteMany({
      where: { userId: testUser.id },
    });

    await prisma.user.delete({
      where: { id: testUser.id },
    });

    await prisma.$disconnect();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return movies by user id', async () => {
    await prisma.movieUser.createMany({
      data: [
        {
          userId: testUser.id,
          movieId: existingMovieId,
          favorite: true,
          watched: true,
          score: 8,
        },
        {
          userId: testUser.id,
          movieId: secondMovieId,
          favorite: false,
          watched: true,
          score: 7,
        },
      ],
    });

    const result = await service.findMoviesByUserId(testUser.id);

    expect(result).toHaveLength(2);
    expect(result.every((movie) => movie.userId === testUser.id)).toBe(true);
  });

  it('should update a movie for an existing user movie relation', async () => {
    await prisma.movieUser.create({
      data: {
        userId: testUser.id,
        movieId: existingMovieId,
        favorite: true,
        watched: true,
        score: 8,
      },
    });

    const result = await service.upsertMovieForUser(testUser.id, existingMovieId, {
      favorite: false,
      score: 9,
    });

    expect(result.userId).toBe(testUser.id);
    expect(result.movieId).toBe(existingMovieId);
    expect(result.favorite).toBe(false);
    expect(result.score).toBe(9);
    expect(result.watched).toBe(true);
  });

  it('should create a movie relation when it does not exist', async () => {
    const result = await service.upsertMovieForUser(testUser.id, newMovieId, {
      watched: true,
    });

    expect(result.userId).toBe(testUser.id);
    expect(result.movieId).toBe(newMovieId);
    expect(result.watched).toBe(true);
    expect(result.favorite).toBe(false);
    expect(result.score).toBeNull();
  });

  it('should throw bad request when no fields are provided', async () => {
    await expect(service.upsertMovieForUser(testUser.id, existingMovieId, {})).rejects.toThrow(
      BadRequestException,
    );
  });
});
