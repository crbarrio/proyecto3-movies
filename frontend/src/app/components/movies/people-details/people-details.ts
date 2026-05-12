import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { Person } from '../../../interfaces/person.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { MovieService } from '../../../services/movie.service';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import ModalShell from "../../shared/modal-shell/modal-shell";
import { MovieCard } from '../movie-card/movie-card';
import { Movie } from '../../../interfaces/movie.interface';
import { MovieUserChange } from '../../../interfaces/movie-user.interface';

@Component({
  selector: 'app-people-details',
  standalone: true,
  imports: [DatePipe, ModalShell, MovieCard],
  templateUrl: './people-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleDetails {
  data = inject<{ personId: string }>(DIALOG_DATA);
  readonly personId = this.data.personId;
  readonly isBiographyExpanded = signal(false);
  readonly filmographyPageSize = 6;
  readonly visibleFilmographyCount = signal(this.filmographyPageSize);
  readonly filmographyState = signal<Movie[]>([]);
  private movieService = inject(MovieService);
  private dialogRef = inject(DialogRef<PeopleDetails>);

  baseImageUrl = environment.tmdbImageBaseUrl;


  personDetailsResource = rxResource<Person, { personId: string }>({
    params: () => ({ personId: this.personId }),
    stream: ({ params }) => this.movieService.getPersonById(params.personId),
  });

  constructor() {
    effect(() => {
      const person = this.personDetailsResource.value();

      this.filmographyState.set(person?.filmography ?? []);
      this.visibleFilmographyCount.set(this.filmographyPageSize);
    });
  }

  readonly visibleFilmography = computed(() => {
    return this.filmographyState().slice(0, this.visibleFilmographyCount());
  });

  readonly hasMoreFilmography = computed(() => {
    return this.visibleFilmographyCount() < this.filmographyState().length;
  });

  get modalTitle() {
    if (this.personDetailsResource.hasValue()) {
      return this.personDetailsResource.value().name;
    }

    if (this.personDetailsResource.isLoading()) {
      return 'Loading person';
    }

    return 'Person details';
  }

  close() {
    this.dialogRef.close();
  }

  toggleBiography() {
    this.isBiographyExpanded.update((value) => !value);
  }

  showMoreFilmography() {
    this.visibleFilmographyCount.update((value) => value + this.filmographyPageSize);
  }

  onMovieUserChanged(event: MovieUserChange) {
    this.movieService.updateMovieUser(event.movieId, event.changes).subscribe({
      next: (movieUser) => {
        this.filmographyState.update((movies) =>
          this.movieService.patchMovieCollection(movies, movieUser),
        );
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  getProfileImageUrl(profilePath: string | null | undefined) {
    return profilePath ? `${this.baseImageUrl}${profilePath}` : null;
  }

}
