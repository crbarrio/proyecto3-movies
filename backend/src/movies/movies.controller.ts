import {
    Body,
    Controller,
    DefaultValuePipe,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Put,
    ParseIntPipe,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import type { MovieUser } from 'src/generated/prisma/client';
import type { MovieDetails, MovieResponse } from 'src/interfaces/movie.interface';
import { AuthGuard } from '../auth/auth.guard';
import { MoviesService } from './movies.service';
import { UpdateMovieUserDto } from './dtos/update-movie-user.dto';

type AuthenticatedRequest = Request & {
    user: {
        sub: number;
        name: string;
    };
};

@Controller('movies')
export class MoviesController {
    constructor(readonly moviesService: MoviesService) {}

    @HttpCode(HttpStatus.OK)
    @Get('trending')
    async getTrendingMovies(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('genreId') genreId?: string,
    ): Promise<MovieResponse> {
        return this.moviesService.getTrendingMovies(
            page,
            genreId === undefined ? null : Number(genreId),
        );
    }

    @HttpCode(HttpStatus.OK)
    @Get('search')
    async searchMovies(
        @Query('query') query: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    ): Promise<MovieResponse> {
        return this.moviesService.searchMovies(query, page);
    }

    @HttpCode(HttpStatus.OK)
    @Get('people/:personId')
    async getPersonById(
        @Param('personId', ParseIntPipe) personId: number,
    ) {
        return this.moviesService.getPersonById(personId);
    }

    @HttpCode(HttpStatus.OK)
    @Get(':movieId')
    async getMovieById(
        @Param('movieId', ParseIntPipe) movieId: number,
    ): Promise<MovieDetails> {
        return this.moviesService.getMovieById(movieId);
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @Get()
    async findMoviesByUserId(
        @Req() request: AuthenticatedRequest,
    ): Promise<MovieUser[]> {
        return this.moviesService.findMoviesByUserId(request.user.sub);
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @Put(':movieId')
    async upsertMovieForUser(
        @Param('movieId', ParseIntPipe) movieId: number,
        @Body() updateMovieUserDto: UpdateMovieUserDto,
        @Req() request: AuthenticatedRequest,
    ): Promise<MovieUser> {
        return this.moviesService.upsertMovieForUser(
            request.user.sub,
            movieId,
            updateMovieUserDto,
        );
    }
}
