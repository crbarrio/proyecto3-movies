import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../auth/auth.guard';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

describe('MoviesController', () => {
  let controller: MoviesController;
  let authGuard: { canActivate: jest.Mock };
  let moviesService: {
    findMoviesByUserId: jest.Mock;
    upsertMovieForUser: jest.Mock;
  };

  beforeEach(async () => {
    authGuard = {
      canActivate: jest.fn().mockReturnValue(true),
    };

    moviesService = {
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
      .compile();

    controller = module.get<MoviesController>(MoviesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return movies for the authenticated user', () => {
    const expectedMovies = [{ id: 1, userId: 1, movieId: 1 }];
    moviesService.findMoviesByUserId.mockReturnValue(expectedMovies);
    const request = { user: { sub: 1, name: 'Test User 1' } } as any;

    const result = controller.findMoviesByUserId(request);

    expect(moviesService.findMoviesByUserId).toHaveBeenCalledWith(1);
    expect(result).toEqual(expectedMovies);
  });

  it('should update a movie for the authenticated user', () => {
    const updateMovieUserDto = { favorite: true, score: 9 };
    const request = { user: { sub: 1, name: 'Test User 1' } } as any;
    const updatedMovie = {
      id: 1,
      userId: 1,
      movieId: 1,
      favorite: true,
      watched: true,
      score: 9,
    };

    moviesService.upsertMovieForUser.mockReturnValue(updatedMovie);

    const result = controller.upsertMovieForUser(1, updateMovieUserDto, request);

    expect(moviesService.upsertMovieForUser).toHaveBeenCalledWith(
      1,
      1,
      updateMovieUserDto,
    );
    expect(result).toEqual(updatedMovie);
  });
});
