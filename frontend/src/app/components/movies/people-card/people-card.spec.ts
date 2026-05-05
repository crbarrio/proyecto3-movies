import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleCard } from './people-card';

describe('PeopleCard', () => {
  let component: PeopleCard;
  let fixture: ComponentFixture<PeopleCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleCard],
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
