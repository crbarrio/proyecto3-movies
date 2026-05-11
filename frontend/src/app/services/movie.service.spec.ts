import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { MovieService } from './movie.service';
import { environment } from '../../environments/environment.development';

describe('MovieService', () => {
  let service: MovieService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MovieService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(MovieService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request the authenticated user movie lists', () => {
    const expectedLists = {
      favorites: [],
      watched: [],
    };

    service.getUserMovieLists().subscribe((movieLists) => {
      expect(movieLists).toEqual(expectedLists);
    });

    const request = httpTestingController.expectOne(`${environment.ApiUrl}/movies/lists/me`);
    expect(request.request.method).toBe('GET');
    request.flush(expectedLists);
  });
});
