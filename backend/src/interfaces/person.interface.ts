import { Movie } from './movie.interface';

export interface Person {
    adult: boolean;
    also_known_as: string[];
    biography: string;
    birthday: Date;
    deathday: null | string;
    filmography: Movie[];
    gender: number;
    homepage: null | string;
    id: number;
    imdb_id: string;
    known_for_department: string;
    name: string;
    place_of_birth: string;
    popularity: number;
    profile_path: string;
}

export interface TMDBPersonDetails extends Omit<Person, 'filmography'> {
    movie_credits: TMDBPersonMovieCredits;
}

export interface TMDBPersonMovieCredits {
    cast: TMDBPersonMovieCredit[];
    crew: TMDBPersonMovieCredit[];
}

export interface TMDBPersonMovieCredit {
    adult: boolean;
    backdrop_path: null | string;
    character?: string;
    credit_id: string;
    department?: string;
    genre_ids: number[];
    id: number;
    job?: string;
    order?: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: null | string;
    release_date: null | string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}
