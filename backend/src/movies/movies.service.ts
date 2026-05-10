import { BadRequestException, Injectable } from '@nestjs/common';
import { MovieUser } from 'src/generated/prisma/client';
import { Movie, MovieDetails, MovieResponse } from 'src/interfaces/movie.interface';
import {
    TMDBMovieDetails,
    TMDBMovieResponse,
} from 'src/interfaces/tmdb-movie.interface';
import { MovieDetailsMapper } from 'src/movies/mappers/movie-details.mapper';
import { UpdateMovieUserDto } from './dtos/update-movie-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TmdbService } from 'src/tmdb/tmdb.service';

type UserMovieState = Pick<MovieUser, 'watched' | 'favorite' | 'score'>;

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
        const userMovieStateById = await this.getUserMovieStateByMovieIds(
            userId,
            movieResponse.results.map((movie) => movie.id),
        );

        return {
            ...movieResponse,
            results: movieResponse.results.map((movie) =>
                this.enrichMovieWithUserState(
                    movie,
                    userMovieStateById.get(movie.id),
                    userId !== null,
                ),
            ),
        };
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
        const userMovieStateById = await this.getUserMovieStateByMovieIds(
            userId,
            movieResponse.results.map((movie) => movie.id),
        );

        return {
            ...movieResponse,
            results: movieResponse.results.map((movie) =>
                this.enrichMovieWithUserState(
                    movie,
                    userMovieStateById.get(movie.id),
                    userId !== null,
                ),
            ),
        };
    }

    async getMovieById(movieId: number, userId: number | null): Promise<MovieDetails> {
        const tmdbMovieDetails = await this.tmdbService.getMovieById(
            movieId,
        ) as TMDBMovieDetails;
        const movieDetails = MovieDetailsMapper.mapTMDBMovieDetailsToMovie(tmdbMovieDetails);
        const userMovieStateById = await this.getUserMovieStateByMovieIds(userId, [movieId]);

        return this.enrichMovieWithUserState(
            movieDetails,
            userMovieStateById.get(movieId),
        );
    }

    async getPersonById(personId: number) {
        return this.tmdbService.getPersonById(personId);
    }

    async findMoviesByUserId(userId: number): Promise<MovieUser[]> {
        return await this.prisma.movieUser.findMany({ where: { userId } });
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

    private enrichMovieWithUserState<T extends Movie | MovieDetails>(
        movie: T,
        userMovieState?: UserMovieState,
        includeEmptyUserState = false,
    ): T {
        if (!userMovieState) {
            if (!includeEmptyUserState) {
                return movie;
            }

            return {
                ...movie,
                watched: undefined,
                favorite: undefined,
                score: undefined,
            };
        }

        return {
            ...movie,
            watched: userMovieState.watched,
            favorite: userMovieState.favorite,
            score: userMovieState.score ?? undefined,
        };
    }
}
