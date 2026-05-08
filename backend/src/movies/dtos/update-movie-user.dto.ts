import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';

export class UpdateMovieUserDto {
  @IsOptional()
  @IsBoolean()
  favorite?: boolean;

  @IsOptional()
  @IsBoolean()
  watched?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  score?: number;
}