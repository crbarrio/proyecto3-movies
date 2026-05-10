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
  @Min(1)
  @Max(5)
  score?: number;
}