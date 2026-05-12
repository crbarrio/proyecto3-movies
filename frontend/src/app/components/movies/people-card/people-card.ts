import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-people-card',
  imports: [],
  templateUrl: './people-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleCard {
  castMember = input.required<any>();
  selectedPerson = output<string>();
  baseImageUrl = environment.tmdbImageBaseUrl;

  selectPerson() {
    this.selectedPerson.emit(this.castMember().id);
  }
}
