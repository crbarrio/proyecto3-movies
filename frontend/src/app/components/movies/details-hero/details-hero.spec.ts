import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { DetailsHero } from './details-hero';
import { AuthService } from '../../../services/auth.service';

const authServiceStub = {
  authStatus: signal<'authenticated' | 'checking' | 'non-authenticated'>('non-authenticated'),
};

const movie = {
  id: 1,
  title: 'Test movie',
  releaseDate: '2024-01-01',
  overview: 'Overview',
  averageScore: 4,
};

describe('DetailsHero', () => {
  let component: DetailsHero;
  let fixture: ComponentFixture<DetailsHero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsHero],
      providers: [{ provide: AuthService, useValue: authServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsHero);
    fixture.componentRef.setInput('movie', movie);
    fixture.componentRef.setInput('genreNames', 'Drama');
    fixture.componentRef.setInput('directors', []);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
