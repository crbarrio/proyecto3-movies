import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import MovieDetailsPage from './movie-details-page';
import { MovieService } from '../../services/movie.service';

const movieDetails = {
  id: 1,
  title: 'Test movie',
  releaseDate: '2024-01-01',
  overview: 'Overview',
  genres: [],
  credits: { cast: [], crew: [] },
  similar: [],
  videos: { results: [] },
};

const movieServiceStub = {
  getMovieById: () => of(movieDetails),
  updateMovieUser: () => of({ movieId: 1, favorite: false, watched: false, score: null }),
  patchMovie: <T>(movie: T) => movie,
  patchMovieCollection: <T>(movies: T[]) => movies,
};

describe('MovieDetailsPage', () => {
  let component: MovieDetailsPage;
  let fixture: ComponentFixture<MovieDetailsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieDetailsPage],
      providers: [
        provideRouter([]),
        { provide: MovieService, useValue: movieServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieDetailsPage);
    fixture.componentRef.setInput('movieId', '1');
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
