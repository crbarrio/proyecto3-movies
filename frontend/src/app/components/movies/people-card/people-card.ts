import { Component, input, output } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-people-card',
  imports: [],
  templateUrl: './people-card.html'
})
export class PeopleCard {
  castMember = input.required<any>();
  selectedPerson = output<string>();
  baseImageUrl = environment.tmdbImageBaseUrl;

  selectPerson() {
    this.selectedPerson.emit(this.castMember().id);
  }
}
