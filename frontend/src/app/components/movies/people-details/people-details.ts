import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { TMDBPerson } from '../../../interfaces/person.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { MovieService } from '../../../services/movie.service';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import ModalShell from "../../shared/modal-shell/modal-shell";

@Component({
  selector: 'app-people-details',
  standalone: true,
  imports: [DatePipe, ModalShell],
  templateUrl: './people-details.html',
})
export class PeopleDetails {
  data = inject<{ personId: string }>(DIALOG_DATA);
  readonly personId = this.data.personId;
  private movieService = inject(MovieService);
  private dialogRef = inject(DialogRef<PeopleDetails>);

  baseImageUrl = environment.tmdbImageBaseUrl;


  personDetailsResource = rxResource<TMDBPerson, { personId: string }>({
    params: () => ({ personId: this.personId }),
    stream: ({ params }) => this.movieService.getPersonById(params.personId),
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

  getProfileImageUrl(profilePath: string | null | undefined) {
    return profilePath ? `${this.baseImageUrl}${profilePath}` : null;
  }

}
