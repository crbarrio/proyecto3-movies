export interface MovieUser {
  id: number;
  userId: number;
  movieId: number;
  createdAt: Date;
  updatedAt: Date;
  score: number;
  favorite: boolean;
  watched: boolean;
}