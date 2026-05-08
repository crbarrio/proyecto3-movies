import { BadRequestException, Injectable } from '@nestjs/common';
import { MovieUser } from 'src/generated/prisma/client';
import { MovieDetails, MovieResponse } from 'src/interfaces/movie.interface';
import {
    TMDBMovieDetails,
    TMDBMovieResponse,
} from 'src/interfaces/tmdb-movie.interface';
import { MovieDetailsMapper } from 'src/movies/mappers/movie-details.mapper';
import { UpdateMovieUserDto } from './dtos/update-movie-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TmdbService } from 'src/tmdb/tmdb.service';

@Injectable()
export class MoviesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly tmdbService: TmdbService,
    ) {}

    async getTrendingMovies(
        page: number,
        genreId: number | null,
    ): Promise<MovieResponse> {
        const tmdbMovieResponse = await this.tmdbService.getTrendingMovies(
            page,
            genreId,
        ) as TMDBMovieResponse;
        const movieResponse: MovieResponse =
            MovieDetailsMapper.mapTMDBMovieResponseToMovieResponse(
                tmdbMovieResponse,
            );

        return movieResponse;
    }

    async searchMovies(query: string, page: number): Promise<MovieResponse> {
        const tmdbMovieResponse = await this.tmdbService.searchMovies(
            query,
            page,
        ) as TMDBMovieResponse;
        const movieResponse: MovieResponse =
            MovieDetailsMapper.mapTMDBMovieResponseToMovieResponse(
                tmdbMovieResponse,
            );

        return movieResponse;
    }

    async getMovieById(movieId: number): Promise<MovieDetails> {
        const tmdbMovieDetails = await this.tmdbService.getMovieById(
            movieId,
        ) as TMDBMovieDetails;

        return MovieDetailsMapper.mapTMDBMovieDetailsToMovie(tmdbMovieDetails);
    }

    async getPersonById(personId: number) {
        return this.tmdbService.getPersonById(personId);
    }

    async findMoviesByUserId(userId: number): Promise<MovieUser[]> {
        return this.prisma.movieUser.findMany({ where: { userId } });
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
}
