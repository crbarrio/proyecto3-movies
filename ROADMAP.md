# Movies Roadmap

Documento vivo para reflejar la evolucion del desarrollo del proyecto.

## Base del proyecto

- [X] Infraestructura base del proyecto: generar frontend Angular, backend NestJS y base de datos MySQL con Docker.
- [X] Consolidar el monorepo Git del proyecto.

## Layout y estilos globales

- [X] Diseñar layout global y estilos base.
- [X] Implementar navbar.
- [X] Implementar footer.
- [X] Evaluar uso de DaisyUI -> Descartado
- [ ] Evaluar Angular CDK para modales.
- [X] Definir uso de iconos. -> Material Icon con cdn
- [X] Insertar logo de TMDB.

Referencia de diseno:
- https://stitch.withgoogle.com/projects/481083851166552973

## API y datos

- [ ] Explorar el funcionamiento de la API y revisar que datos expone.
- [ ] Definir interfaces de datos.
- [ ] Crear servicio de peliculas.
- [ ] Mostrar primeros datos en la UI.

## Diseno UI

- [ ] Crear seccion Home.
- [ ] Crear detalle de pelicula.
- [ ] Mostrar sinopsis, actores, direccion, fecha de estreno, trailer y datos relacionados.
- [ ] Crear detalle de actor.
- [ ] Mostrar fotografia, nombre, nacionalidad, peliculas en las que actua y peliculas que ha dirigido.
- [ ] Crear detalle de director.
- [ ] Mostrar fotografia, nombre, nacionalidad, peliculas en las que participa y peliculas en las que ha sido actor.
- [ ] Emitir senal en la card para que el listado gestione la navegacion al detalle con `navigator`.

## Navegacion y busqueda

- [ ] Generar URL unica para cada pelicula, actor y productor.
- [ ] Implementar cache de resultados de busqueda.
- [ ] Definir expiracion de cache.
- [ ] Preservar resultados despues de cambiar de URL.
- [ ] Implementar debounce en la busqueda.

## Backend y base de datos

- [ ] Crear backend.
- [ ] Reforzar conceptos de NestJS necesarios para el proyecto.
- [ ] Crear base de datos MySQL.
- [ ] Disenar tablas.
- [ ] Enlazar frontend, backend y base de datos.

## Autenticacion y usuario

- [ ] Implementar sistema de autenticacion.
- [ ] Crear modal de login.
- [ ] Evaluar autenticacion con base de datos y Google.
- [ ] Probar proteccion de vistas.
- [ ] Crear seccion de favoritas.
- [ ] Evaluar estadisticas de usuario.
- [ ] Crear seccion de usuario protegida tras autenticacion.
- [ ] Implementar CRUD de favoritos.
- [ ] Implementar puntuaciones.
- [ ] Mostrar opciones extra si el usuario esta autenticado.
- [ ] Permitir marcar como favorita.
- [ ] Permitir marcar como vista.
- [ ] Permitir puntuar.

## Calidad

- [ ] Revisar accesibilidad.
