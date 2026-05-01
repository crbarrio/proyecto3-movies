import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MovieList } from '../../components/movies/movie-list/movie-list';
import { MovieService } from '../../services/movie.service';
import { TMDBMovieResponse } from '../../interfaces/tmdb-movie.interface';

@Component({
  selector: 'app-home-page',
  imports: [MovieList],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export default class HomePage {
  movieService = inject(MovieService);

  movieResource = rxResource<TMDBMovieResponse, void>({
    stream: () => this.movieService.getTrendingMovies(),
  });
}
