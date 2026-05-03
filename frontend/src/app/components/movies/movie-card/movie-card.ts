import { Component, computed, input, output } from '@angular/core';
import { Movie } from '../../../interfaces/tmdb-movie.interface';
import { environment } from '../../../../environments/environment.development';
import { TMDB_GENRES_BY_ID } from '../../../catalogs/tmdb-genres';

@Component({
  selector: 'app-movie-card',
  imports: [],
  templateUrl: './movie-card.html',
})
export class MovieCard {
  baseImageUrl = environment.tmdbImageBaseUrl;
  movie = input.required<Movie>();

  genreNames = computed(() =>
    this.movie().genre_ids.flatMap((genreId) => {
      const genreName = TMDB_GENRES_BY_ID[genreId];
      return genreName ? [genreName] : [];
    }).slice(0, 2)
  );
  
  selectedMovie = output<number>();

  onSelectMovie() {
    this.selectedMovie.emit(this.movie().id);
  }
}
