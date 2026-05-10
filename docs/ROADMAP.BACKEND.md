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

# [X] FASE 2 — DISEÑO DE LA API

## Endpoints

```txt
POST   /auth/register
POST   /auth/login
POST   /auth/logout
GET    /auth/me

GET    /movies/trending?page=:page&genreId=:genreId
GET    /movies/search?query=:query&page=:page
GET    /movies/people/:personId
GET    /movies/:movieId
GET    /movies
PUT    /movies/:movieId
```

## Body esperado en POST y PUT

### POST /auth/register

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "12345678"
}
```

Reglas:
- `name`: string obligatorio
- `email`: string obligatorio con formato email valido
- `password`: string obligatorio de minimo 8 caracteres

### POST /auth/login

```json
{
  "email": "ada@example.com",
  "password": "12345678"
}
```

Reglas:
- `email`: string obligatorio con formato email valido
- `password`: string obligatorio

### POST /auth/logout

No espera body.

### PUT /movies/:movieId

```json
{
  "favorite": true,
  "watched": true,
  "score": 8
}
```

Reglas:
- `favorite`: boolean opcional
- `watched`: boolean opcional
- `score`: integer opcional entre 0 y 10
- el backend exige que venga al menos uno de estos campos
---

# [X] FASE 3 — INICIO DEL BACKEND

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

## 5. [X] Ejecutar migraciones

```bash
npx prisma migrate dev
```

---

# [X] FASE 4 — AUTENTICACIÓN

## Implementar
- Register -> OK
- Login -> OK
- Password hashing -> argon2
- JWT-> OK
- Protected routes -> OK
- Cablear formularios de registro y login -> OK


# [~] FASE 5 — CAMBIO API TMDB A BACKEND

## Estado actual
- [X] Crear modulo `tmdb` en backend
- [X] Exponer endpoints propios desde `movies.controller.ts`
- [X] Mover al backend las consultas principales de trending, búsqueda, detalle y persona
- [ ] Enriquecer respuestas TMDB con datos `MovieUser` del usuario autenticado

```
movies/
 ├── movies.controller.ts
 ├── movies.service.ts
 └── tmdb.service.ts
```

## Endpoints TMDB expuestos por backend

```txt
GET /movies/trending?page=:page&genreId=:genreId
GET /movies/search?query=:query&page=:page
GET /movies/:movieId
GET /movies/people/:personId
```

## Nota
Actualmente `MoviesService` consulta TMDB y mapea la respuesta al formato interno, pero todavia no mezcla esos resultados con favoritos, watched o score del usuario autenticado.


# [X] FASE 6 — ESTADO DE PELÍCULAS POR USUARIO

## Modelo actual
La aplicación no expone recursos separados de `favorites` y `ratings`. Todo el estado del usuario sobre una película se guarda en la entidad `MovieUser`.

Campos disponibles:
- `favorite`
- `watched`
- `score`

## Endpoints implementados

```txt
GET /movies
PUT /movies/:movieId
```

## Ejemplo de payload

```json
{
  "favorite": true,
  "watched": true,
  "score": 8
}
```

## Qué aprenderás aquí
- Relaciones en base de datos
- Prisma ORM
- Ownership data
- Upsert sobre clave compuesta `userId + movieId`
- Rutas protegidas con JWT

---

# [X] FASE 7 — FAVORITOS Y RATINGS

## Estado actual
Favoritos y ratings ya están resueltos dentro de `MovieUser`.

Permite a los usuarios:
- marcar una película como favorita
- marcar una película como vista
- puntuar películas de 0 a 10
- actualizar cualquiera de esos campos con un único `PUT /movies/:movieId`
- consultar su colección con `GET /movies`

---

# [ ] FASE 8 — INTEGRACIÓN ANGULAR

Conexión frontend y backend.