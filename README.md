# Proyecto3 Movies

Monorepo base con dos aplicaciones hermanas:

- `frontend/`: Angular + Tailwind
- `backend/`: API con NestJS

## Comandos raiz

- `npm run db:up`: levanta MySQL en Docker
- `npm run db:down`: detiene y elimina el contenedor
- `npm run db:logs`: muestra los logs del contenedor MySQL
- `npm run db:reset`: reinicia MySQL eliminando tambien el volumen
- `npm run front`: arranca Angular
- `npm run back`: arranca NestJS
- `npm run dev`: levanta MySQL y despues lanza frontend + backend
- `npm run dev:no-db`: lanza frontend + backend sin tocar Docker

## MySQL local con Docker

Requisito: Docker Desktop corriendo.

La base expone el puerto `3306` con estas credenciales de desarrollo:

- host: `localhost`
- port: `3306`
- database: `movies_db`
- user: `movies_user`
- password: `movies_password`
- root password: `root_password`
