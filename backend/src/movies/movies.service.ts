import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { MovieUser } from '../interfaces/movieUser.interface';

type UpdateMovieUserValues = {
    favorite?: boolean;
    watched?: boolean;
    score?: number;
};

@Injectable()
export class MoviesService {
    private readonly moviesUser: MovieUser[] = [
        {
            id: 1,
            userId: 1,
            movieId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            score: 8,
            favorite: true,
            watched: true,
        },
        {
            id: 2,
            userId: 1,
            movieId: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
            score: 7,
            favorite: false,
            watched: true,
        },
    ];

    findMoviesByUserId(userId: number): MovieUser[] {
        return this.moviesUser.filter(movie => movie.userId === userId);
    }

    updateMovieForUser(
        userId: number,
        movieId: number,
        updateMovieUserDto: UpdateMovieUserValues,
    ): MovieUser {
        if (
            updateMovieUserDto.favorite === undefined &&
            updateMovieUserDto.watched === undefined &&
            updateMovieUserDto.score === undefined
        ) {
            throw new BadRequestException('At least one field must be provided');
        }

        const movieIndex = this.moviesUser.findIndex(
            (movie) => movie.userId === userId && movie.movieId === movieId,
        );

        if (movieIndex === -1) {
            throw new NotFoundException('Movie not found for user');
        }

        const currentMovie = this.moviesUser[movieIndex];
        const updatedMovie: MovieUser = {
            ...currentMovie,
            favorite: updateMovieUserDto.favorite ?? currentMovie.favorite,
            watched: updateMovieUserDto.watched ?? currentMovie.watched,
            score: updateMovieUserDto.score ?? currentMovie.score,
            updatedAt: new Date(),
        };

        this.moviesUser[movieIndex] = updatedMovie;

        return updatedMovie;
    }
}
