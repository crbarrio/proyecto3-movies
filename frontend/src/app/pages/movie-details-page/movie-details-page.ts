import { Component, inject, input } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { TMDBMovieDetails } from '../../interfaces/tmdb-movie.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { MovieService } from '../../services/movie.service';
import { environment } from '../../../environments/environment';
import { Movie } from '../../interfaces/movie.interface';

@Component({
  selector: 'app-movie-details-page',
  imports: [DatePipe],
  templateUrl: './movie-details-page.html',
})
export default class MovieDetailsPage {

  private location = inject(Location);
  private movieService = inject(MovieService);
  baseImageUrl = environment.tmdbImageBaseUrl;

  
  id = input.required<number>();
  
  movieResource = rxResource<Movie, { id: number }>({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => this.movieService.getMovieById(params.id),
  });

  goBack() {
    this.location.back();
  }
}
