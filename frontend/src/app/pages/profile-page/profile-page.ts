import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MovieList } from '../../components/movies/movie-list/movie-list';
import { UserMovieLists } from '../../interfaces/movie.interface';
import { MovieUserChange } from '../../interfaces/movie-user.interface';
import { AuthService } from '../../services/auth.service';
import { MovieService } from '../../services/movie.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-profile-page',
  imports: [MovieList],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export default class ProfilePage {
  private authService = inject(AuthService);
  private movieService = inject(MovieService);

  user = this.authService.user;
  authStatus = this.authService.authStatus;
  movieLists = signal<UserMovieLists>({
    averageScore: undefined,
    favorites: [],
    watched: [],
  });

  movieListsResource = rxResource<UserMovieLists, void>({
    stream: () => {
      return this.movieService.getUserMovieLists();
    },
  });

  favoriteMovies = computed(() => this.movieLists().favorites);
  watchedMovies = computed(() => this.movieLists().watched);
  averageScore = computed(() => this.movieLists().averageScore);
  isLoadingMovieLists = computed(() => this.authStatus() === 'authenticated' && this.movieListsResource.isLoading());

  constructor() {
    effect(() => {
      const movieLists = this.movieListsResource.value();

      if (!movieLists) {
        return;
      }

      this.movieLists.set(movieLists);
    });
  }

  onMovieUserChanged(event: MovieUserChange) {
    this.movieService.updateMovieUser(event.movieId, event.changes).subscribe({
      next: (movieUser) => {
        this.movieLists.update((lists) => this.movieService.patchMovieLists(lists, movieUser));
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
