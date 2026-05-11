import { Test, TestingModule } from '@nestjs/testing';
import { TmdbService } from './tmdb.service';

describe('TmdbService', () => {
  let service: TmdbService;
  const originalEnvironment = {
    TMDB_API_URL: process.env.TMDB_API_URL,
    TMDB_ACCESS_TOKEN: process.env.TMDB_ACCESS_TOKEN,
  };

  beforeEach(async () => {
    process.env.TMDB_API_URL = 'https://api.themoviedb.org/3';
    process.env.TMDB_ACCESS_TOKEN = 'test-token';

    const module: TestingModule = await Test.createTestingModule({
      providers: [TmdbService],
    }).compile();

    service = module.get<TmdbService>(TmdbService);
  });

  afterEach(() => {
    process.env.TMDB_API_URL = originalEnvironment.TMDB_API_URL;
    process.env.TMDB_ACCESS_TOKEN = originalEnvironment.TMDB_ACCESS_TOKEN;
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should request person details with movie credits appended', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ id: 31, movie_credits: { cast: [], crew: [] } }),
    } as unknown as Response);

    await service.getPersonById(31);

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.themoviedb.org/3/person/31?append_to_response=movie_credits',
      {
        headers: {
          Authorization: 'Bearer test-token',
          'Content-Type': 'application/json;charset=utf-8',
        },
      },
    );
  });
});
