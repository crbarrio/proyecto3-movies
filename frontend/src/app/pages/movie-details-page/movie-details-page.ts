import { Component, effect, inject, input, signal } from '@angular/core';
import { Location } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { MovieService } from '../../services/movie.service';
import { environment } from '../../../environments/environment';
import { MovieDetails } from '../../interfaces/movie.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { MovieCard } from "../../components/movies/movie-card/movie-card";
import { PeopleCard } from "../../components/movies/people-card/people-card";
import { DetailsHero } from "../../components/movies/details-hero/details-hero";
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { PeopleDetails } from '../../components/movies/people-details/people-details';
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
  private dialog = inject(Dialog);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  baseImageUrl = environment.tmdbImageBaseUrl;

  movieId = input.required<string>();
  personId = input<string | null>(null);

  movieResource = rxResource<MovieDetails, { movieId: string }>({
    params: () => ({ movieId: this.movieId() }),
    stream: ({ params }) => this.movieService.getMovieById(params.movieId),
  });

  private dialogRef = signal<DialogRef<unknown, PeopleDetails> | null>(null);

  private syncModalWithUrl = effect(() => {
    const personId = this.personId();
    const ref = this.dialogRef();

    // cerrar si no hay persona
    if (!personId && ref) {
      ref.close();
      this.dialogRef.set(null);
      return;
    }

    // abrir modal
    if (personId && !ref) {
      const dialogRef = this.dialog.open(PeopleDetails, {
        panelClass: 'people-details-dialog',
        backdropClass: 'people-details-backdrop',
        data: {
          personId
        }
      });

      this.dialogRef.set(dialogRef);

      dialogRef.closed.subscribe(() => {
        this.dialogRef.set(null);
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { personId: null },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
      });
    }
  });

  goBack() {
    this.location.back();
  }

  getTrailerEmbedUrl(key: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${key}`);
  }

  openPerson(personId: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { personId },
      queryParamsHandling: 'merge',
    });
  }

}
