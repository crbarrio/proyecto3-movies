import { Component, input, output } from '@angular/core';
import { MovieUserActionTarget, MovieUserChange } from '../../../interfaces/movie-user.interface';

@Component({
  selector: 'app-movie-user-actions',
  templateUrl: './movie-user-actions.html',
})
export class MovieUserActions {
  movie = input.required<MovieUserActionTarget>();
  movieUserChanged = output<MovieUserChange>();

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