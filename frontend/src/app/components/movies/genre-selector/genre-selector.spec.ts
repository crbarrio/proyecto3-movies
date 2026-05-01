import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreSelector } from './genre-selector';

describe('GenreSelector', () => {
  let component: GenreSelector;
  let fixture: ComponentFixture<GenreSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenreSelector],
    }).compileComponents();

    fixture = TestBed.createComponent(GenreSelector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
