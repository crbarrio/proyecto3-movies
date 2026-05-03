import { Component, input, output } from '@angular/core';
import { Movie } from '../../../interfaces/tmdb-movie.interface';
import { MovieCard } from '../movie-card/movie-card';

@Component({
  selector: 'app-movie-list',
  imports: [MovieCard],
  templateUrl: './movie-list.html',
})
export class MovieList {
  movies = input.required<Movie[]>();
  isLoadingMore = input(false);
  hasMorePages = input(true);
  selectedMovie = output<number>();

  nextPage = output<void>();

  onLoadMore() {
    this.nextPage.emit();
  }

  onSelectMovie(movieId: number) {
    this.selectedMovie.emit(movieId);
  }
}
