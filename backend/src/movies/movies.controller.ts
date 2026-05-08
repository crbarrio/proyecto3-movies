import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Put,
    ParseIntPipe,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import type { MovieUser } from 'src/generated/prisma/client';
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
