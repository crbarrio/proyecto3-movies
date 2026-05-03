import { TMDBMovieDetails } from "../interfaces/tmdb-movie.interface";
import { Movie } from "../interfaces/movie.interface";


export class MovieMapper {

    static mapTMDBMovieDetailsToMovie(tmdbMovieDetails: TMDBMovieDetails): Movie {
        return {
            id: tmdbMovieDetails.id,
            title: tmdbMovieDetails.title,
            releaseDate: tmdbMovieDetails.release_date,
            runtime: tmdbMovieDetails.runtime,
            genres: tmdbMovieDetails.genres.map(genre => ({ name: genre.name })),
            overview: tmdbMovieDetails.overview,
            posterPath: tmdbMovieDetails.poster_path,
            credits: {
                cast: tmdbMovieDetails.credits.cast.slice(0, 6).map(cast => ({
                    id: cast.id,
                    name: cast.name,
                    character: cast.character,
                    profilePath: cast.profile_path
                })),
                crew: tmdbMovieDetails.credits.crew.filter(crew => crew.job === "Director").slice(0, 6).map(crew => ({
                    id: crew.id,
                    name: crew.name,
                    job: crew.job,
                    profilePath: crew.profile_path
                }))
            },
            similar: {
                results: tmdbMovieDetails.similar.results.slice(0, 6).map(similar => ({
                    id: similar.id,
                    title: similar.title,
                    posterPath: similar.poster_path
                }))
            },
            videos: {
                results: tmdbMovieDetails.videos.results.filter(video => video.type === "Trailer" && video.site === "YouTube").slice(0, 2).map(video => ({
                    type: video.type,
                    site: video.site,
                    key: video.key
                }))
            }
        };
    }
}