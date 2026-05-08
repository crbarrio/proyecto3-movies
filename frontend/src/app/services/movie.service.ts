import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable, tap } from 'rxjs';
import { MovieDetails, MovieResponse } from '../interfaces/movie.interface';
import { TMDBPerson } from '../interfaces/person.interface';

@Injectable({
  providedIn: 'root',
})
export class MovieService {

  private http = inject(HttpClient);
  private ApiUrl = environment.ApiUrl;

  getTrendingMovies(page: number, genreId: number | null): Observable<MovieResponse> {
    const params = new URLSearchParams({ page: String(page) });

    if (genreId !== null) {
      params.set('genreId', String(genreId));
    }

    return this.http.get<MovieResponse>(`${this.ApiUrl}/movies/trending?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    }).pipe(
      tap({
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.error('Unauthorized request.');
            return;
          }

          console.error('An error occurred:', error.message);
        },
      })
    );
  }

  searchMovies(query: string, page: number): Observable<MovieResponse> {
    const params = new URLSearchParams({ query, page: String(page) });
    return this.http.get<MovieResponse>(`${this.ApiUrl}/movies/search?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    }).pipe(
      tap({
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.error('Unauthorized request.');
            return;
          }

          console.error('An error occurred:', error.message);
        },
      })
    );
  }

  getMovieById(movieId: string): Observable<MovieDetails> {
    return this.http.get<MovieDetails>(`${this.ApiUrl}/movies/${movieId}`, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    }).pipe(
      tap({
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.error('Unauthorized request.');
            return;
          }

          console.error('An error occurred:', error.message);
        },
      })
    );
  }


  getPersonById(personId: string): Observable<TMDBPerson> {
    return this.http.get<TMDBPerson>(`${this.ApiUrl}/movies/people/${personId}`, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    }).pipe(
      tap({
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.error('Unauthorized request.');
            return;
          }

          console.error('An error occurred:', error.message);
        },
      })
    );
  }

}
