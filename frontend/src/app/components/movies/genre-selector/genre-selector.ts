import { ChangeDetectionStrategy, Component, computed, model, signal } from '@angular/core';
import { TMDB_GENRES } from '../../../catalogs/tmdb-genres';


@Component({
  selector: 'app-genre-selector',
  imports: [],
  templateUrl: './genre-selector.html',
  styleUrl: './genre-selector.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreSelector {
  private readonly collapsedGenreCount = 6;

  selectedGenre = model<number | null>(null);
  isExpanded = signal(false);
  genres = TMDB_GENRES;
  hasHiddenGenres = this.genres.length > this.collapsedGenreCount;

  visibleGenres = computed(() => {
    if (this.isExpanded() || !this.hasHiddenGenres) {
      return this.genres;
    }

    const selectedGenreId = this.selectedGenre();
    const collapsedGenres = this.genres.slice(0, this.collapsedGenreCount);

    if (selectedGenreId === null || collapsedGenres.some((genre) => genre.id === selectedGenreId)) {
      return collapsedGenres;
    }

    const selectedGenre = this.genres.find((genre) => genre.id === selectedGenreId);
    return selectedGenre ? [...collapsedGenres, selectedGenre] : collapsedGenres;
  });

  selectGenre(id: number | null) {
    this.selectedGenre.set(id);
  }

  toggleExpanded() {
    this.isExpanded.update((isExpanded) => !isExpanded);
  }
}
