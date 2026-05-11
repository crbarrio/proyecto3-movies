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
