import { Movie } from './movie.interface';

export interface MovieUserPatch {
  favorite?: boolean;
  watched?: boolean;
  score?: number | null;
}

export interface MovieUserChange {
  movieId: number;
  changes: MovieUserPatch;
}

export interface MovieUserState {
  movieId: number;
  favorite: boolean;
  watched: boolean;
  score: number | null;
}

export type MovieWithUserState = Pick<Movie, 'id' | 'favorite' | 'watched' | 'score'>;
export type MovieUserActionTarget = Pick<Movie, 'id' | 'title' | 'favorite' | 'watched'>;
export type MovieScoreTarget = Pick<Movie, 'id' | 'title' | 'score'>;

