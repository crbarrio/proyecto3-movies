import { Component } from '@angular/core';
import { MovieList } from "../../components/movies/movie-list/movie-list";

@Component({
  selector: 'app-home-page',
  imports: [MovieList],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export default class HomePage {}
