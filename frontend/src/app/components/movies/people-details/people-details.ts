import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, computed, inject, signal } from '@angular/core';
import { Person } from '../../../interfaces/person.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { MovieService } from '../../../services/movie.service';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import ModalShell from "../../shared/modal-shell/modal-shell";
import { MovieCard } from '../movie-card/movie-card';

@Component({
  selector: 'app-people-details',
  standalone: true,
  imports: [DatePipe, ModalShell, MovieCard],
  templateUrl: './people-details.html',
})
export class PeopleDetails {
  data = inject<{ personId: string }>(DIALOG_DATA);
  readonly personId = this.data.personId;
  readonly isBiographyExpanded = signal(false);
  readonly filmographyPageSize = 6;
  readonly visibleFilmographyCount = signal(this.filmographyPageSize);
  private movieService = inject(MovieService);
  private dialogRef = inject(DialogRef<PeopleDetails>);

  baseImageUrl = environment.tmdbImageBaseUrl;


  personDetailsResource = rxResource<Person, { personId: string }>({
    params: () => ({ personId: this.personId }),
    stream: ({ params }) => this.movieService.getPersonById(params.personId),
  });

  readonly visibleFilmography = computed(() => {
    if (!this.personDetailsResource.hasValue()) {
      return [];
    }

    return this.personDetailsResource
      .value()
      .filmography.slice(0, this.visibleFilmographyCount());
  });

  readonly hasMoreFilmography = computed(() => {
    if (!this.personDetailsResource.hasValue()) {
      return false;
    }

    return this.visibleFilmographyCount() < this.personDetailsResource.value().filmography.length;
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

  getProfileImageUrl(profilePath: string | null | undefined) {
    return profilePath ? `${this.baseImageUrl}${profilePath}` : null;
  }

}
