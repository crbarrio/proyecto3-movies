import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return movies by user id', () => {
    const result = service.findMoviesByUserId(1);

    expect(result).toHaveLength(2);
    expect(result.every((movie) => movie.userId === 1)).toBe(true);
  });

  it('should update a movie for a user', () => {
    const result = service.updateMovieForUser(1, 1, {
      favorite: false,
      score: 9,
    });

    expect(result.userId).toBe(1);
    expect(result.movieId).toBe(1);
    expect(result.favorite).toBe(false);
    expect(result.score).toBe(9);
    expect(result.watched).toBe(true);
  });

  it('should throw bad request when no fields are provided', () => {
    expect(() => service.updateMovieForUser(1, 1, {})).toThrow(
      BadRequestException,
    );
  });

  it('should throw not found when movie does not exist for user', () => {
    expect(() =>
      service.updateMovieForUser(1, 999, {
        watched: false,
      }),
    ).toThrow(NotFoundException);
  });
});
