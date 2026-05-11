import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { PeopleDetails } from './people-details';
import { MovieService } from '../../../services/movie.service';

const dialogRefStub = {
  close: () => undefined,
};

const movieServiceStub = {
  getPersonById: () => of({
    id: 1,
    adult: false,
    also_known_as: [],
    biography: 'Biography',
    birthday: new Date('1990-01-01'),
    deathday: null,
    filmography: [],
    gender: 1,
    homepage: null,
    imdb_id: 'nm0000001',
    known_for_department: 'Acting',
    name: 'Test person',
    place_of_birth: 'Test city',
    popularity: 1,
    profile_path: '',
  }),
  updateMovieUser: () => of({ movieId: 1, favorite: false, watched: false, score: null }),
  patchMovieCollection: <T>(movies: T[]) => movies,
};

describe('PeopleDetails', () => {
  let component: PeopleDetails;
  let fixture: ComponentFixture<PeopleDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleDetails],
      providers: [
        provideRouter([]),
        { provide: DIALOG_DATA, useValue: { personId: '1' } },
        { provide: DialogRef, useValue: dialogRefStub },
        { provide: MovieService, useValue: movieServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
