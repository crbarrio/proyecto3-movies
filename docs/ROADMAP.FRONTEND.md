# ROADMAP - FRONTEND


# ORGANIZACIÓN ANGULAR RECOMENDADA

```txt

core/

shared/

features/

&#x20; movies/

&#x20; auth/

&#x20; favorites/

```


## Layout y estilos globales

Referencia de diseno:
- https://stitch.withgoogle.com/projects/481083851166552973

- [X] Diseñar layout global y estilos base.
- [X] Implementar navbar.
- [X] Implementar footer.
- [X] Evaluar uso de DaisyUI -> Descartado
- [ ] Evaluar Angular CDK para modales.
- [X] Definir uso de iconos. -> Material Icon con cdn
- [X] Insertar logo de TMDB.


## API y datos

- [ ] Explorar el funcionamiento de la API y revisar que datos expone.
	- https://developer.themoviedb.org/reference/person-details

- [X] Definir interfaces de datos.
- [ ] Mapper para filtrar la respuesta de la api
- [X] Crear servicio de películas.
- [X] Mostrar primeros datos en la UI.
- [X] Paginar la petición y respuesta


## Diseño UI

- [X] Crear sección Home.
- [ ] Función buscar
- [X] Filtros por Categorías
- [ ] Crear detalle de película.
  - [ ] Mostrar sinopsis, actores, dirección, fecha de estreno y datos relacionados.
  - [ ] Trailer YouTube - investigar api tmdb
- [ ] Crear detalle de actor.
- [ ] Mostrar fotografía, nombre, nacionalidad, películas en las que actúa y películas que ha dirigido.
- [ ] Crear detalle de director.
- [ ] Mostrar fotografía, nombre, nacionalidad, películas en las que participa y películas en las que ha sido actor.
- [ ] Emitir señal en la card para que el listado gestione la navegación al detalle con `navigator`.


## Navegación y búsqueda

- [ ] Generar URL única para cada película, actor y productor.
- [ ] Implementar cache de resultados de búsqueda.
- [ ] Definir expiración de cache.
- [ ] Preservar resultados después de cambiar de URL.
- [ ] Implementar debounce en la búsqueda.


## Autenticación y usuario

- [ ] Implementar sistema de autenticación.

  - [ ] Crear modal de login y formulario con signals y validaciones
- [ ] Probar protección de vistas.
- [ ] Crear sección de usuario protegida tras autenticación:  Datos personales, listado favoritos
- [ ] Implementar CRUD de favoritos.
- [ ] Implementar puntuaciones.
- [ ] Mostrar opciones extra si el usuario está autenticado.
- [ ] Permitir marcar como favorita.
- [ ] Permitir marcar como vista.
- [ ] Permitir puntuar.


## Calidad
- [ ] Revisar accesibilidad.


## Extras

- [ ] Scroll Infinito
- [ ] Evaluar autenticación con Google.

