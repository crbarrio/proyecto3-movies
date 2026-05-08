import { BadRequestException, Injectable } from '@nestjs/common';
import { MovieUser } from 'src/generated/prisma/client';
import { UpdateMovieUserDto } from './dtos/update-movie-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MoviesService {
    constructor(private readonly prisma: PrismaService) {}

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
