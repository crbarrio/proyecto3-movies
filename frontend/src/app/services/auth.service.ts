import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

type AuthStatus = 'checking' | 'authenticated' | 'non-authenticated';
const apiUrl = environment.ApiUrl;

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<{ name: string; email: string } | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  private http = inject(HttpClient);

  checkStatusResource = rxResource({
    stream: () => this.checkStatus()
  })

  authStatus = computed<AuthStatus>(() =>{
    
    if ( this._authStatus() === 'checking') return 'checking';

    if ( this._user() ) return 'authenticated';

    return 'non-authenticated';
  });

  user = computed(() => this._user());
  token = computed(() => this._token());

  login(email: string, password: string): Observable<boolean> {
    this._authStatus.set('checking');

    return this.http.post<AuthResponse>(
      `${apiUrl}/auth/login`,
      { email, password }
    ).pipe(
      map((response) => this.handleAuthSuccess(response)),
      catchError((error) => this.rethrowAuthAttemptError(error)),
    );
  }

  register(email: string, password: string, name: string): Observable<boolean> {
    this._authStatus.set('checking');

    return this.http.post<AuthResponse>(
      `${apiUrl}/auth/register`,
      { email, password, name }
    ).pipe(
      map((response) => this.handleAuthSuccess(response)),
      catchError((error) => this.rethrowAuthAttemptError(error)),
    );
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout()
      return of(false)
    }

    return this.http.get<AuthResponse>(`${apiUrl}/auth/check-status`, {
    }).pipe(
      map((response) => this.handleAuthSuccess(response)),
      catchError(() => this.handleCheckStatusError()),
    );

  }

  logout() {
    this._authStatus.set('non-authenticated');
    this._user.set(null);
    this._token.set(null);
    localStorage.removeItem('token')
  }

  private handleAuthSuccess(response: AuthResponse) {
    this._user.set(response.user);
    this._token.set(response.token);
    this._authStatus.set('authenticated');

    localStorage.setItem('token', response.token);
    return true;
  }

  private handleCheckStatusError() {
    this.logout();
    return of(false);
  }

  private rethrowAuthAttemptError(error: unknown) {
    this._authStatus.set(this._user() ? 'authenticated' : 'non-authenticated');
    return throwError(() => error);
  }

}
