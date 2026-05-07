import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { provideRouter } from '@angular/router';

import AuthModal from './auth-modal';

const dialogRefStub = {
  close: () => undefined,
};

describe('AuthModal', () => {
  let component: AuthModal;
  let fixture: ComponentFixture<AuthModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthModal],
      providers: [
        provideRouter([]),
        { provide: DIALOG_DATA, useValue: { mode: 'login' } },
        { provide: DialogRef, useValue: dialogRefStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
