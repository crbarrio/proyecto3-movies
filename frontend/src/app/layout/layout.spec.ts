import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';

import Layout from './layout';
import { AuthService } from '../services/auth.service';

const authServiceStub = {
  user: signal(null),
  authStatus: signal<'authenticated' | 'checking' | 'non-authenticated'>('non-authenticated'),
  logout: () => undefined,
};

describe('Layout', () => {
  let component: Layout;
  let fixture: ComponentFixture<Layout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Layout],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Layout);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
