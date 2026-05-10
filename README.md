# Proyecto3 Movies

Monorepo base con dos aplicaciones hermanas:

- `frontend/`: Angular + Tailwind
- `backend/`: API con NestJS

## Comandos raiz

- `npm run db:up`: levanta Postgres en Docker y espera a que quede listo
- `npm run db:down`: detiene y elimina el contenedor
- `npm run db:logs`: muestra los logs del contenedor Postgres
- `npm run db:reset`: reinicia Postgres eliminando tambien el volumen
- `npm run db:init`: levanta Postgres y aplica las migraciones de Prisma si la base esta vacia
- `npm run front`: arranca Angular
- `npm run back`: arranca NestJS
- `npm run dev`: levanta Postgres, inicializa la base si hace falta y despues lanza frontend + backend
- `npm run dev:no-db`: lanza frontend + backend sin tocar Docker

## Postgres local con Docker

Requisito: Docker Desktop corriendo.

La base expone el puerto `5432` con estas credenciales de desarrollo:

- host: `localhost`
- port: `5432`
- database: `movies_db`
- user: `movies_user`
- password: `movies_password`

En el primer `npm run dev`, si el volumen de Docker esta vacio, se aplican automaticamente las migraciones de Prisma antes de arrancar el backend.
