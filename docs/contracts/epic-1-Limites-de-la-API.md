# EPIC 1 Endpoints y Limites de la API

## Definicion

Este documento deja cerrado que endpoints de TMDb necesitamos en EPIC 1 para construir el catalogo local del MVP. Su funcion es limitar la integracion a las llamadas estrictamente necesarias para poblar peliculas, generos y providers, sin abrir alcance a logica de recomendacion.

## Resumen sencillo

En este epic usamos TMDb solo para traer y validar datos. No usamos TMDb para recomendar. Lo que queremos construir es una base local minima con peliculas, metadata y providers por region para que Mood Radar pueda trabajar despues sin llamar a TMDb en cada decision.

## Regla general

- TMDb se usa como fuente de datos
- MoodFix no delega en TMDb la logica de recomendacion
- en EPIC 1 solo necesitamos endpoints para ingestión, normalizacion y validacion del catalogo local
- no entran endpoints de series, cuentas de usuario, watchlists, favoritos ni IA

## Base de autenticacion

- Base URL API v3: `https://api.themoviedb.org/3`
- Metodo actual del proyecto: query param `api_key=TMDB_API_KEY`
- Metodo alternativo documentado: header `Authorization: Bearer TMDB_READ_ACCESS_TOKEN`

### Diferencia sencilla entre ambos formatos

- `API key`: se envia en la URL y simplifica scripts pequenos y pruebas rapidas
- `Bearer token`: se envia en el header `Authorization` y suele usarse mas en integraciones backend formales

Para EPIC 1, la implementacion actual del proyecto usa `TMDB_API_KEY`, asi que este contrato sigue esa fuente de verdad.

### Ejemplo base con API key

```bash
curl --request GET \
  --url 'https://api.themoviedb.org/3/genre/movie/list?api_key=TMDB_API_KEY&language=es-ES' \
  --header 'accept: application/json'
```

## Endpoints obligatorios

### 1. `genre/movie/list`

- Uso en EPIC 1: disponer del diccionario oficial de generos de peliculas
- Por que es obligatorio: necesitamos normalizar `genre_id` y validar el mapeo de EPIC 0
- Documentacion oficial: https://developer.themoviedb.org/reference/genre-movie-list

### 2. `discover/movie`

- Uso en EPIC 1: obtener candidatas para poblar el catalogo inicial
- Por que es obligatorio: es el punto de arranque de la ingestión
- Documentacion oficial: https://developer.themoviedb.org/reference/discover-movie

### Query params utiles para el MVP

- `language=es-ES`
- `page=1`
- `sort_by=popularity.desc`
- `include_adult=false`
- `include_video=false`
- `vote_count.gte=100`
- `vote_average.gte=...`
- `with_genres=...`
- `with_original_language=...`
- `primary_release_date.gte=...`
- `primary_release_date.lte=...`

### Nota de estrategia para evitar sesgo

`discover/movie` no debe apoyarse solo en `sort_by=popularity.desc`. Para la carga inicial conviene combinar:

- una parte de peliculas conocidas por `popularity.desc`
- una parte con `vote_average.gte` y `vote_count.gte` para incorporar peliculas bien valoradas
- una parte guiada por generos o moods del MVP para no dejar fuera zonas utiles del catalogo

La idea no es sustituir `popularity`, sino complementarla.

### 3. `movie/{movie_id}`

- Uso en EPIC 1: completar metadata minima por pelicula
- Por que es obligatorio: `discover/movie` no devuelve todo lo que necesitamos persistir
- Documentacion oficial: https://developer.themoviedb.org/reference/movie-details

### Campos del MVP que esperamos sacar de aqui

- `id` para `tmdb_id`
- `title`
- `poster_path`
- `runtime`
- `release_date` para derivar `release_year`
- `original_language`
- `overview`
- `popularity`
- `vote_count`

### 4. `movie/{movie_id}/watch/providers`

- Uso en EPIC 1: poblar la tabla local de providers por pelicula y region
- Por que es obligatorio: necesitamos respetar despues `pais` y `plataformas` sin consultar TMDb en cada decision
- Documentacion oficial: https://developer.themoviedb.org/reference/movie-watch-providers

## Endpoints de apoyo

### `watch/providers/movie`

- Uso: validacion del catalogo global de providers y cruce por `provider_id`
- Por que es de apoyo: no es obligatorio para poblar `movie_providers` si ya usamos `movie/{movie_id}/watch/providers`

### `watch/providers/regions`

- Uso: validar regiones disponibles
- Por que es de apoyo: ayuda a comprobar paises, pero no bloquea la primera ingestión

### `configuration/countries`

- Uso: validar codigos de pais
- Por que es de apoyo: util para checks, no imprescindible para arrancar

### `configuration/languages`

- Uso: validar idiomas
- Por que es de apoyo: util para checks, no imprescindible para la carga base

### `search/movie`

- Uso: pruebas manuales o debugging
- Por que es de apoyo: no hace falta para la ingestión inicial

## Ejemplos minimos de llamada

### Generos

```bash
curl --request GET \
  --url 'https://api.themoviedb.org/3/genre/movie/list?api_key=TMDB_API_KEY&language=es-ES' \
  --header 'accept: application/json'
```

### Discover

```bash
curl --request GET \
  --url 'https://api.themoviedb.org/3/discover/movie?api_key=TMDB_API_KEY&language=es-ES&page=1&sort_by=popularity.desc&include_adult=false&include_video=false&vote_count.gte=100' \
  --header 'accept: application/json'
```

### Details

```bash
curl --request GET \
  --url 'https://api.themoviedb.org/3/movie/550?api_key=TMDB_API_KEY&language=es-ES' \
  --header 'accept: application/json'
```

### Providers por pelicula

```bash
curl --request GET \
  --url 'https://api.themoviedb.org/3/movie/550/watch/providers?api_key=TMDB_API_KEY' \
  --header 'accept: application/json'
```

## Flujo minimo recomendado

1. llamar a `genre/movie/list` para tener el diccionario de generos
2. llamar a `discover/movie` para obtener candidatas desde una estrategia mixta de carga
3. por cada `movie_id` elegida, llamar a `movie/{movie_id}` para completar metadata
4. por cada `movie_id` elegida, llamar a `movie/{movie_id}/watch/providers` para poblar providers por region
5. persistir resultados en `movies` y `movie_providers`

## Lo que no debemos usar en este epic

- endpoints de series
- endpoints de cuenta o usuario TMDb
- watchlists o favoritos de TMDb
- autenticacion de usuarios finales
- IA o logica de recomendacion apoyada en TMDb

## Cierre operativo

- `discover/movie` sirve para explorar catalogo, pero no reemplaza la normalizacion posterior
- `discover/movie` no debe convertirse en la unica fuente del catalogo inicial; conviene combinar popularidad, buen volumen de votos y variedad de generos
- `movie/{movie_id}/watch/providers` debe persistirse localmente porque el motor no debe consultar TMDb en cada decision
- los endpoints de apoyo ayudan a validar, pero no bloquean la primera version funcional del catalogo
