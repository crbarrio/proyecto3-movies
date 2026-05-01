import { Component, computed, input } from '@angular/core';
import { MovieCard } from "../movie-card/movie-card";
import { TMDBMovieResponse } from '../../../interfaces/tmdb-movie.interface';

@Component({
  selector: 'app-movie-list',
  imports: [MovieCard],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.css',
})
export class MovieList {

  movieResponse = input.required<TMDBMovieResponse>();
  movies = computed(() => this.movieResponse().results);
}
