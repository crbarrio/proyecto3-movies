import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MovieUserChange, MovieScoreTarget } from '../../../interfaces/movie-user.interface';

@Component({
  selector: 'app-movie-score',
  templateUrl: './movie-score.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieScore {
  movie = input.required<MovieScoreTarget>();
  editable = input(false);
  sizeClass = input('text-[14px]');
  movieUserChanged = output<MovieUserChange>();

  readonly stars = [1, 2, 3, 4, 5];

  isSelected(star: number) {
    return (this.movie().score ?? 0) >= star;
  }

  getStarVariationSettings(star: number) {
    return this.isSelected(star)
      ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
      : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24";
  }

  onSelectScore(score: number, event: Event) {
    if (!this.editable()) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const nextScore = this.movie().score === score ? null : score;

    this.movieUserChanged.emit({
      movieId: this.movie().id,
      changes: {
        score: nextScore,
      },
    });
  }
}