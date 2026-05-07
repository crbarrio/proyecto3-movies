import { Component, inject, input } from '@angular/core';
import { Location } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { MovieService } from '../../services/movie.service';
import { environment } from '../../../environments/environment';
import { MovieDetails } from '../../interfaces/movie.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { MovieCard } from "../../components/movies/movie-card/movie-card";
import { PeopleCard } from "../../components/movies/people-card/people-card";
import { DetailsHero } from "../../components/movies/details-hero/details-hero";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-movie-details-page',
  imports: [MovieCard, PeopleCard, DetailsHero],
  templateUrl: './movie-details-page.html',
})
export default class MovieDetailsPage {

  private location = inject(Location);
  private movieService = inject(MovieService);
  private sanitizer = inject(DomSanitizer);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  baseImageUrl = environment.tmdbImageBaseUrl;

  movieId = input.required<string>();

  movieResource = rxResource<MovieDetails, { movieId: string }>({
    params: () => ({ movieId: this.movieId() }),
    stream: ({ params }) => this.movieService.getMovieById(params.movieId),
  });

  goBack() {
    this.location.back();
  }

  getTrailerEmbedUrl(key: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${key}`);
  }

  openPerson(personId: string) {
    this.router.navigate([{ outlets: { modal: ['person', personId] } }], {
      relativeTo: this.route.parent,
    });
  }

}
