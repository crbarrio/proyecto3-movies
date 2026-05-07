# ROADMAP - BACKEND

## ORGANIZACIÓN BACKEND

```txt
src/
 ├── auth/
 ├── users/
 ├── favorites/
 ├── ratings/
 ├── prisma/
 ├── common/
 └── config/
```

# [ ] FASE 1 — DISEÑO DE LA BASE DE DATOS

## Entidades

```txt
User:
- id: number AI / PK
- name: string
- email: string
- created at: datetime
- last-seen: datetime password: string? hushed

MovieUser:
- user_id : number idx 
- movie_id: number idx
- score : number
- favorite: bool 
- watched: bool
```

---

# [ ] FASE 2 — DISEÑO DE LA API

## Endpoints

```txt
POST   /auth/register
POST   /auth/login

GET    /users/me

GET    /favorites
POST   /favorites/:movieId
DELETE /favorites/:movieId

GET    /ratings
POST   /ratings/:movieId
```
---

# [ ] FASE 3 — INICIO DEL BACKEND

## Stack
- NestJS
- Prisma ORM
- PostgreSQL
- JWT Authentication

# ORDEN DEL BACKEND

## 1. [X] Creación del proyecto NestJS dentro del monrepo

```bash
nest new backend
```

## 2. [X] Instalar Prisma

```bash
npm install prisma --save-dev
npm install @prisma/client
```

## 3. [X] Configurar PostgreSQL

docker-compose.yml

## 4. [X] Crear schema Prisma

- User
- MovieUser

## 5. [ ] Ejecutar migraciones

```bash
npx prisma migrate dev
```

---

# [ ] FASE 4 — AUTENTICACIÓN

## Implementar
- Register
- Login
- Password hashing
- JWT
- Protected routes

## Qué aprenderás aquí
- Guards
- JWT
- Hashing
- Interceptors
- DTO validation
- Arquitectura NestJS
- Seguridad básica

---

# [ ] FASE 5 — CAMBIO API TMBD A BACKEND

## Implementar
- Mover todas las llamadas de api de front a api propia
- Crear modulo tmdb en back
- Ofrecer resultados combinados de base de datos propia y tmbd dependiendo de si usuario tiene token JWT o no -> Endpoint híbrido.

```
movies/
 ├── movies.controller.ts
 ├── movies.service.ts
 ├── tmdb.service.ts

```

Controller
```typescript
@Get('trending')
getTrending(@Req() req) {
  return this.moviesService.getTrending(req.user?.id);
}
```

Service
```typescript
async getTrending(userId?: string) {

  const movies = await this.tmdbService.getTrending();

  if (!userId) {
    return movies;
  }

  const favorites =
    await this.favoritesService.getUserFavorites(userId);

  const ratings =
    await this.ratingsService.getUserRatings(userId);

  return movies.map(movie => ({
    ...movie,
    isFavorite: favorites.includes(movie.id),
    myRating: ratings[movie.id] ?? null
  }));
}
```

DTO
```typescript
type Movie = {
  id: number;
  title: string;

  isFavorite?: boolean;
  myRating?: number | null;
}
```


# [ ] FASE 6 — FAVORITOS

## Endpoints

```txt
POST /favorites/:movieId
DELETE /favorites/:movieId
GET /favorites
```

## Qué aprenderás aquí
- Relaciones en base de datos
- Prisma ORM
- Ownership data
- REST real
- Queries relacionales

---

# [ ] FASE 7 — RATINGS

## Objetivo
Permitir a los usuarios:
- puntuar películas
- actualizar puntuaciones
- consultar puntuaciones

---

# [ ] FASE 8 — INTEGRACIÓN ANGULAR

Conexión frontend y backend.