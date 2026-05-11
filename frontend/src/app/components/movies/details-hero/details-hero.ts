import { DatePipe } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { MovieScore } from '../movie-score/movie-score';
import { MovieUserActions } from '../movie-user-actions/movie-user-actions';
import { MovieDetails } from '../../../interfaces/movie.interface';
import { MovieUserChange } from '../../../interfaces/movie-user.interface';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-details-hero',
  imports: [DatePipe, MovieScore, MovieUserActions],
  templateUrl: './details-hero.html',
  styleUrl: './details-hero.css',
})
export class DetailsHero {

  private authService = inject(AuthService);
  isAuthenticated = computed(() => this.authService.authStatus() === 'authenticated');

  movie = input.required<MovieDetails>();
  genreNames = input.required<string>();
  directors = input.required<any[]>();
  selectedPerson = output<string>();
  movieUserChanged = output<MovieUserChange>();

  baseImageUrl = environment.tmdbImageBaseUrl;

  selectPerson(personId: string) {
    this.selectedPerson.emit(personId);
  }

  onMovieUserChanged(event: MovieUserChange) {
    this.movieUserChanged.emit(event);
  }

  onMovieScoreChanged(event: MovieUserChange) {
    this.movieUserChanged.emit(event);
  }
}
