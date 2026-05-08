import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TmdbModule } from 'src/tmdb/tmdb.module';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';

@Module({
  providers: [MoviesService],
  controllers: [MoviesController],
  imports: [AuthModule, TmdbModule],
})
export class MoviesModule {}
