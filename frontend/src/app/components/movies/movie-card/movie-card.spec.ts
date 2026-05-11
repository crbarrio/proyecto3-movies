import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';

import { MovieCard } from './movie-card';
import { AuthService } from '../../../services/auth.service';

const authServiceStub = {
  authStatus: signal<'authenticated' | 'checking' | 'non-authenticated'>('non-authenticated'),
};

const movie = {
  id: 1,
  title: 'Test movie',
  releaseDate: '2024-01-01',
  genres: [28],
  overview: 'Overview',
  averageScore: 4,
};

describe('MovieCard', () => {
  let component: MovieCard;
  let fixture: ComponentFixture<MovieCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieCard],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieCard);
    fixture.componentRef.setInput('movie', movie);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
