import { Controller, Get, HttpCode, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('movies')
export class MoviesController {
    constructor( readonly moviesService: MoviesService ) {}

    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @Get(':userId')
    findMoviesByUserId(@Param('userId') userId: number) {
        return this.moviesService.findMoviesByUserId(userId);
    }
}
