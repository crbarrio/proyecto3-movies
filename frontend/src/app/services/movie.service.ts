import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { map, Observable, tap } from 'rxjs';
import { TMDBMovieDetails, TMDBMovieResponse } from '../interfaces/tmdb-movie.interface';
import { MovieDetails, MovieResponse } from '../interfaces/movie.interface';
import { MovieMapper } from '../mappers/movie-details.mapper';
import { TMDBPerson } from '../interfaces/person.interface';

@Injectable({
  providedIn: 'root',
})
export class MovieService {

  private http = inject(HttpClient);
  private tmdbApiUrl = environment.tmdbApiUrl;
  private tmdbAccessToken = environment.tmdbAccessToken;

  getTrendingMovies(page: number, genreId: number | null): Observable<MovieResponse> {
    const endpoint = genreId === null ? 'trending/movie/week' : 'discover/movie';
    const params = new URLSearchParams({ page: String(page) });

    if (genreId !== null) {
      params.set('with_genres', String(genreId));
    }

    return this.http.get<TMDBMovieResponse>(`${this.tmdbApiUrl}/${endpoint}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${this.tmdbAccessToken}`,
        'Content-Type': 'application/json;charset=utf-8',
      },
    }).pipe(
      map(resp => MovieMapper.mapTMDBMovieResposeToMoiveResponse(resp)),
      tap({
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

  searchMovies(query: string, page: number): Observable<MovieResponse> {
    const params = new URLSearchParams({ query, page: String(page) });
    return this.http.get<TMDBMovieResponse>(`${this.tmdbApiUrl}/search/movie?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${this.tmdbAccessToken}`,
        'Content-Type': 'application/json;charset=utf-8',
      },
    }).pipe(
      map(resp => MovieMapper.mapTMDBMovieResposeToMoiveResponse(resp)),
      tap({
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

  getMovieById(movieId: number): Observable<MovieDetails> {
    return this.http.get<TMDBMovieDetails>(`${this.tmdbApiUrl}/movie/${movieId}?append_to_response=credits,similar,videos`, {
      headers: {
        Authorization: `Bearer ${this.tmdbAccessToken}`,
        'Content-Type': 'application/json;charset=utf-8',
      },
    }).pipe(
      map( (resp => MovieMapper.mapTMDBMovieDetailsToMovie(resp)) ),
      tap({
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


  getPersonById(personId: number): Observable<TMDBPerson> {
    return this.http.get<TMDBPerson>(`${this.tmdbApiUrl}/person/${personId}`, {
      headers: {
        Authorization: `Bearer ${this.tmdbAccessToken}`,
        'Content-Type': 'application/json;charset=utf-8',
      },
    }).pipe(
      tap({
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
