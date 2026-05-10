
export interface MovieDetails {

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
    similar?: Movie[];
    videos?: {
        results?: {
            type?: string;
            site?: string;
            key: string;
        }[];
    };
}

export interface MovieResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

export interface Movie {

    id: number;
    title: string;
    releaseDate: Date | string;
    genres: number[];
    overview: string;
    posterPath?: string | null;
    favorite?: boolean;
    watched?: boolean;
    score?: number;
}