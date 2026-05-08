import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    ParseIntPipe,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import type { MovieUser } from '../interfaces/movieUser.interface';
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
    findMoviesByUserId(
        @Query('userId', ParseIntPipe) userId: number,
    ): MovieUser[] {
        return this.moviesService.findMoviesByUserId(userId);
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @Patch(':movieId')
    updateMovieForUser(
        @Param('movieId', ParseIntPipe) movieId: number,
        @Body() updateMovieUserDto: UpdateMovieUserDto,
        @Req() request: AuthenticatedRequest,
    ): MovieUser {
        return this.moviesService.updateMovieForUser(
            request.user.sub,
            movieId,
            updateMovieUserDto,
        );
    }
}
