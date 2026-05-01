import { Component } from '@angular/core';
import { MovieCard } from "../movie-card/movie-card";

@Component({
  selector: 'app-movie-list',
  imports: [MovieCard],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.css',
})
export class MovieList {}
