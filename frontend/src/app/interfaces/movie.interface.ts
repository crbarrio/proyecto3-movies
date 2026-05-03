
export interface Movie {

    id: number;
    title: string;
    releaseDate?: Date | string;
    runtime?: number;
    genres?: { name: string }[];
    overview?: string;
    posterPath?: string | null;
    credits?: {
        cast?: {
            id: number;
            name: string;
            character?: string;
            profilePath?: string | null;
        }[];
        crew?: {
            id: number;
            name: string;
            job?: string;
            profilePath?: string | null;
        }[];
    };
    similar?: {
        results?: {
            id: number;
            title: string;
            posterPath?: string | null;
        }[];
    };
    videos?: {
        results?: {
            type?: string;
            site?: string;
            key: string;
        }[];
    };
}




// title, release_date, runtime, genres (only name), overview, poster_path
// credit -cast : id, name, character, profile_path (only 6 firsts)
// credit - crew : id, name, job, profile_path( where job is Director) (only 6 firsts)
// similar - results: id, title, poster_path (only 6 firsts)
// videos - results: type is Trailer, site is YouTube, key (only 2 firsts)