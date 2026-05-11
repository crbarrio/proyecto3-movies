import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { signal } from '@angular/core';

import ProfilePage from './profile-page';
import { AuthService } from '../../services/auth.service';
import { MovieService } from '../../services/movie.service';

const authServiceStub = {
  user: signal({
    name: 'Test User',
    email: 'test@example.com',
  }),
  authStatus: signal<'authenticated' | 'checking' | 'non-authenticated'>('authenticated'),
};

const movieServiceStub = {
  getUserMovieLists: () => of({ favorites: [], watched: [] }),
  updateMovieUser: () => of({ movieId: 1, favorite: false, watched: false, score: null }),
  patchMovieLists: (lists: { favorites: []; watched: [] }) => lists,
};

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceStub },
        { provide: MovieService, useValue: movieServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
