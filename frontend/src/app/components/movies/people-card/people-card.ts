import { Component, input, output } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-people-card',
  imports: [],
  templateUrl: './people-card.html'
})
export class PeopleCard {
  castMember = input.required<any>();
  selected = output<number>();
  baseImageUrl = environment.tmdbImageBaseUrl;

  selectPerson() {
    this.selected.emit(this.castMember().id);
  }
}
