import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovieService {

  private http = inject(HttpClient);
  private tmdbApiUrl = environment.tmdbApiUrl;
  private tmdbAccessToken = environment.tmdbAccessToken;

  getTrendingMovies<TMDBMovieResponse>(): Observable<TMDBMovieResponse> {
    return this.http.get<TMDBMovieResponse>(`${this.tmdbApiUrl}/trending/movie/week`, {
      headers: {
        Authorization: `Bearer ${this.tmdbAccessToken}`,
        'Content-Type': 'application/json;charset=utf-8',
      },
    }).pipe(
      tap( response => console.log('Trending movies fetched successfully:', response) ),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.error('Unauthorized: Invalid TMDB access token.');
          return of({} as TMDBMovieResponse);
        } else {
          console.error('An error occurred:', error.message);
          return of({} as TMDBMovieResponse);
        }
      })
    )
  }
}
