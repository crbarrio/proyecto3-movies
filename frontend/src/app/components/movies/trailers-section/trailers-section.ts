import { DomSanitizer } from '@angular/platform-browser';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { MovieDetails } from '../../../interfaces/movie.interface';

type Trailer = NonNullable<NonNullable<MovieDetails['videos']>['results']>[number];

@Component({
  selector: 'app-trailers-section',
  standalone: true,
  templateUrl: './trailers-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TrailersSection {
  private sanitizer = inject(DomSanitizer);

  movieTitle = input.required<string>();
  trailers = input<Trailer[]>([]);

  selectedTrailerKey = signal<string | null>(null);

  getTrailerEmbedUrl(key: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${key}`);
  }

  getTrailerThumbnailUrl(key: string) {
    return `https://img.youtube.com/vi/${key}/hqdefault.jpg`;
  }

  openTrailer(key: string) {
    this.selectedTrailerKey.set(key);
  }

  closeTrailer() {
    this.selectedTrailerKey.set(null);
  }
}