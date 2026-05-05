import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsHero } from './details-hero';

describe('DetailsHero', () => {
  let component: DetailsHero;
  let fixture: ComponentFixture<DetailsHero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsHero],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsHero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
