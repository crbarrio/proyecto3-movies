import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
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

  baseImageUrl = environment.tmdbImageBaseUrl;


}
