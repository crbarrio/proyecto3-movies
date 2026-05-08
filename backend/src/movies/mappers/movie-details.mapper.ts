import { Movie, MovieDetails, MovieResponse } from 'src/interfaces/movie.interface';
import {
  Site,
  TMDBMovie,
  TMDBMovieResponse,
  TMDBMovieDetails,
  Type,
} from 'src/interfaces/tmdb-movie.interface';

export class MovieDetailsMapper {
  static mapTMDBMovieToMovie(tmdbMovie: TMDBMovie): Movie {
    return {
      id: tmdbMovie.id,
      title: tmdbMovie.title,
      releaseDate: tmdbMovie.release_date,
      genres: tmdbMovie.genre_ids,
      overview: tmdbMovie.overview,
      posterPath: tmdbMovie.poster_path,
    };
  }

  static mapTMDBMovieResponseToMovieResponse(
    tmdbResponse: TMDBMovieResponse,
  ): MovieResponse {
    return {
      page: tmdbResponse.page,
      results: tmdbResponse.results.map((tmdbMovie) =>
        this.mapTMDBMovieToMovie(tmdbMovie),
      ),
      total_pages: tmdbResponse.total_pages,
      total_results: tmdbResponse.total_results,
    };
  }

  static mapTMDBMovieDetailsToMovie(
    tmdbMovieDetails: TMDBMovieDetails,
  ): MovieDetails {
    return {
      id: tmdbMovieDetails.id,
      title: tmdbMovieDetails.title,
      releaseDate: tmdbMovieDetails.release_date,
      runtime: tmdbMovieDetails.runtime,
      genres: tmdbMovieDetails.genres.map((genre) => ({ name: genre.name })),
      overview: tmdbMovieDetails.overview,
      posterPath: tmdbMovieDetails.poster_path,
      credits: {
        cast: tmdbMovieDetails.credits.cast.slice(0, 6).map((cast) => ({
          id: cast.id,
          name: cast.name,
          character: cast.character,
          profilePath: cast.profile_path,
        })),
        crew: tmdbMovieDetails.credits.crew
          .filter((crew) => crew.job === 'Director')
          .slice(0, 6)
          .map((crew) => ({
            id: crew.id,
            name: crew.name,
            job: crew.job,
            profilePath: crew.profile_path,
          })),
      },
      similar:
        tmdbMovieDetails.similar?.results
          .map((similar) => ({
            id: similar.id,
            title: similar.title,
            releaseDate: similar.release_date,
            genres: similar.genre_ids,
            overview: similar.overview,
            posterPath: similar.poster_path,
          }))
          .slice(0, 12) || [],
      videos: {
        results: tmdbMovieDetails.videos.results
          .filter(
            (video) => video.type === Type.Trailer && video.site === Site.YouTube,
          )
          .slice(0, 2)
          .map((video) => ({
            type: video.type,
            site: video.site,
            key: video.key,
          })),
      },
    };
  }
}