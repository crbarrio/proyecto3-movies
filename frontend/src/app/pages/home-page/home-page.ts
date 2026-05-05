import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MovieList } from '../../components/movies/movie-list/movie-list';
import { MovieService } from '../../services/movie.service';
import { GenreSelector } from "../../components/movies/genre-selector/genre-selector";
import { SearchInput } from "../../components/movies/search-input/search-input";
import { Movie, MovieResponse } from '../../interfaces/movie.interface';

@Component({
  selector: 'app-home-page',
  imports: [MovieList, GenreSelector, SearchInput],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export default class HomePage {
  private movieService = inject(MovieService);

  page = signal(1);
  searchQuery = signal('');
  selectedGenreId = signal<number | null>(null);
  loadedMovies = signal<Movie[]>([]);
  requestParams = computed(() => ({
    page: this.page(),
    genreId: this.selectedGenreId(),
  }));

  movieResource = rxResource<MovieResponse, { page: number; genreId: number | null, query: string }>({
    params: () => ({ ...this.requestParams(), query: this.searchQuery() }),
    stream: ({ params }) => 
      params.query 
        ? this.movieService.searchMovies(params.query, params.page)
        : this.movieService.getTrendingMovies(params.page, params.genreId),
  });

  totalPages = computed(() => this.movieResource.value()?.total_pages ?? 0);
  hasMorePages = computed(() => this.page() < this.totalPages());

  constructor() {
    effect(() => {
      const response = this.movieResource.value();

      if (!response) {
        return;
      }

      this.loadedMovies.update((currentMovies) => this.mergeMovies(currentMovies, response));
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

    if (genreId !== null && this.searchQuery()) {
      this.searchQuery.set('');
    }

    this.resetMovieList();
  }

  private mergeMovies(currentMovies: Movie[], response: MovieResponse): Movie[] {
    if (response.page === 1) {
      return response.results;
    }

    const existingIds = new Set(currentMovies.map((movie) => movie.id));
    const uniqueNextMovies = response.results.filter((movie) => !existingIds.has(movie.id));
    return [...currentMovies, ...uniqueNextMovies];
  }

  private resetMovieList() {
    this.page.set(1);
    this.loadedMovies.set([]);
  }

  onSearchQueryChange(query: string) {
    const normalizedQuery = query.trim();

    if (this.searchQuery() === normalizedQuery) {
      return;
    }

    this.searchQuery.set(normalizedQuery);

    if (normalizedQuery && this.selectedGenreId() !== null) {
      this.selectedGenreId.set(null);
    }

    this.resetMovieList();
  }

}
