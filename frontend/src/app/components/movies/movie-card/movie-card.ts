import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment.development';
import { TMDB_GENRES_BY_ID } from '../../../catalogs/tmdb-genres';
import { Movie } from '../../../interfaces/movie.interface';
import { MovieUserChange } from '../../../interfaces/movie-user.interface';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-movie-card',
  imports: [RouterLink],
  templateUrl: './movie-card.html',
})
export class MovieCard {
  authService = inject(AuthService);
  isAuthenticated = computed(() => this.authService.authStatus() === 'authenticated');

  baseImageUrl = environment.tmdbImageBaseUrl;
  movie = input.required<Movie>();

  movieUserChanged = output<MovieUserChange>();

  genreNames = computed(() =>
    this.movie().genres.flatMap((genreId) => {
      const genreName = TMDB_GENRES_BY_ID[genreId];
      return genreName ? [genreName] : [];
    }).slice(0, 2)
  );

  onToggleFavorite(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.movieUserChanged.emit({
      movieId: this.movie().id,
      changes: {
        favorite: !this.movie().favorite,
      },
    });
  }

  onToggleWatched(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.movieUserChanged.emit({
      movieId: this.movie().id,
      changes: {
        watched: !this.movie().watched,
      },
    });
  }
}
