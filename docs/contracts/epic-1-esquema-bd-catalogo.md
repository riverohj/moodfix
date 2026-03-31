# EPIC 1 Esquema BD Catalogo

## Definicion

Este documento deja cerrado el esquema minimo de base de datos para el catalogo local de EPIC 1. Su funcion es definir como se almacenan peliculas y providers por region para que Mood Radar pueda trabajar despues sobre datos locales y no sobre llamadas en tiempo real a TMDb.

## Objetivo

Guardar localmente la metadata minima de peliculas y su disponibilidad por proveedor y region.

## Tablas del MVP

### Tabla `movies`

Funcion:
Guardar la metadata minima de cada pelicula que luego usara el motor.

Campos:

- `id`
  - tipo: entero
  - uso: clave primaria local

- `tmdb_id`
  - tipo: entero
  - uso: identificador unico de TMDb
  - regla: unico

- `title`
  - tipo: texto
  - uso: titulo de la pelicula

- `poster_path`
  - tipo: texto
  - uso: ruta de poster devuelta por TMDb

- `runtime`
  - tipo: entero
  - uso: duracion en minutos

- `release_year`
  - tipo: entero
  - uso: ano derivado de `release_date`

- `original_language`
  - tipo: texto
  - uso: idioma original de la pelicula

- `overview`
  - tipo: texto
  - uso: descripcion corta

- `popularity`
  - tipo: real
  - uso: senal auxiliar

- `vote_count`
  - tipo: entero
  - uso: senal principal para `seguro_o_descubrir`

- `created_at`
  - tipo: texto timestamp
  - uso: trazabilidad basica

- `updated_at`
  - tipo: texto timestamp
  - uso: trazabilidad basica

### Tabla `movie_providers`

Funcion:
Guardar disponibilidad por pelicula, region y tipo de proveedor.

Campos:

- `id`
  - tipo: entero
  - uso: clave primaria local

- `movie_id`
  - tipo: entero
  - uso: clave foranea a `movies.id`

- `country_code`
  - tipo: texto
  - uso: codigo ISO 3166-1 alpha-2, por ejemplo `ES`

- `provider_id`
  - tipo: entero
  - uso: identificador del proveedor en TMDb

- `provider_name`
  - tipo: texto
  - uso: nombre legible del proveedor

- `provider_type`
  - tipo: texto
  - uso: tipo de disponibilidad, por ejemplo `flatrate`, `rent`, `buy`

- `created_at`
  - tipo: texto timestamp
  - uso: trazabilidad basica

## Reglas de modelado cerradas

- `movies.tmdb_id` debe ser unico
- `movie_providers` debe evitar duplicados por combinacion de:
  - `movie_id`
  - `country_code`
  - `provider_id`
  - `provider_type`
- `plataformas` en el sistema se cruzaran contra `provider_id`
- si una pelicula no tiene providers para una region, no debe inventarse disponibilidad

## Lo que no entra todavia

- tabla separada de generos
- tabla separada de idiomas
- tabla global de providers como requisito para arrancar
- normalizacion avanzada del catalogo

## Resumen sencillo

En esta fase solo necesitamos dos tablas: una para peliculas y otra para saber en que plataformas y regiones esta disponible cada pelicula. Con eso ya podemos construir luego filtros por tiempo, epoca, idioma, pais y plataformas sin depender de TMDb en cada recomendacion.

