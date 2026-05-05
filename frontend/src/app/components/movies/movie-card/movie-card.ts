import { Component, computed, input, output } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { TMDB_GENRES_BY_ID } from '../../../catalogs/tmdb-genres';
import { Movie } from '../../../interfaces/movie.interface';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-movie-card',
  imports: [RouterLink],
  templateUrl: './movie-card.html',
})
export class MovieCard {
  baseImageUrl = environment.tmdbImageBaseUrl;
  movie = input.required<Movie>();

  genreNames = computed(() =>
    this.movie().genres.flatMap((genreId) => {
      const genreName = TMDB_GENRES_BY_ID[genreId];
      return genreName ? [genreName] : [];
    }).slice(0, 2)
  );
  
}
