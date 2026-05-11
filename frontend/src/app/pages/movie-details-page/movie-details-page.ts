import { Component, effect, inject, input, signal } from '@angular/core';
import { Location } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { MovieService } from '../../services/movie.service';
import { environment } from '../../../environments/environment';
import { MovieDetails } from '../../interfaces/movie.interface';
import { MovieUserChange } from '../../interfaces/movie-user.interface';
import { MovieCard } from "../../components/movies/movie-card/movie-card";
import { PeopleCard } from "../../components/movies/people-card/people-card";
import { DetailsHero } from "../../components/movies/details-hero/details-hero";
import TrailersSection from '../../components/movies/trailers-section/trailers-section';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-movie-details-page',
  imports: [MovieCard, PeopleCard, DetailsHero, TrailersSection],
  templateUrl: './movie-details-page.html',
})
export default class MovieDetailsPage {

  private location = inject(Location);
  private movieService = inject(MovieService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  

  baseImageUrl = environment.tmdbImageBaseUrl;

  movieId = input.required<string>();
  movieDetailsState = signal<MovieDetails | null>(null);
  similarMoviesState = signal<MovieDetails['similar']>([]);

  movieResource = rxResource<MovieDetails, { movieId: string }>({
    params: () => ({ movieId: this.movieId() }),
    stream: ({ params }) => this.movieService.getMovieById(params.movieId),
  });

  constructor() {
    effect(() => {
      const movie = this.movieResource.value();

      this.movieDetailsState.set(movie ?? null);
      this.similarMoviesState.set(movie?.similar ?? []);
    });
  }

  goBack() {
    this.location.back();
  }

  openPerson(personId: string) {
    this.router.navigate([{ outlets: { modal: ['person', personId] } }], {
      relativeTo: this.route.parent,
      state: { closeModalWithHistoryBack: true },
    });
  }

  onMovieUserChanged(event: MovieUserChange) {
    this.movieService.updateMovieUser(event.movieId, event.changes).subscribe({
      next: (movieUser) => {
        this.movieDetailsState.update((movie) => {
          if (!movie) {
            return movie;
          }

          return this.movieService.patchMovie(movie, movieUser);
        });
        this.similarMoviesState.update((movies) => this.movieService.patchMovieCollection(movies ?? [], movieUser));
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
