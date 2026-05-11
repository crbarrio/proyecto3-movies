import { BadRequestException, Injectable } from '@nestjs/common';
import { MovieUser, Prisma } from 'src/generated/prisma/client';
import { Movie, MovieDetails, MovieResponse, UserMovieLists } from 'src/interfaces/movie.interface';
import {
    Person,
    TMDBPersonDetails,
} from 'src/interfaces/person.interface';
import {
    TMDBMovieDetails,
    TMDBMovieResponse,
} from 'src/interfaces/tmdb-movie.interface';
import { MovieDetailsMapper } from 'src/movies/mappers/movie-details.mapper';
import { PersonDetailsMapper } from 'src/movies/mappers/person-details.mapper';
import { UpdateMovieUserDto } from './dtos/update-movie-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TmdbService } from 'src/tmdb/tmdb.service';

type UserMovieState = Pick<MovieUser, 'watched' | 'favorite' | 'score'>;
type MovieMetadata = {
    userMovieStateById: Map<number, UserMovieState>;
    averageScoreByMovieId: Map<number, number>;
};
type UserMovieListEntry = Pick<MovieUser, 'movieId' | 'favorite' | 'watched'>;

@Injectable()
export class MoviesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly tmdbService: TmdbService,
    ) {}

    async getTrendingMovies(
        page: number,
        genreId: number | null,
        userId: number | null,
    ): Promise<MovieResponse> {
        const tmdbMovieResponse = await this.tmdbService.getTrendingMovies(
            page,
            genreId,
        ) as TMDBMovieResponse;
        const movieResponse: MovieResponse =
            MovieDetailsMapper.mapTMDBMovieResponseToMovieResponse(
                tmdbMovieResponse,
            );

        return this.enrichMovieResponse(movieResponse, userId);
    }

    async searchMovies(query: string, page: number, userId: number | null): Promise<MovieResponse> {
        const tmdbMovieResponse = await this.tmdbService.searchMovies(
            query,
            page
        ) as TMDBMovieResponse;
        const movieResponse: MovieResponse =
            MovieDetailsMapper.mapTMDBMovieResponseToMovieResponse(
                tmdbMovieResponse,
            );

        return this.enrichMovieResponse(movieResponse, userId);
    }

    async getMovieById(movieId: number, userId: number | null): Promise<MovieDetails> {
        const tmdbMovieDetails = await this.tmdbService.getMovieById(
            movieId,
        ) as TMDBMovieDetails;
        const movieDetails = MovieDetailsMapper.mapTMDBMovieDetailsToMovie(tmdbMovieDetails);
        const relatedMovieIds = [movieId, ...(movieDetails.similar?.map((movie) => movie.id) ?? [])];
        const movieMetadata = await this.getMovieMetadataByIds(userId, relatedMovieIds);

        return {
            ...this.enrichMovie(
                movieDetails,
                movieMetadata.averageScoreByMovieId.get(movieId),
                movieMetadata.userMovieStateById.get(movieId),
            ),
            similar: this.enrichMovies(
                movieDetails.similar ?? [],
                movieMetadata,
                userId !== null,
            ),
        };
    }

    async getPersonById(personId: number, userId: number | null): Promise<Person> {
        const personDetails = await this.tmdbService.getPersonById(personId) as TMDBPersonDetails;
        const person = PersonDetailsMapper.mapTMDBPersonDetailsToPerson(personDetails);
        const movieMetadata = await this.getMovieMetadataByIds(
            userId,
            person.filmography.map((movie) => movie.id),
        );

        return {
            ...person,
            filmography: this.enrichMovies(
                person.filmography,
                movieMetadata,
                userId !== null,
            ),
        };
    }

    async findMoviesByUserId(userId: number): Promise<MovieUser[]> {
        return await this.prisma.movieUser.findMany({ where: { userId } });
    }

    async getUserMovieLists(userId: number): Promise<UserMovieLists> {
        const userMovieEntries = await this.getUserMovieListEntries(userId);
        const movieIds = [...new Set(userMovieEntries.map(({ movieId }) => movieId))];

        if (movieIds.length === 0) {
            return {
                averageScore: undefined,
                favorites: [],
                watched: [],
            };
        }

        const [hydratedMovies, movieMetadata] = await Promise.all([
            this.hydrateMoviesByIds(movieIds),
            this.getMovieMetadataByIds(userId, movieIds),
        ]);

        const moviesById = new Map<number, Movie>(
            this.enrichMovies(hydratedMovies, movieMetadata, true).map((movie) => [movie.id, movie]),
        );

        return {
            averageScore: this.getMovieListAverageScore(moviesById),
            favorites: this.collectMoviesFromEntries(userMovieEntries, moviesById, 'favorite'),
            watched: this.collectMoviesFromEntries(userMovieEntries, moviesById, 'watched'),
        };
    }

    async upsertMovieForUser(
        userId: number,
        movieId: number,
        updateMovieUserDto: UpdateMovieUserDto,
    ): Promise<MovieUser> {
        if (
            updateMovieUserDto.favorite === undefined &&
            updateMovieUserDto.watched === undefined &&
            updateMovieUserDto.score === undefined
        ) {
            throw new BadRequestException('At least one field must be provided');
        }

        const movieUserData = {
            favorite: updateMovieUserDto.favorite,
            watched: updateMovieUserDto.watched,
            score: updateMovieUserDto.score,
        };

        return this.prisma.movieUser.upsert({
            where: {
                userId_movieId: {
                    userId,
                    movieId,
                },
            },
            update: movieUserData,
            create: {
                userId,
                movieId,
                ...movieUserData,
            },
        });
    }

    private async enrichMovieResponse(
        movieResponse: MovieResponse,
        userId: number | null,
    ): Promise<MovieResponse> {
        const movieMetadata = await this.getMovieMetadataByIds(
            userId,
            movieResponse.results.map((movie) => movie.id),
        );

        return {
            ...movieResponse,
            results: this.enrichMovies(
                movieResponse.results,
                movieMetadata,
                userId !== null,
            ),
        };
    }

    private async getUserMovieListEntries(userId: number): Promise<UserMovieListEntry[]> {
        return this.prisma.movieUser.findMany({
            where: {
                userId,
                OR: [
                    { favorite: true },
                    { watched: true },
                ],
            },
            orderBy: {
                updatedAt: 'desc',
            },
            select: {
                movieId: true,
                favorite: true,
                watched: true,
            },
        });
    }

    private async getMovieMetadataByIds(
        userId: number | null,
        movieIds: number[],
    ): Promise<MovieMetadata> {
        const [userMovieStateById, averageScoreByMovieId] = await Promise.all([
            this.getUserMovieStateByMovieIds(userId, movieIds),
            this.getAverageScoreByMovieIds(movieIds),
        ]);

        return {
            userMovieStateById,
            averageScoreByMovieId,
        };
    }

    private async getUserMovieStateByMovieIds(
        userId: number | null,
        movieIds: number[],
    ): Promise<Map<number, UserMovieState>> {
        if (!userId || movieIds.length === 0) {
            return new Map<number, UserMovieState>();
        }

        const userMovies = await this.prisma.movieUser.findMany({
            where: {
                userId,
                movieId: { in: movieIds },
            },
            select: {
                movieId: true,
                watched: true,
                favorite: true,
                score: true,
            },
        }) as Array<UserMovieState & { movieId: number }>;

        return new Map<number, UserMovieState>(
            userMovies.map(({ movieId, ...userMovieState }) => [movieId, userMovieState]),
        );
    }

    private async getAverageScoreByMovieIds(movieIds: number[]): Promise<Map<number, number>> {
        if (movieIds.length === 0) {
            return new Map<number, number>();
        }

        const groupByArgs = {
            by: ['movieId'],
            where: {
                movieId: { in: movieIds },
                score: { not: null },
            },
            _avg: {
                score: true,
            },
        } satisfies Prisma.MovieUserGroupByArgs;

        const groupedScores = await this.prisma.movieUser.groupBy(groupByArgs);

        return new Map<number, number>(
            groupedScores.flatMap(({ movieId, _avg }) => {
                const averageScore = this.normalizeAverageScore(_avg?.score);

                return averageScore === undefined ? [] : [[movieId, averageScore]];
            }),
        );
    }

    private async hydrateMoviesByIds(movieIds: number[]): Promise<Movie[]> {
        return Promise.all(
            movieIds.map(async (movieId): Promise<Movie> => {
                const movieDetails = await this.tmdbService.getMovieById(movieId) as TMDBMovieDetails;

                return MovieDetailsMapper.mapTMDBMovieDetailsToMovieSummary(movieDetails);
            }),
        );
    }

    private collectMoviesFromEntries(
        userMovieEntries: UserMovieListEntry[],
        moviesById: Map<number, Movie>,
        flag: keyof Pick<UserMovieListEntry, 'favorite' | 'watched'>,
    ): Movie[] {
        return userMovieEntries.flatMap((entry) => {
            if (!entry[flag]) {
                return [];
            }

            const movie = moviesById.get(entry.movieId);
            return movie ? [movie] : [];
        });
    }

    private getMovieListAverageScore(moviesById: Map<number, Movie>): number | undefined {
        const averageScores = [...moviesById.values()]
            .flatMap((movie) => movie.averageScore === undefined ? [] : [movie.averageScore]);

        if (averageScores.length === 0) {
            return undefined;
        }

        const averageScore = averageScores.reduce((sum, score) => sum + score, 0) / averageScores.length;

        return this.normalizeAverageScore(averageScore);
    }

    private enrichMovies<T extends Movie | MovieDetails>(
        movies: T[],
        movieMetadata: MovieMetadata,
        includeEmptyUserState = false,
    ): T[] {
        return movies.map((movie) =>
            this.enrichMovie(
                movie,
                movieMetadata.averageScoreByMovieId.get(movie.id),
                movieMetadata.userMovieStateById.get(movie.id),
                includeEmptyUserState,
            ),
        );
    }

    private enrichMovie<T extends Movie | MovieDetails>(
        movie: T,
        averageScore?: number,
        userMovieState?: UserMovieState,
        includeEmptyUserState = false,
    ): T {
        if (!userMovieState) {
            if (!includeEmptyUserState) {
                return averageScore === undefined
                    ? movie
                    : {
                        ...movie,
                        averageScore,
                    };
            }

            return {
                ...movie,
                averageScore,
                watched: undefined,
                favorite: undefined,
                score: undefined,
            };
        }

        return {
            ...movie,
            averageScore,
            watched: userMovieState.watched,
            favorite: userMovieState.favorite,
            score: userMovieState.score ?? undefined,
        };
    }

    private normalizeAverageScore(score: number | null | undefined): number | undefined {
        if (score === null || score === undefined) {
            return undefined;
        }

        return Number(score.toFixed(1));
    }
}
