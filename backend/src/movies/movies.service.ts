import { Injectable } from '@nestjs/common';
import { MovieUser } from 'src/interfaces/movieUser.interface';

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
}
