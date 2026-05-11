import { Movie } from 'src/interfaces/movie.interface';
import {
  Person,
  TMDBPersonDetails,
  TMDBPersonMovieCredit,
} from 'src/interfaces/person.interface';

export class PersonDetailsMapper {
  static mapTMDBPersonMovieCreditToMovie(
    tmdbPersonMovieCredit: TMDBPersonMovieCredit,
  ): Movie {
    return {
      id: tmdbPersonMovieCredit.id,
      title: tmdbPersonMovieCredit.title,
      releaseDate: tmdbPersonMovieCredit.release_date ?? '',
      genres: tmdbPersonMovieCredit.genre_ids,
      overview: tmdbPersonMovieCredit.overview,
      posterPath: tmdbPersonMovieCredit.poster_path,
      averageScore: Number(tmdbPersonMovieCredit.vote_average.toFixed(1)),
    };
  }

  static mapTMDBPersonDetailsToPerson(
    tmdbPersonDetails: TMDBPersonDetails,
  ): Person {
    return {
      adult: tmdbPersonDetails.adult,
      also_known_as: tmdbPersonDetails.also_known_as,
      biography: tmdbPersonDetails.biography,
      birthday: tmdbPersonDetails.birthday,
      deathday: tmdbPersonDetails.deathday,
      filmography: tmdbPersonDetails.movie_credits.cast.map((credit) =>
        this.mapTMDBPersonMovieCreditToMovie(credit),
      ),
      gender: tmdbPersonDetails.gender,
      homepage: tmdbPersonDetails.homepage,
      id: tmdbPersonDetails.id,
      imdb_id: tmdbPersonDetails.imdb_id,
      known_for_department: tmdbPersonDetails.known_for_department,
      name: tmdbPersonDetails.name,
      place_of_birth: tmdbPersonDetails.place_of_birth,
      popularity: tmdbPersonDetails.popularity,
      profile_path: tmdbPersonDetails.profile_path,
    };
  }
}