# Proyecto3 Movies

Aplicacion full stack de catalogo de peliculas construida como monorepo. El proyecto consume datos de TMDB para explorar peliculas y personas, y combina esa informacion con datos propios de usuario como autenticacion, favoritos, vistas y puntuaciones.

El repositorio contiene dos aplicaciones principales:

- `frontend/`: cliente Angular.
- `backend/`: API NestJS.

## Demo

- URL publica: `https://movies.crbarrio.es`

## Que hace la aplicacion

### Funcionalidades principales

- Exploracion de peliculas en tendencia.
- Busqueda por titulo con debounce.
- Filtro por genero.
- Vista de detalle de pelicula.
- Visualizacion de reparto principal.
- Apertura de detalle de persona en modal.
- Visualizacion de trailers embebidos desde YouTube.
- Seccion de peliculas similares.
- Registro e inicio de sesion con JWT.
- Vista de perfil protegida.
- Marcado de peliculas como favoritas.
- Marcado de peliculas como vistas.
- Puntuacion de peliculas por usuario.
- Enriquecimiento de peliculas con estado del usuario y puntuacion media.

### Flujos de usuario implementados

- Usuario anonimo:
	puede explorar, buscar, filtrar y consultar detalles de peliculas y personas.
- Usuario autenticado:
	ademas puede gestionar favoritos, vistas y puntuaciones, y consultar su perfil.
- Login y registro:
	se resuelven desde modales enrutados con Angular CDK Dialog.

## Stack tecnologico

### Frontend

- Angular 21
- Angular Router
- Angular CDK
- Tailwind CSS 4
- RxJS
- Vitest

### Backend

- NestJS 11
- Prisma ORM
- PostgreSQL
- JWT para autenticacion
- Argon2 para hash de contrasenas
- Class Validator y ValidationPipe para validacion de DTOs
- Jest y Supertest para pruebas

### Infraestructura y desarrollo

- Docker Compose para Postgres local
- npm workspaces estilo monorepo por prefijo de carpeta
- `concurrently` para lanzar frontend y backend en paralelo

## Arquitectura general

### Frontend

El cliente Angular esta organizado alrededor de paginas, componentes reutilizables, servicios y guards.

- Home con listado principal, busqueda y filtros.
- Pagina de detalle de pelicula con cast, trailers y similares.
- Pagina de perfil protegida por guard.
- Modales para autenticacion y detalle de persona.
- Interceptores para autenticacion.

### Backend

La API NestJS esta separada en modulos por responsabilidad:

- `auth/`: login, registro y validacion de sesion.
- `users/`: acceso a usuarios.
- `movies/`: endpoints de peliculas y estado de usuario por pelicula.
- `tmdb/`: cliente HTTP hacia TMDB.
- `prisma/`: acceso a base de datos.

El backend no solo reenvia respuestas de TMDB. Tambien mezcla la informacion externa con datos propios del sistema, por ejemplo:

- favorito del usuario autenticado
- visto / no visto
- puntuacion individual
- puntuacion media agregada por pelicula

## Modelo de datos

La base de datos local guarda el estado de usuario sobre peliculas, no el catalogo completo de TMDB.

Entidades principales:

- `User`
- `MovieUser`

`MovieUser` relaciona un usuario con una pelicula externa de TMDB y almacena:

- `favorite`
- `watched`
- `score`

Tambien existe una restriccion unica por pareja `userId + movieId` para evitar duplicados.

## Requisitos previos

Antes de arrancar el proyecto necesitas:

- Node.js instalado
- npm disponible
- Docker Desktop en ejecucion si vas a usar la base de datos local con Compose
- Un access token de TMDB para el backend

## Variables de entorno

### Raiz del proyecto

Existe un archivo de ejemplo en `.env.example` con los valores de desarrollo para Docker:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=movies_db
DB_USER=movies_user
DB_PASSWORD=movies_password
```

### Backend

Existe un archivo de ejemplo en `backend/.env.example`:

```env
DATABASE_URL="postgresql://movies_user:movies_password@127.0.0.1:5432/movies_db?schema=public"
TMDB_API_URL="https://api.themoviedb.org/3"
TMDB_ACCESS_TOKEN="your_tmdb_access_token_here"
```

Pasos recomendados:

1. Copia `.env.example` a `.env` en la raiz si quieres personalizar Docker.
2. Copia `backend/.env.example` a `backend/.env`.
3. Sustituye `TMDB_ACCESS_TOKEN` por un token valido de TMDB.

## Puertos por defecto

- Frontend Angular: `http://localhost:4200`
- Backend NestJS: `http://localhost:3000`
- PostgreSQL: `localhost:5432`

El backend habilita CORS para `http://localhost:4200`.

## Instalacion

Instala las dependencias de cada bloque del monorepo:

```bash
npm install
npm --prefix backend install
npm --prefix frontend install
```

## Como arrancar el proyecto

### Opcion recomendada: todo el stack

```bash
npm run dev
```

Este comando hace lo siguiente:

1. Levanta Postgres con Docker.
2. Aplica migraciones de Prisma si la base esta vacia.
3. Arranca frontend y backend en paralelo.

### Opcion sin tocar Docker

```bash
npm run dev:no-db
```

Util si ya tienes la base de datos levantada o quieres conectarte a otra instancia.

### Arranque por separado

```bash
npm run front
npm run back
```

## Scripts disponibles en la raiz

- `npm run db:up`: levanta Postgres y espera a que este listo.
- `npm run db:down`: detiene y elimina el contenedor.
- `npm run db:logs`: muestra logs de Postgres.
- `npm run db:reset`: reinicia Postgres eliminando el volumen.
- `npm run db:init`: levanta Postgres y aplica migraciones del backend.
- `npm run front`: arranca el frontend.
- `npm run back`: arranca el backend.
- `npm run dev`: levanta DB, inicializa y arranca todo.
- `npm run dev:no-db`: arranca frontend y backend sin Docker.

## Scripts utiles por aplicacion

### Backend

```bash
npm --prefix backend run start
npm --prefix backend run start:dev
npm --prefix backend run build
npm --prefix backend run lint
npm --prefix backend run test
npm --prefix backend run test:e2e
```

### Frontend

```bash
npm --prefix frontend run start
npm --prefix frontend run build
npm --prefix frontend run test
```

## Base de datos local con Docker

La base de datos de desarrollo usa `postgres:16-alpine` a traves de Docker Compose.

Credenciales por defecto:

- host: `localhost`
- port: `5432`
- database: `movies_db`
- user: `movies_user`
- password: `movies_password`

Si el volumen de Docker esta vacio, el flujo de `npm run dev` aplica automaticamente las migraciones antes de arrancar el backend.

## Estructura del repositorio

```txt
.
|- backend/
|  |- prisma/
|  |- src/
|  |  |- auth/
|  |  |- movies/
|  |  |- prisma/
|  |  |- tmdb/
|  |  \- users/
|- frontend/
|  |- src/
|  |  |- app/
|  |  |  |- components/
|  |  |  |- layout/
|  |  |  |- pages/
|  |  |  \- services/
|- docs/
\- docker-compose.yml
```

## Experiencia de usuario actual

### Catalogo

- Listado principal de peliculas en tendencia.
- Busqueda por texto.
- Filtro por genero.
- Carga incremental de mas resultados.

### Detalle de pelicula

- Poster y metadatos principales.
- Sinopsis.
- Direccion y reparto principal.
- Trailers embebidos.
- Recomendaciones de peliculas similares.

### Cuenta de usuario

- Registro.
- Login.
- Perfil protegido.
- Listado de favoritas.
- Listado de vistas.
- Puntuacion media basada en peliculas valoradas.

## Integracion con TMDB

La aplicacion utiliza TMDB como fuente externa de datos para:

- peliculas en tendencia
- busqueda de peliculas
- detalle de pelicula
- creditos
- videos
- peliculas similares
- detalle de persona

Para mostrar imagenes se usa la base URL configurada en el frontend:

- `https://image.tmdb.org/t/p/w500`

## Consideraciones importantes

- El frontend apunta por defecto al backend local en `http://localhost:3000`.
- El backend necesita un token valido de TMDB para responder correctamente.
- La informacion persistida en Postgres corresponde al usuario y a su relacion con peliculas, no al catalogo completo.
- La ruta `/profile` esta protegida y requiere sesion autenticada.

## Estado del proyecto

Actualmente ya estan implementados los bloques principales del MVP:

- exploracion y busqueda
- detalle de pelicula y personas
- autenticacion
- favoritos, vistas y puntuaciones
- perfil de usuario

Lineas de mejora ya detectadas en la documentacion interna:

- cache de resultados de busqueda
- expiracion de cache
- preservar resultados al cambiar de URL
- seguir reforzando accesibilidad
- evaluar autenticacion con Google

## Creditos

- Datos de peliculas y personas: TMDB
- UI cliente: Angular + Tailwind CSS
- API y persistencia: NestJS + Prisma + PostgreSQL
