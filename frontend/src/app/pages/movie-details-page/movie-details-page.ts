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
import { Dialog } from '@angular/cdk/dialog';
import { PeopleDetails } from '../../components/movies/people-details/people-details';

@Component({
  selector: 'app-movie-details-page',
  imports: [MovieCard, PeopleCard, DetailsHero],
  templateUrl: './movie-details-page.html',
})
export default class MovieDetailsPage {

  private location = inject(Location);
  private movieService = inject(MovieService);
  private sanitizer = inject(DomSanitizer);
  private dialog = inject(Dialog);
  baseImageUrl = environment.tmdbImageBaseUrl;

  
  id = input.required<number>();
  
  movieResource = rxResource< MovieDetails, { id: number }>({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => this.movieService.getMovieById(params.id),
  });

  goBack() {
    this.location.back();
  }

  getTrailerEmbedUrl(key: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${key}`);
  }

  showPersonDetails(personId: number) {
    this.dialog.open(PeopleDetails, {
      data: { personId },
      panelClass: 'people-details-dialog',
      backdropClass: 'people-details-backdrop',
      maxWidth: '48rem',
    });
  }
}
