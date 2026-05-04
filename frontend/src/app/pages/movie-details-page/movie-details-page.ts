import { Component, inject, input } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { MovieService } from '../../services/movie.service';
import { environment } from '../../../environments/environment';
import { Movie } from '../../interfaces/movie.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from "@angular/router";
import { MovieCard } from "../../components/movies/movie-card/movie-card";

@Component({
  selector: 'app-movie-details-page',
  imports: [DatePipe, RouterLink, MovieCard],
  templateUrl: './movie-details-page.html',
})
export default class MovieDetailsPage {

  private location = inject(Location);
  private movieService = inject(MovieService);
  private sanitizer = inject(DomSanitizer);
  baseImageUrl = environment.tmdbImageBaseUrl;

  
  id = input.required<number>();
  
  movieResource = rxResource<Movie, { id: number }>({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => this.movieService.getMovieById(params.id),
  });

  goBack() {
    this.location.back();
  }

  getTrailerEmbedUrl(key: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${key}`);
  }
}
