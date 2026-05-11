import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable, tap } from 'rxjs';
import { MovieDetails, MovieResponse, UserMovieLists } from '../interfaces/movie.interface';
import { MovieUserPatch, MovieUserState, MovieWithUserState } from '../interfaces/movie-user.interface';
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

  getUserMovieLists(): Observable<UserMovieLists> {
    return this.http.get<UserMovieLists>(`${this.ApiUrl}/movies/lists/me`, {
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

  updateMovieUser(movieId: number, changes: MovieUserPatch): Observable<MovieUserState> {
    return this.http.put<MovieUserState>(`${this.ApiUrl}/movies/${movieId}`, changes);
  }

  patchMovie<T extends MovieWithUserState>(movie: T, movieUser: MovieUserState): T {
    if (movie.id !== movieUser.movieId) {
      return movie;
    }

    return {
      ...movie,
      favorite: movieUser.favorite,
      watched: movieUser.watched,
      score: movieUser.score ?? undefined,
    };
  }

  patchMovieCollection<T extends MovieWithUserState>(movies: T[], movieUser: MovieUserState): T[] {
    return movies.map((movie) => this.patchMovie(movie, movieUser));
  }

  patchMovieLists(lists: UserMovieLists, movieUser: MovieUserState): UserMovieLists {
    return {
      averageScore: lists.averageScore,
      favorites: this.patchMovieCollection(lists.favorites, movieUser),
      watched: this.patchMovieCollection(lists.watched, movieUser),
    };
  }

}
