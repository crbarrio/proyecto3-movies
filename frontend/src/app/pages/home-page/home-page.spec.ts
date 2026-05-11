import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import HomePage from './home-page';
import { MovieService } from '../../services/movie.service';

const movieServiceStub = {
  getTrendingMovies: () => of({ page: 1, results: [], total_pages: 1, total_results: 0 }),
  searchMovies: () => of({ page: 1, results: [], total_pages: 1, total_results: 0 }),
  updateMovieUser: () => of({ movieId: 1, favorite: false, watched: false, score: null }),
  patchMovieCollection: <T>(movies: T[]) => movies,
};

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        provideRouter([]),
        { provide: MovieService, useValue: movieServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
