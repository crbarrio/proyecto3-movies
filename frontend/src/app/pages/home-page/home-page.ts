import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MovieList } from '../../components/movies/movie-list/movie-list';
import { Movie, TMDBMovieResponse } from '../../interfaces/tmdb-movie.interface';
import { MovieService } from '../../services/movie.service';
import { GenreSelector } from "../../components/movies/genre-selector/genre-selector";
import { SearchInput } from "../../components/movies/search-input/search-input";

@Component({
  selector: 'app-home-page',
  imports: [MovieList, GenreSelector, SearchInput],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export default class HomePage {
  private movieService = inject(MovieService);

  page = signal(1);
  selectedGenreId = signal<number | null>(null);
  loadedMovies = signal<Movie[]>([]);

  movieResource = rxResource<TMDBMovieResponse, { page: number; genreId: number | null }>({
    params: () => ({ page: this.page(), genreId: this.selectedGenreId() }),
    stream: ({ params }) => this.movieService.getTrendingMovies(params.page, params.genreId),
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

  onGenreSelected(genreId: number | null) {
    if (this.selectedGenreId() === genreId) {
      return;
    }

    this.selectedGenreId.set(genreId);
    this.page.set(1);
    this.loadedMovies.set([]);
  }

  onSearch(query: string) {
    console.log('Search query:', query);
  }
}
