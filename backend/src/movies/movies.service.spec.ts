import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TmdbService } from 'src/tmdb/tmdb.service';
import { TMDBPersonDetails } from 'src/interfaces/person.interface';
import { TMDBMovieDetails, TMDBMovieResponse } from 'src/interfaces/tmdb-movie.interface';

describe('MoviesService', () => {
  let service: MoviesService;
  let prisma: {
    movieUser: {
      findMany: jest.Mock;
      groupBy: jest.Mock;
      upsert: jest.Mock;
    };
  };
  let tmdbService: {
    getTrendingMovies: jest.Mock;
    searchMovies: jest.Mock;
    getMovieById: jest.Mock;
    getPersonById: jest.Mock;
  };

  const testUserId = 1;
  const existingMovieId = 10001;
  const secondMovieId = 10002;
  const newMovieId = 10003;
  const trendingMovieId = 10004;
  const unmatchedTrendingMovieId = 10005;
  const favoriteMovieId = 10006;
  const watchedMovieId = 10007;

  beforeEach(async () => {
    prisma = {
      movieUser: {
        findMany: jest.fn(),
        groupBy: jest.fn(),
        upsert: jest.fn(),
      },
    };

    tmdbService = {
      getTrendingMovies: jest.fn(),
      searchMovies: jest.fn(),
      getMovieById: jest.fn(),
      getPersonById: jest.fn(),
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

  it('should return all person movies using the incoming TMDB order and user average scores', async () => {
    const personDetails = {
      adult: false,
      also_known_as: [],
      biography: 'Bio',
      birthday: new Date('1970-01-01'),
      deathday: null,
      gender: 2,
      homepage: null,
      id: 31,
      imdb_id: 'nm0000158',
      known_for_department: 'Acting',
      name: 'Actor',
      movie_credits: {
        cast: [
          { id: 1, title: 'First', original_title: 'First', release_date: '2018-01-01', popularity: 10, poster_path: null, backdrop_path: null, adult: false, credit_id: '1', genre_ids: [28], original_language: 'en', overview: 'Overview 1', video: false, vote_average: 7.31, vote_count: 10 },
          { id: 2, title: 'Second', original_title: 'Second', release_date: '2024-01-01', popularity: 5, poster_path: '/second.jpg', backdrop_path: null, adult: false, credit_id: '2', genre_ids: [18], original_language: 'en', overview: 'Overview 2', video: false, vote_average: 6.19, vote_count: 8 },
          { id: 3, title: 'Third', original_title: 'Third', release_date: '2021-01-01', popularity: 5, poster_path: null, backdrop_path: null, adult: false, credit_id: '3', genre_ids: [], original_language: 'en', overview: 'Overview 3', video: false, vote_average: 5, vote_count: 7 },
          { id: 4, title: 'Fourth', original_title: 'Fourth', release_date: null, popularity: 50, poster_path: null, backdrop_path: null, adult: false, credit_id: '4', genre_ids: [35], original_language: 'en', overview: 'Overview 4', video: false, vote_average: 8, vote_count: 3 },
          { id: 5, title: 'Fifth', original_title: 'Fifth', release_date: '2023-01-01', popularity: 4, poster_path: null, backdrop_path: null, adult: false, credit_id: '5', genre_ids: [12], original_language: 'en', overview: 'Overview 5', video: false, vote_average: 4.44, vote_count: 5 },
          { id: 6, title: 'Sixth', original_title: 'Sixth', release_date: '2020-01-01', popularity: 4, poster_path: null, backdrop_path: null, adult: false, credit_id: '6', genre_ids: [16], original_language: 'en', overview: 'Overview 6', video: false, vote_average: 9.04, vote_count: 4 },
          { id: 7, title: 'Seventh', original_title: 'Seventh', release_date: '2022-01-01', popularity: 4, poster_path: null, backdrop_path: null, adult: false, credit_id: '7', genre_ids: [80], original_language: 'en', overview: 'Overview 7', video: false, vote_average: 3.21, vote_count: 2 },
        ],
        crew: [],
      },
      place_of_birth: 'Somewhere',
      popularity: 10,
      profile_path: '/profile.jpg',
    } satisfies TMDBPersonDetails;

    prisma.movieUser.groupBy.mockResolvedValue([
      { movieId: 2, _avg: { score: 8.75 } },
      { movieId: 4, _avg: { score: 6 } },
    ]);

    tmdbService.getPersonById.mockResolvedValue(personDetails);

    const result = await service.getPersonById(31, null);

    expect(tmdbService.getPersonById).toHaveBeenCalledWith(31);
    expect(prisma.movieUser.groupBy).toHaveBeenCalledWith({
      by: ['movieId'],
      where: {
        movieId: { in: [1, 2, 3, 4, 5, 6, 7] },
        score: { not: null },
      },
      _avg: {
        score: true,
      },
    });
    expect(result.filmography).toHaveLength(7);
    expect(result.filmography.map(({ id }) => id)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(result.filmography[1]).toEqual({
      id: 2,
      title: 'Second',
      releaseDate: '2024-01-01',
      genres: [18],
      overview: 'Overview 2',
      posterPath: '/second.jpg',
      averageScore: 8.8,
    });
    expect(result.filmography[3]).toEqual({
      id: 4,
      title: 'Fourth',
      releaseDate: '',
      genres: [35],
      overview: 'Overview 4',
      posterPath: null,
      averageScore: 6,
    });
  });

  it('should return movies by user id', async () => {
    const storedMovies = [
      {
        id: 1,
        userId: testUserId,
        movieId: existingMovieId,
        favorite: true,
        watched: true,
        score: 4,
      },
      {
        id: 2,
        userId: testUserId,
        movieId: secondMovieId,
        favorite: false,
        watched: true,
        score: 3,
      },
    ];

    prisma.movieUser.findMany.mockResolvedValue(storedMovies);

    const result = await service.findMoviesByUserId(testUserId);

    expect(result).toHaveLength(2);
    expect(prisma.movieUser.findMany).toHaveBeenCalledWith({ where: { userId: testUserId } });
    expect(result.every((movie) => movie.userId === testUserId)).toBe(true);
  });

  it('should return hydrated favorites and watched lists for the authenticated user', async () => {
    prisma.movieUser.findMany
      .mockResolvedValueOnce([
        {
          movieId: favoriteMovieId,
          favorite: true,
          watched: true,
        },
        {
          movieId: watchedMovieId,
          favorite: false,
          watched: true,
        },
      ])
      .mockResolvedValueOnce([
        {
          movieId: favoriteMovieId,
          favorite: true,
          watched: true,
          score: 4,
        },
        {
          movieId: watchedMovieId,
          favorite: false,
          watched: true,
          score: 3,
        },
      ]);
    prisma.movieUser.groupBy.mockResolvedValue([
      { movieId: favoriteMovieId, _avg: { score: 4.2 } },
      { movieId: watchedMovieId, _avg: { score: 3 } },
    ]);
    tmdbService.getMovieById
      .mockResolvedValueOnce({
        id: favoriteMovieId,
        title: 'Favorite Movie',
        release_date: '2026-01-03',
        genres: [{ id: 28, name: 'Action' }],
        overview: 'Favorite overview',
        poster_path: '/favorite.jpg',
      })
      .mockResolvedValueOnce({
        id: watchedMovieId,
        title: 'Watched Movie',
        release_date: '2026-01-04',
        genres: [{ id: 18, name: 'Drama' }],
        overview: 'Watched overview',
        poster_path: '/watched.jpg',
      });

    const result = await service.getUserMovieLists(testUserId);

    expect(prisma.movieUser.findMany).toHaveBeenNthCalledWith(1, {
      where: {
        userId: testUserId,
        OR: [
          { favorite: true },
          { watched: true },
        ],
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        movieId: true,
        favorite: true,
        watched: true,
      },
    });
    expect(tmdbService.getMovieById).toHaveBeenNthCalledWith(1, favoriteMovieId);
    expect(tmdbService.getMovieById).toHaveBeenNthCalledWith(2, watchedMovieId);
    expect(prisma.movieUser.findMany).toHaveBeenNthCalledWith(2, {
      where: {
        userId: testUserId,
        movieId: { in: [favoriteMovieId, watchedMovieId] },
      },
      select: {
        movieId: true,
        watched: true,
        favorite: true,
        score: true,
      },
    });
    expect(prisma.movieUser.groupBy).toHaveBeenCalledWith({
      by: ['movieId'],
      where: {
        movieId: { in: [favoriteMovieId, watchedMovieId] },
        score: { not: null },
      },
      _avg: {
        score: true,
      },
    });
    expect(result).toEqual({
      averageScore: 3.6,
      favorites: [
        expect.objectContaining({
          id: favoriteMovieId,
          title: 'Favorite Movie',
          favorite: true,
          watched: true,
          score: 4,
          averageScore: 4.2,
        }),
      ],
      watched: [
        expect.objectContaining({
          id: favoriteMovieId,
          title: 'Favorite Movie',
          favorite: true,
          watched: true,
          score: 4,
          averageScore: 4.2,
        }),
        expect.objectContaining({
          id: watchedMovieId,
          title: 'Watched Movie',
          favorite: false,
          watched: true,
          score: 3,
          averageScore: 3,
        }),
      ],
    });
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
        score: 4,
      },
    ]);
    prisma.movieUser.groupBy.mockResolvedValue([
      { movieId: trendingMovieId, _avg: { score: 4 } },
      { movieId: unmatchedTrendingMovieId, _avg: { score: 3.5 } },
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
    expect(prisma.movieUser.groupBy).toHaveBeenCalledWith({
      by: ['movieId'],
      where: {
        movieId: { in: [trendingMovieId, unmatchedTrendingMovieId] },
        score: { not: null },
      },
      _avg: {
        score: true,
      },
    });
    expect(result.results).toEqual([
      expect.objectContaining({
        id: trendingMovieId,
        averageScore: 4,
        favorite: true,
        watched: true,
        score: 4,
      }),
      expect.objectContaining({
        id: unmatchedTrendingMovieId,
        averageScore: 3.5,
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
    prisma.movieUser.groupBy.mockResolvedValue([
      { movieId: trendingMovieId, _avg: { score: 4.5 } },
    ]);

    const result = await service.getTrendingMovies(1, null, null);

    expect(prisma.movieUser.findMany).not.toHaveBeenCalled();
    expect(prisma.movieUser.groupBy).toHaveBeenCalledWith({
      by: ['movieId'],
      where: {
        movieId: { in: [trendingMovieId] },
        score: { not: null },
      },
      _avg: {
        score: true,
      },
    });
    expect(result.results[0]).toEqual(
      expect.objectContaining({
        id: trendingMovieId,
        averageScore: 4.5,
      }),
    );
    expect(result.results[0]).not.toHaveProperty('favorite');
    expect(result.results[0]).not.toHaveProperty('watched');
    expect(result.results[0]).not.toHaveProperty('score');
  });

  it('should enrich movie details with average score and the authenticated user score', async () => {
    const tmdbMovieDetails = {
      adult: false,
      backdrop_path: '/backdrop-main.jpg',
      belongs_to_collection: null,
      budget: 0,
      genres: [{ id: 28, name: 'Action' }],
      homepage: '',
      id: trendingMovieId,
      imdb_id: 'tt1234567',
      origin_country: ['US'],
      original_language: 'en',
      original_title: 'Matched movie',
      overview: 'Matched overview',
      popularity: 10,
      poster_path: '/poster-main.jpg',
      production_companies: [],
      production_countries: [],
      release_date: new Date('2026-01-01'),
      revenue: 0,
      runtime: 120,
      spoken_languages: [],
      status: 'Released',
      tagline: '',
      title: 'Matched movie',
      video: false,
      vote_average: 7.5,
      vote_count: 100,
      credits: {
        cast: [],
        crew: [
          {
            adult: false,
            gender: 1,
            id: 1,
            known_for_department: 'Directing',
            name: 'Director One',
            original_name: 'Director One',
            popularity: 1,
            profile_path: '/director.jpg',
            credit_id: 'credit-1',
            department: 'Directing',
            job: 'Director',
          },
        ],
      },
      similar: {
        page: 1,
        results: [
          {
            adult: false,
            backdrop_path: '/backdrop-similar.jpg',
            id: secondMovieId,
            title: 'Similar movie',
            original_title: 'Similar movie',
            overview: 'Similar overview',
            poster_path: '/poster-similar.jpg',
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
        total_results: 1,
      },
      videos: {
        results: [],
      },
    } as TMDBMovieDetails;

    tmdbService.getMovieById.mockResolvedValue(tmdbMovieDetails);
    prisma.movieUser.findMany.mockResolvedValue([
      {
        movieId: trendingMovieId,
        favorite: true,
        watched: true,
        score: 5,
      },
    ]);
    prisma.movieUser.groupBy.mockResolvedValue([
      { movieId: trendingMovieId, _avg: { score: 4.5 } },
      { movieId: secondMovieId, _avg: { score: 3 } },
    ]);

    const result = await service.getMovieById(trendingMovieId, testUserId);

    expect(tmdbService.getMovieById).toHaveBeenCalledWith(trendingMovieId);
    expect(prisma.movieUser.findMany).toHaveBeenCalledWith({
      where: {
        userId: testUserId,
        movieId: { in: [trendingMovieId, secondMovieId] },
      },
      select: {
        movieId: true,
        watched: true,
        favorite: true,
        score: true,
      },
    });
    expect(result).toEqual(
      expect.objectContaining({
        id: trendingMovieId,
        averageScore: 4.5,
        score: 5,
        favorite: true,
        watched: true,
        similar: [
          expect.objectContaining({
            id: secondMovieId,
            averageScore: 3,
            score: undefined,
          }),
        ],
      }),
    );
  });

  it('should update a movie for an existing user movie relation', async () => {
    const updatedMovie = {
      id: 1,
      userId: testUserId,
      movieId: existingMovieId,
      favorite: false,
      watched: true,
      score: 5,
    };

    prisma.movieUser.upsert.mockResolvedValue(updatedMovie);

    const result = await service.upsertMovieForUser(testUserId, existingMovieId, {
      favorite: false,
      score: 5,
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
        score: 5,
      },
      create: {
        userId: testUserId,
        movieId: existingMovieId,
        favorite: false,
        watched: undefined,
        score: 5,
      },
    });
    expect(result.userId).toBe(testUserId);
    expect(result.movieId).toBe(existingMovieId);
    expect(result.favorite).toBe(false);
    expect(result.score).toBe(5);
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
