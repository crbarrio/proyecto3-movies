import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TmdbService } from 'src/tmdb/tmdb.service';
import { TMDBMovieResponse } from 'src/interfaces/tmdb-movie.interface';

describe('MoviesService', () => {
  let service: MoviesService;
  let prisma: {
    movieUser: {
      findMany: jest.Mock;
      upsert: jest.Mock;
    };
  };
  let tmdbService: {
    getTrendingMovies: jest.Mock;
  };

  const testUserId = 1;
  const existingMovieId = 10001;
  const secondMovieId = 10002;
  const newMovieId = 10003;
  const trendingMovieId = 10004;
  const unmatchedTrendingMovieId = 10005;

  beforeEach(async () => {
    prisma = {
      movieUser: {
        findMany: jest.fn(),
        upsert: jest.fn(),
      },
    };

    tmdbService = {
      getTrendingMovies: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        PrismaService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
        {
          provide: TmdbService,
          useValue: tmdbService,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return movies by user id', async () => {
    const storedMovies = [
      {
        id: 1,
        userId: testUserId,
        movieId: existingMovieId,
        favorite: true,
        watched: true,
        score: 8,
      },
      {
        id: 2,
        userId: testUserId,
        movieId: secondMovieId,
        favorite: false,
        watched: true,
        score: 7,
      },
    ];

    prisma.movieUser.findMany.mockResolvedValue(storedMovies);

    const result = await service.findMoviesByUserId(testUserId);

    expect(result).toHaveLength(2);
    expect(prisma.movieUser.findMany).toHaveBeenCalledWith({ where: { userId: testUserId } });
    expect(result.every((movie) => movie.userId === testUserId)).toBe(true);
  });

  it('should enrich trending movies with user metadata when matches exist', async () => {
    const tmdbMovieResponse: TMDBMovieResponse = {
      page: 1,
      results: [
        {
          adult: false,
          backdrop_path: '/backdrop-a.jpg',
          id: trendingMovieId,
          title: 'Matched movie',
          original_title: 'Matched movie',
          overview: 'Matched overview',
          poster_path: '/poster-a.jpg',
          media_type: 'movie',
          original_language: 'en',
          genre_ids: [28],
          popularity: 10,
          release_date: new Date('2026-01-01'),
          softcore: false,
          video: false,
          vote_average: 7.5,
          vote_count: 100,
        },
        {
          adult: false,
          backdrop_path: '/backdrop-b.jpg',
          id: unmatchedTrendingMovieId,
          title: 'Unmatched movie',
          original_title: 'Unmatched movie',
          overview: 'Unmatched overview',
          poster_path: '/poster-b.jpg',
          media_type: 'movie',
          original_language: 'en',
          genre_ids: [12],
          popularity: 9,
          release_date: new Date('2026-01-02'),
          softcore: false,
          video: false,
          vote_average: 6.8,
          vote_count: 50,
        },
      ],
      total_pages: 1,
      total_results: 2,
    };

    prisma.movieUser.findMany.mockResolvedValue([
      {
        movieId: trendingMovieId,
        favorite: true,
        watched: true,
        score: 8,
      },
    ]);

    tmdbService.getTrendingMovies.mockResolvedValue(tmdbMovieResponse);

    const result = await service.getTrendingMovies(1, null, testUserId);

    expect(tmdbService.getTrendingMovies).toHaveBeenCalledWith(1, null);
    expect(prisma.movieUser.findMany).toHaveBeenCalledWith({
      where: {
        userId: testUserId,
        movieId: { in: [trendingMovieId, unmatchedTrendingMovieId] },
      },
      select: {
        movieId: true,
        watched: true,
        favorite: true,
        score: true,
      },
    });
    expect(result.results).toEqual([
      expect.objectContaining({
        id: trendingMovieId,
        favorite: true,
        watched: true,
        score: 8,
      }),
      expect.objectContaining({
        id: unmatchedTrendingMovieId,
        favorite: undefined,
        watched: undefined,
        score: undefined,
      }),
    ]);
  });

  it('should return TMDB movies unchanged when there is no authenticated user', async () => {
    const tmdbMovieResponse: TMDBMovieResponse = {
      page: 1,
      results: [
        {
          adult: false,
          backdrop_path: '/backdrop-a.jpg',
          id: trendingMovieId,
          title: 'Matched movie',
          original_title: 'Matched movie',
          overview: 'Matched overview',
          poster_path: '/poster-a.jpg',
          media_type: 'movie',
          original_language: 'en',
          genre_ids: [28],
          popularity: 10,
          release_date: new Date('2026-01-01'),
          softcore: false,
          video: false,
          vote_average: 7.5,
          vote_count: 100,
        },
      ],
      total_pages: 1,
      total_results: 1,
    };

    tmdbService.getTrendingMovies.mockResolvedValue(tmdbMovieResponse);

    const result = await service.getTrendingMovies(1, null, null);

    expect(prisma.movieUser.findMany).not.toHaveBeenCalled();
    expect(result.results[0]).toEqual(
      expect.objectContaining({
        id: trendingMovieId,
      }),
    );
    expect(result.results[0]).not.toHaveProperty('favorite');
    expect(result.results[0]).not.toHaveProperty('watched');
    expect(result.results[0]).not.toHaveProperty('score');
  });

  it('should update a movie for an existing user movie relation', async () => {
    const updatedMovie = {
      id: 1,
      userId: testUserId,
      movieId: existingMovieId,
      favorite: false,
      watched: true,
      score: 9,
    };

    prisma.movieUser.upsert.mockResolvedValue(updatedMovie);

    const result = await service.upsertMovieForUser(testUserId, existingMovieId, {
      favorite: false,
      score: 9,
    });

    expect(prisma.movieUser.upsert).toHaveBeenCalledWith({
      where: {
        userId_movieId: {
          userId: testUserId,
          movieId: existingMovieId,
        },
      },
      update: {
        favorite: false,
        watched: undefined,
        score: 9,
      },
      create: {
        userId: testUserId,
        movieId: existingMovieId,
        favorite: false,
        watched: undefined,
        score: 9,
      },
    });
    expect(result.userId).toBe(testUserId);
    expect(result.movieId).toBe(existingMovieId);
    expect(result.favorite).toBe(false);
    expect(result.score).toBe(9);
    expect(result.watched).toBe(true);
  });

  it('should create a movie relation when it does not exist', async () => {
    const createdMovie = {
      id: 2,
      userId: testUserId,
      movieId: newMovieId,
      favorite: false,
      watched: true,
      score: null,
    };

    prisma.movieUser.upsert.mockResolvedValue(createdMovie);

    const result = await service.upsertMovieForUser(testUserId, newMovieId, {
      watched: true,
    });

    expect(result.userId).toBe(testUserId);
    expect(result.movieId).toBe(newMovieId);
    expect(result.watched).toBe(true);
    expect(result.favorite).toBe(false);
    expect(result.score).toBeNull();
  });

  it('should throw bad request when no fields are provided', async () => {
    await expect(service.upsertMovieForUser(testUserId, existingMovieId, {})).rejects.toThrow(
      BadRequestException,
    );
  });
});
