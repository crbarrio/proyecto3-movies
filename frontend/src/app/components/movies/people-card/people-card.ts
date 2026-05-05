import { Component, input } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-people-card',
  imports: [],
  templateUrl: './people-card.html'
})
export class PeopleCard {
  castMember = input.required<any>();
  baseImageUrl = environment.tmdbImageBaseUrl;
}
