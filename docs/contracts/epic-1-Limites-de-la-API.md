# EPIC 1 Endpoints y Limites de la API

## Definicion

Este documento deja cerrado que endpoints de TMDb necesitamos en EPIC 1 para construir el catalogo local del MVP. Su funcion es limitar la integracion a las llamadas estrictamente necesarias para poblar peliculas, generos, regiones, idiomas y providers, sin abrir alcance a logica de recomendacion ni a funcionalidades fuera del MVP.

## Resumen sencillo

En este epic usamos TMDb solo para traer y validar datos del catalogo. No usamos TMDb para recomendar. Lo que queremos construir es una base local minima con peliculas, metadata y providers por region para que Mood Radar pueda trabajar despues sin llamar a TMDb en cada decision.

## Regla general

- TMDb se usa como fuente de datos
- MoodFix no delega en TMDb la logica de recomendacion
- en EPIC 1 solo necesitamos endpoints para ingestión, normalizacion y validacion del catalogo local
- no entran endpoints de series, cuentas de usuario, watchlists, favoritos ni IA

## Base de autenticacion

- Base URL API v3: `https://api.themoviedb.org/3`
- Metodo recomendado: header `Authorization: Bearer TMDB_READ_ACCESS_TOKEN`
- Metodo alternativo: query param `api_key=TMDB_API_KEY`

### Ejemplo base con Bearer token

```bash
curl --request GET \
  --url 'https://api.themoviedb.org/3/genre/movie/list?language=es-ES' \
  --header 'Authorization: Bearer TMDB_READ_ACCESS_TOKEN' \
  --header 'accept: application/json'
```

## Endpoints que si necesitamos

### 1. Listado oficial de generos de peliculas

- Uso en EPIC 1: disponer del diccionario oficial de generos TMDb para normalizar genero y validar el mapeo cerrado en EPIC 0
- Metodo: `GET`
- URL endpoint: `https://api.themoviedb.org/3/genre/movie/list`
- Documentacion oficial: https://developer.themoviedb.org/reference/genre-movie-list

### Query params recomendados

- `language=es-ES` o `en-US`

### Ejemplo de llamada

```bash
curl --request GET \
  --url 'https://api.themoviedb.org/3/genre/movie/list?language=es-ES' \
  --header 'Authorization: Bearer TMDB_READ_ACCESS_TOKEN' \
  --header 'accept: application/json'
```

### Ejemplo de implementacion en backend

```python
import os
import requests

BASE_URL = "https://api.themoviedb.org/3"

def fetch_movie_genres():
    response = requests.get(
        f"{BASE_URL}/genre/movie/list",
        params={"language": "es-ES"},
        headers={
            "Authorization": f"Bearer {os.environ['TMDB_READ_ACCESS_TOKEN']}",
            "accept": "application/json",
        },
        timeout=30,
    )
    response.raise_for_status()
    return response.json()["genres"]
```

### 2. Discover movies

- Uso en EPIC 1: obtener peliculas candidatas para poblar el catalogo inicial de demo
- Metodo: `GET`
- URL endpoint: `https://api.themoviedb.org/3/discover/movie`
- Documentacion oficial: https://developer.themoviedb.org/reference/discover-movie

### Query params utiles para el MVP

- `language=es-ES`
- `page=1`
- `sort_by=popularity.desc`
- `include_adult=false`
- `include_video=false`
- `vote_count.gte=...`
- `with_genres=...`
- `with_original_language=...`
- `primary_release_date.gte=...`
- `primary_release_date.lte=...`
- `watch_region=ES` si se quiere acotar por region en exploracion
- `with_watch_providers=...` si se quiere acotar por provider concreto

### Ejemplo de llamada

```bash
curl --request GET \
  --url 'https://api.themoviedb.org/3/discover/movie?language=es-ES&page=1&sort_by=popularity.desc&include_adult=false&include_video=false&vote_count.gte=100' \
  --header 'Authorization: Bearer TMDB_READ_ACCESS_TOKEN' \
  --header 'accept: application/json'
```

### Ejemplo de implementacion en backend

```python
def discover_movies(page=1, genre_ids=None):
    params = {
        "language": "es-ES",
        "page": page,
        "sort_by": "popularity.desc",
        "include_adult": "false",
        "include_video": "false",
        "vote_count.gte": 100,
    }

    if genre_ids:
        params["with_genres"] = ",".join(str(gid) for gid in genre_ids)

    response = requests.get(
        f"{BASE_URL}/discover/movie",
        params=params,
        headers={
            "Authorization": f"Bearer {os.environ['TMDB_READ_ACCESS_TOKEN']}",
            "accept": "application/json",
        },
        timeout=30,
    )
    response.raise_for_status()
    return response.json()["results"]
```

### 3. Movie details

- Uso en EPIC 1: completar metadata minima por pelicula para el catalogo local
- Metodo: `GET`
- URL endpoint: `https://api.themoviedb.org/3/movie/{movie_id}`
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

### Ejemplo de llamada

```bash
curl --request GET \
  --url 'https://api.themoviedb.org/3/movie/550?language=es-ES' \
  --header 'Authorization: Bearer TMDB_READ_ACCESS_TOKEN' \
  --header 'accept: application/json'
```

### Ejemplo de implementacion en backend

```python
def fetch_movie_details(movie_id):
    response = requests.get(
        f"{BASE_URL}/movie/{movie_id}",
        params={"language": "es-ES"},
        headers={
            "Authorization": f"Bearer {os.environ['TMDB_READ_ACCESS_TOKEN']}",
            "accept": "application/json",
        },
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()

    return {
        "tmdb_id": data["id"],
        "title": data["title"],
        "poster_path": data["poster_path"],
        "runtime": data["runtime"],
        "release_year": int(data["release_date"][:4]) if data.get("release_date") else None,
        "original_language": data["original_language"],
        "overview": data["overview"],
        "popularity": data["popularity"],
        "vote_count": data["vote_count"],
    }
```

### 4. Watch providers por pelicula

- Uso en EPIC 1: poblar la tabla local de providers por pelicula y region
- Metodo: `GET`
- URL endpoint: `https://api.themoviedb.org/3/movie/{movie_id}/watch/providers`
- Documentacion oficial: https://developer.themoviedb.org/reference/movie-watch-providers

### Nota importante

Los providers vienen agrupados por region dentro de `results`. Este endpoint es clave para poder respetar despues `pais` y `plataformas` sin consultar TMDb en cada decision del motor.

### Ejemplo de llamada

```bash
curl --request GET \
  --url 'https://api.themoviedb.org/3/movie/550/watch/providers' \
  --header 'Authorization: Bearer TMDB_READ_ACCESS_TOKEN' \
  --header 'accept: application/json'
```

### Ejemplo de implementacion en backend

```python
def fetch_movie_watch_providers(movie_id):
    response = requests.get(
        f"{BASE_URL}/movie/{movie_id}/watch/providers",
        headers={
            "Authorization": f"Bearer {os.environ['TMDB_READ_ACCESS_TOKEN']}",
            "accept": "application/json",
        },
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()

    rows = []
    for region_code, payload in data.get("results", {}).items():
        for provider_type in ("flatrate", "rent", "buy"):
            for provider in payload.get(provider_type, []):
                rows.append(
                    {
                        "tmdb_id": movie_id,
                        "region": region_code,
                        "provider_id": provider["provider_id"],
                        "provider_name": provider["provider_name"],
                        "provider_type": provider_type,
                    }
                )
    return rows
```

### 5. Listado global de movie providers

- Uso en EPIC 1: disponer del catalogo oficial de providers de TMDb para validacion, nombres y cruce por `provider_id`
- Metodo: `GET`
- URL endpoint: `https://api.themoviedb.org/3/watch/providers/movie`
- Documentacion oficial: https://developer.themoviedb.org/reference/watch-providers-movie-list

### Ejemplo de llamada

```bash
curl --request GET \
  --url 'https://api.themoviedb.org/3/watch/providers/movie?language=es-ES&watch_region=ES' \
  --header 'Authorization: Bearer TMDB_READ_ACCESS_TOKEN' \
  --header 'accept: application/json'
```

### Ejemplo de implementacion en backend

```python
def fetch_movie_providers_catalog(region="ES"):
    response = requests.get(
        f"{BASE_URL}/watch/providers/movie",
        params={"language": "es-ES", "watch_region": region},
        headers={
            "Authorization": f"Bearer {os.environ['TMDB_READ_ACCESS_TOKEN']}",
            "accept": "application/json",
        },
        timeout=30,
    )
    response.raise_for_status()
    return response.json()["results"]
```

### Estado en EPIC 1

Util para validacion y apoyo. No es obligatorio para poblar la tabla `movie_providers` si ya se usa `movie/{movie_id}/watch/providers` como fuente principal.

### 6. Regiones disponibles para watch providers

- Uso en EPIC 1: validar que region soporta datos de providers antes de poblar o filtrar
- Metodo: `GET`
- URL endpoint: `https://api.themoviedb.org/3/watch/providers/regions`
- Documentacion oficial: https://developer.themoviedb.org/reference/watch-providers-available-regions

### Ejemplo de llamada

```bash
curl --request GET \
  --url 'https://api.themoviedb.org/3/watch/providers/regions?language=es-ES' \
  --header 'Authorization: Bearer TMDB_READ_ACCESS_TOKEN' \
  --header 'accept: application/json'
```

### Ejemplo de implementacion en backend

```python
def fetch_provider_regions():
    response = requests.get(
        f"{BASE_URL}/watch/providers/regions",
        params={"language": "es-ES"},
        headers={
            "Authorization": f"Bearer {os.environ['TMDB_READ_ACCESS_TOKEN']}",
            "accept": "application/json",
        },
        timeout=30,
    )
    response.raise_for_status()
    return response.json()["results"]
```

### Estado en EPIC 1

Util para validacion y apoyo. No es obligatorio para la carga minima del catalogo si el equipo ya trabaja con una region objetivo conocida, como `ES`.

### 7. Configuration countries

- Uso en EPIC 1: validar codigos de pais usados por el sistema y alinear `pais` con ISO 3166-1
- Metodo: `GET`
- URL endpoint: `https://api.themoviedb.org/3/configuration/countries`
- Documentacion oficial: https://developer.themoviedb.org/reference/configuration-countries

### Ejemplo de llamada

```bash
curl --request GET \
  --url 'https://api.themoviedb.org/3/configuration/countries' \
  --header 'Authorization: Bearer TMDB_READ_ACCESS_TOKEN' \
  --header 'accept: application/json'
```

### Ejemplo de implementacion en backend

```python
def fetch_countries():
    response = requests.get(
        f"{BASE_URL}/configuration/countries",
        headers={
            "Authorization": f"Bearer {os.environ['TMDB_READ_ACCESS_TOKEN']}",
            "accept": "application/json",
        },
        timeout=30,
    )
    response.raise_for_status()
    return response.json()
```

### Estado en EPIC 1

Util para validacion y consistencia de codigos de pais. No es obligatorio para arrancar la primera ingestión si `pais` ya se controla con `ISO 3166-1 alpha-2`.

### 8. Configuration languages

- Uso en EPIC 1: disponer del catalogo oficial de idiomas y validar `original_language` e `idiomas_comodos`
- Metodo: `GET`
- URL endpoint: `https://api.themoviedb.org/3/configuration/languages`
- Documentacion oficial: https://developer.themoviedb.org/reference/configuration-languages

### Ejemplo de llamada

```bash
curl --request GET \
  --url 'https://api.themoviedb.org/3/configuration/languages' \
  --header 'Authorization: Bearer TMDB_READ_ACCESS_TOKEN' \
  --header 'accept: application/json'
```

### Ejemplo de implementacion en backend

```python
def fetch_languages():
    response = requests.get(
        f"{BASE_URL}/configuration/languages",
        headers={
            "Authorization": f"Bearer {os.environ['TMDB_READ_ACCESS_TOKEN']}",
            "accept": "application/json",
        },
        timeout=30,
    )
    response.raise_for_status()
    return response.json()
```

### Estado en EPIC 1

Util para validacion y consistencia de idiomas. No es obligatorio para arrancar la primera ingestión si el equipo solo necesita persistir `original_language`.

## Endpoint opcional pero util para validacion manual

### Search movie

- Uso en EPIC 1: comprobar manualmente peliculas concretas cuando el equipo quiera validar un titulo o buscar su `movie_id`
- Metodo: `GET`
- URL endpoint: `https://api.themoviedb.org/3/search/movie`
- Documentacion oficial: https://developer.themoviedb.org/reference/search-movie
- Estado en EPIC 1: util para debugging y curacion manual, no obligatorio para la carga base

### Ejemplo de llamada

```bash
curl --request GET \
  --url 'https://api.themoviedb.org/3/search/movie?query=Fight%20Club&language=es-ES' \
  --header 'Authorization: Bearer TMDB_READ_ACCESS_TOKEN' \
  --header 'accept: application/json'
```

## Flujo minimo recomendado para el MVP

1. llamar a `genre/movie/list` para tener diccionario oficial de generos
2. llamar a `discover/movie` para obtener candidatas
3. por cada `movie_id` elegida, llamar a `movie/{movie_id}` para completar metadata minima
4. por cada `movie_id` elegida, llamar a `movie/{movie_id}/watch/providers` para poblar providers por region
5. persistir todo en catalogo local para que Mood Radar no dependa de TMDb en cada recomendacion

## Endpoints de apoyo o validacion

- `watch/providers/movie`
- `watch/providers/regions`
- `configuration/countries`
- `configuration/languages`
- `search/movie`

Estos endpoints son utiles para validar, depurar o reforzar consistencia, pero no deben bloquear la primera version funcional de la ingestión.

## Lo que no debemos usar en este epic

- endpoints de TV o series
- endpoints de cuenta TMDb, watchlist o favoritos
- endpoints pensados para interaccion de usuario autenticado de TMDb
- endpoints que resuelvan producto fuera del catalogo local
- cualquier llamada que intente sustituir la logica de Mood Radar

## Limites operativos y cautelas

- TMDb mantiene limites altos pero documenta que puede devolver `429` si se abusa del servicio: https://developer.themoviedb.org/docs/rate-limiting
- conviene hacer carga por lotes controlados y guardar localmente todo lo necesario
- `discover/movie` sirve para explorar catalogo, pero no reemplaza la normalizacion posterior
- `discover/movie` no debe convertirse en la unica fuente del catalogo inicial; conviene combinar estrategias de carga para no sesgar todo a peliculas demasiado mainstream
- `movie/{movie_id}/watch/providers` debe persistirse localmente porque el motor no debe consultar TMDb en cada decision
- los providers pueden variar por region, asi que no se debe guardar una sola disponibilidad global por pelicula

## Estado

Queda cerrado para EPIC 1 que la integracion con TMDb se limitara a estos endpoints para construir y validar el catalogo local del MVP, sin ampliar alcance a motor, series, cuentas de usuario ni funcionalidades fuera de demo.
