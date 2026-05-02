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

## 1. [ ] Creación del proyecto NestJS dentro del monrepo

```bash
nest new backend
```

## 2. [ ] Instalar Prisma

```bash
npm install prisma --save-dev
npm install @prisma/client
```

## 3. [ ] Configurar PostgreSQL

docker-compose.yml

## 4. [] Crear schema Prisma

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

# [ ] FASE 5 — FAVORITOS

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