import { Component, input, output } from '@angular/core';
import { MovieCard } from '../movie-card/movie-card';
import { Movie } from '../../../interfaces/movie.interface';
import { MovieUserChange } from '../../../interfaces/movie-user.interface';

@Component({
  selector: 'app-movie-list',
  imports: [MovieCard],
  templateUrl: './movie-list.html',
})
export class MovieList {
  movies = input.required<Movie[]>();
  isLoadingMore = input(false);
  hasMorePages = input(true);

  nextPage = output<void>();
  movieUserChanged = output<MovieUserChange>();

  onLoadMore() {
    this.nextPage.emit();
  }

  onMovieUserChanged(event: MovieUserChange) {
    this.movieUserChanged.emit(event);
  }
}
