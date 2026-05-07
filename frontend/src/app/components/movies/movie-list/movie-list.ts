import { Component, input, output } from '@angular/core';
import { MovieCard } from '../movie-card/movie-card';
import { Movie } from '../../../interfaces/movie.interface';

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

  onLoadMore() {
    this.nextPage.emit();
  }

}
