import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MovieList } from '../../components/movies/movie-list/movie-list';
import { Movie, TMDBMovieResponse } from '../../interfaces/tmdb-movie.interface';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-home-page',
  imports: [MovieList],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export default class HomePage {
  private movieService = inject(MovieService);

  page = signal(1);
  loadedMovies = signal<Movie[]>([]);

  movieResource = rxResource<TMDBMovieResponse, number>({
    params: () => this.page(),
    stream: ({ params }) => this.movieService.getTrendingMovies(params),
  });

  totalPages = computed(() => this.movieResource.value()?.total_pages ?? 0);
  hasMorePages = computed(() => this.page() < this.totalPages());

  constructor() {
    effect(() => {
      if (!this.movieResource.hasValue()) {
        return;
      }

      const response = this.movieResource.value();
      const nextResults = response.results;

      this.loadedMovies.update((currentMovies) => {
        if (response.page === 1) {
          return nextResults;
        }

        const existingIds = new Set(currentMovies.map((movie) => movie.id));
        const uniqueNextMovies = nextResults.filter((movie) => !existingIds.has(movie.id));
        return [...currentMovies, ...uniqueNextMovies];
      });
    });
  }

  loadNextPage() {
    if (!this.hasMorePages() || this.movieResource.isLoading()) {
      return;
    }

    this.page.update((page) => page + 1);
  }
}
