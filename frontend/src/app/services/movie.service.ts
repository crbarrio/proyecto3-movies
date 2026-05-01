import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable, tap } from 'rxjs';
import { TMDBMovieResponse } from '../interfaces/tmdb-movie.interface';

@Injectable({
  providedIn: 'root',
})
export class MovieService {

  private http = inject(HttpClient);
  private tmdbApiUrl = environment.tmdbApiUrl;
  private tmdbAccessToken = environment.tmdbAccessToken;

  getTrendingMovies(): Observable<TMDBMovieResponse> {
    return this.http.get<TMDBMovieResponse>(`${this.tmdbApiUrl}/trending/movie/week`, {
      headers: {
        Authorization: `Bearer ${this.tmdbAccessToken}`,
        'Content-Type': 'application/json;charset=utf-8',
      },
    }).pipe(
      tap({
        next: (response) => console.log('Trending movies fetched successfully:', response),
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.error('Unauthorized: Invalid TMDB access token.');
            return;
          }

          console.error('An error occurred:', error.message);
        },
      })
    );
  }
}
