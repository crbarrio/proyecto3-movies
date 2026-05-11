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
- [X] Evaluar Angular CDK para modales.
- [X] Definir uso de iconos. -> Material Icon con cdn
- [X] Insertar logo de TMDB.


## API y datos

- [X] Explorar el funcionamiento de la API y revisar que datos expone.
	- https://developer.themoviedb.org/reference/person-details

- [X] Definir interfaces de datos.
- [X] Mapper para filtrar la respuesta de la api
- [X] Crear servicio de películas.
- [X] Mostrar primeros datos en la UI.
- [X] Paginar la petición y respuesta


## Diseño UI

- [X] Crear sección Home.
- [X] Función buscar
- [X] Filtros por Categorías
- [X] Crear detalle de película.
  - [X] Mostrar sinopsis, actores, dirección, fecha de estreno y datos relacionados.
  - [X] Trailer YouTube - investigar api tmdb
- [X] Crear detalle de cast y crew.
- [X] Mostrar fotografía, nombre, nacionalidad...
- [X] Emitir señal en la card para que el listado gestione la navegación al detalle con `navigator` -> Descartado por reutilización del componente en diferentes páginas. Es más cómodo que la navegación viva en el componente.
- [X] Crear imagen para cuando no hay cover de la pelicula. que no rompa la imagen


## Navegación y búsqueda

- [X] Generar URL única para cada película, la url para personas esta implementada como query param de la pelicula.
- [ ] Implementar cache de resultados de búsqueda.
- [ ] Definir expiración de cache.
- [ ] Preservar resultados después de cambiar de URL.
- [X] Implementar debounce en la búsqueda.


## Autenticación y usuario

- [X] Implementar sistema de autenticación.
- [X] Crear modal de login y formulario con signals y validaciones
- [X] Probar protección de vistas.
- [X] Crear sección de usuario protegida tras autenticación:  Datos personales, listado favoritos
- [X] Implementar CRUD de favoritos.
- [X] Implementar puntuaciones.
- [X] Mostrar opciones extra si el usuario está autenticado.
- [X] Permitir marcar como favorita.
- [X] Permitir marcar como vista.
- [X] Permitir puntuar -> Solo en la vista de detalles de la película


## Calidad
- [ ] Revisar accesibilidad.


## Extras

- [X] Scroll Infinito -> cambio por paginación tipo "mostrar más"
- [ ] Evaluar autenticación con Google.

