import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { TMDBPerson } from '../../../interfaces/person.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { MovieService } from '../../../services/movie.service';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-people-details',
  imports: [DatePipe],
  templateUrl: './people-details.html',
})
export class PeopleDetails {
  data = inject<{ personId: number }>(DIALOG_DATA);
  personId = this.data.personId;
  private movieService = inject(MovieService);
  private dialogRef = inject(DialogRef<PeopleDetails>);
  baseImageUrl = environment.tmdbImageBaseUrl;

  personDetailsResource = rxResource<TMDBPerson, { personId: number }>({
    params: () => ({ personId: this.personId }),
    stream: ({ params }) => this.movieService.getPersonById(params.personId),
  });

  close() {
    this.dialogRef.close();
  }

  getProfileImageUrl(profilePath: string | null | undefined) {
    return profilePath ? `${this.baseImageUrl}${profilePath}` : null;
  }

}
