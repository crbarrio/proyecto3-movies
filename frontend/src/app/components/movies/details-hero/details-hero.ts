import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-details-hero',
  imports: [DatePipe],
  templateUrl: './details-hero.html',
  styleUrl: './details-hero.css',
})
export class DetailsHero {

  movie = input.required<any>();
  genreNames = input.required<string>();
  directors = input.required<any[]>();
  selectedPerson = output<number>();

  baseImageUrl = environment.tmdbImageBaseUrl;

  selectPerson(personId: number) {
    this.selectedPerson.emit(personId);
  }

}
