# EPIC 1 Ingestion Inicial

## Definicion

Este documento deja cerrado el contrato de ingestión inicial del catalogo local para EPIC 1. Su funcion es definir que datos se traen desde TMDb, en que orden, con que criterios minimos y como deben persistirse para obtener un catalogo de demo util sin sobrecomplicar la carga inicial.

## Objetivo

Construir una primera carga local de peliculas suficiente para demo y pruebas del motor, sin depender de TMDb en cada recomendacion.

## Flujo minimo de ingestión

1. Obtener el diccionario oficial de generos con `genre/movie/list`
2. Obtener peliculas candidatas con `discover/movie`
3. Para cada `movie_id` seleccionada:
   - llamar a `movie/{movie_id}`
   - llamar a `movie/{movie_id}/watch/providers`
4. Persistir metadata en `movies`
5. Persistir disponibilidad en `movie_providers`

## Endpoints obligatorios para esta ingestión

- `genre/movie/list`
- `discover/movie`
- `movie/{movie_id}`
- `movie/{movie_id}/watch/providers`

## Endpoints de apoyo no bloqueantes

- `watch/providers/movie`
- `watch/providers/regions`
- `configuration/countries`
- `configuration/languages`
- `search/movie`

## Criterios minimos del catalogo inicial

- tamano objetivo: `200-300` peliculas
- solo peliculas, no series
- `include_adult=false`
- `include_video=false`
- no depender solo de una fuente demasiado mainstream

## Estrategia recomendada para reducir sesgo del catalogo

La carga inicial no debe salir solo de `discover/movie` ordenado por popularidad. La recomendacion para EPIC 1 es combinar:

- una parte de candidatas por `sort_by=popularity.desc`
- una parte de candidatas con `vote_average.gte` y `vote_count.gte` para incluir peliculas bien valoradas
- una parte guiada por generos o moods del MVP para que el catalogo no se quede solo en lo mas conocido

Esto no sustituye `popularity`: la complementa.

## Campos minimos que deben persistirse

### En `movies`

- `tmdb_id`
- `title`
- `poster_path`
- `runtime`
- `release_year`
- `original_language`
- `overview`
- `popularity`
- `vote_count`

### En `movie_providers`

- `movie_id`
- `country_code`
- `provider_id`
- `provider_name`
- `provider_type`

## Reglas de persistencia

- `tmdb_id` debe ser unico en `movies`
- no deben insertarse duplicados en `movie_providers`
- si el script informa de filas insertadas en `movie_providers`, ese contador debe reflejar solo inserciones reales y no intentos ignorados por duplicado
- si una pelicula no tiene providers para una region, no debe inventarse disponibilidad
- si `plataformas = []` en el perfil del usuario, el motor no filtrara por plataforma aunque la tabla de providers exista

## Estrategia de recarga

- la recarga inicial sera manual
- no hace falta programar refresh automatico en EPIC 1
- el objetivo es poder reconstruir localmente el catalogo, no sincronizarlo continuamente

## Resumen sencillo

En esta fase no estamos construyendo todavia el motor. Estamos trayendo un primer conjunto de peliculas reales desde TMDb, completando sus datos clave y guardando en que plataformas y regiones estan disponibles. Con eso, el proyecto ya puede trabajar sobre un catalogo local propio.

## Definicion de hecho

La ingestión inicial se considera lograda cuando:

- existe una carga local de unas `200-300` peliculas
- `movies` contiene la metadata minima acordada
- `movie_providers` contiene disponibilidad por region
- el equipo puede consultar el catalogo local sin llamar a TMDb para cada recomendacion
