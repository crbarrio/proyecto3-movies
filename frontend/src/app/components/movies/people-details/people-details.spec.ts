import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleDetails } from './people-details';

describe('PeopleDetails', () => {
  let component: PeopleDetails;
  let fixture: ComponentFixture<PeopleDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
