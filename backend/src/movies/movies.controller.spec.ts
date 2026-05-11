import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../auth/auth.guard';
import { OptionalAuthGuard } from '../auth/optional-auth.guard';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

type AuthenticatedMoviesRequest = Parameters<MoviesController['findMoviesByUserId']>[0];
type OptionalTrendingRequest = Parameters<MoviesController['getTrendingMovies']>[2];

describe('MoviesController', () => {
  let controller: MoviesController;
  let authGuard: { canActivate: jest.Mock };
  let moviesService: {
    getTrendingMovies: jest.Mock;
    findMoviesByUserId: jest.Mock;
    upsertMovieForUser: jest.Mock;
  };

  beforeEach(async () => {
    authGuard = {
      canActivate: jest.fn().mockReturnValue(true),
    };

    moviesService = {
      getTrendingMovies: jest.fn(),
      findMoviesByUserId: jest.fn(),
      upsertMovieForUser: jest.fn(),
    };

    const moduleBuilder = Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: moviesService,
        },
      ],
    });

    const module: TestingModule = await moduleBuilder
      .overrideGuard(AuthGuard)
      .useValue(authGuard)
      .overrideGuard(OptionalAuthGuard)
      .useValue(authGuard)
      .compile();

    controller = module.get<MoviesController>(MoviesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return movies for the authenticated user', async () => {
    const expectedMovies = [{ id: 1, userId: 1, movieId: 1 }];
    moviesService.findMoviesByUserId.mockResolvedValue(expectedMovies);
    const request: AuthenticatedMoviesRequest = {
      user: { sub: 1, name: 'Test User 1' },
    } as AuthenticatedMoviesRequest;

    const result = await controller.findMoviesByUserId(request);

    expect(moviesService.findMoviesByUserId).toHaveBeenCalledWith(1);
    expect(result).toEqual(expectedMovies);
  });

  it('should pass the authenticated user id to trending movies', async () => {
    const trendingResponse = {
      page: 1,
      results: [],
      total_pages: 1,
      total_results: 0,
    };
    const request: OptionalTrendingRequest = {
      user: { sub: 1, name: 'Test User 1' },
    } as OptionalTrendingRequest;

    moviesService.getTrendingMovies.mockResolvedValue(trendingResponse);

    const result = await controller.getTrendingMovies(1, '28', request);

    expect(moviesService.getTrendingMovies).toHaveBeenCalledWith(1, 28, 1);
    expect(result).toEqual(trendingResponse);
  });

  it('should pass null user id to trending movies when request is anonymous', async () => {
    const trendingResponse = {
      page: 1,
      results: [],
      total_pages: 1,
      total_results: 0,
    };

    moviesService.getTrendingMovies.mockResolvedValue(trendingResponse);

    const result = await controller.getTrendingMovies(1, undefined, undefined);

    expect(moviesService.getTrendingMovies).toHaveBeenCalledWith(1, null, null);
    expect(result).toEqual(trendingResponse);
  });

  it('should update a movie for the authenticated user', async () => {
    const updateMovieUserDto = { favorite: true, score: 5 };
    const request: AuthenticatedMoviesRequest = {
      user: { sub: 1, name: 'Test User 1' },
    } as AuthenticatedMoviesRequest;
    const updatedMovie = {
      id: 1,
      userId: 1,
      movieId: 1,
      favorite: true,
      watched: true,
      score: 5,
    };

    moviesService.upsertMovieForUser.mockResolvedValue(updatedMovie);

    const result = await controller.upsertMovieForUser(1, updateMovieUserDto, request);

    expect(moviesService.upsertMovieForUser).toHaveBeenCalledWith(
      1,
      1,
      updateMovieUserDto,
    );
    expect(result).toEqual(updatedMovie);
  });
});
