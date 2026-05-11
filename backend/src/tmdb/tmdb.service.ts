import {
	HttpException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class TmdbService {
	private readonly apiUrl = process.env.TMDB_API_URL;
	private readonly accessToken = process.env.TMDB_ACCESS_TOKEN;

	async getTrendingMovies(page: number, genreId: number | null) {
		const endpoint = genreId === null ? 'trending/movie/week' : 'discover/movie';
		const params = new URLSearchParams({ page: String(page) });

		if (genreId !== null) {
			params.set('with_genres', String(genreId));
		}

		return this.request(`${endpoint}?${params.toString()}`);
	}

	async searchMovies(query: string, page: number) {
		const params = new URLSearchParams({ query, page: String(page) });

		return this.request(`search/movie?${params.toString()}`);
	}

	async getMovieById(movieId: number) {
		return this.request(
			`movie/${movieId}?append_to_response=credits,similar,videos`,
		);
	}

	async getPersonById(personId: number) {
		return this.request(
			`person/${personId}?append_to_response=movie_credits`,
		);
	}

	private async request(path: string) {
		if (!this.apiUrl || !this.accessToken) {
			throw new InternalServerErrorException(
				'TMDB configuration is missing in environment variables',
			);
		}

		const response = await fetch(`${this.apiUrl}/${path}`, {
			headers: {
				Authorization: `Bearer ${this.accessToken}`,
				'Content-Type': 'application/json;charset=utf-8',
			},
		});

		if (!response.ok) {
			throw new HttpException(
				await this.getErrorMessage(response),
				response.status,
			);
		}

		return (await response.json()) as unknown;
	}

	private async getErrorMessage(response: Response): Promise<string> {
		try {
			const payload = (await response.json()) as { status_message?: string };
			return payload.status_message ?? 'TMDB request failed';
		} catch {
			return 'TMDB request failed';
		}
	}
}
