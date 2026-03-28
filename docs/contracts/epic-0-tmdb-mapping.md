# EPIC 0 TMDb Mapping Contract

## Definicion

Este documento define el mapeo entre las necesidades del MVP de MoodFix y los datos reales disponibles en TMDb. Su funcion es evitar que el equipo trate como dato nativo de TMDb algo que en realidad es una derivacion propia de MoodFix.

## Regla general

- TMDb aporta datos.
- MoodFix interpreta esos datos.
- Si TMDb no ofrece una señal de forma directa, debe marcarse como `derivacion propia`.

## Fuentes oficiales usadas

- Guia general: `https://developer.themoviedb.org/docs/getting-started`
- Referencia API v3: `https://developer.themoviedb.org/reference/getting-started`

## Mapeo por necesidad del MVP

### Catalogo base de peliculas

- Necesidad de MoodFix: disponer de peliculas candidatas para construir shortlist y top 3
- Disponibilidad en TMDb: si
- Endpoints de referencia:
  - `Discover > Movie`
  - `Movies > Details`
  - `Movie Lists > Popular / Top Rated / Upcoming / Now Playing`
- Dato TMDb: peliculas y metadata asociada
- Decision: dato nativo TMDb
- Riesgo: bajo

### Generos de pelicula

- Necesidad de MoodFix: usar base de generos para aproximar moods
- Disponibilidad en TMDb: si
- Endpoints de referencia:
  - `Genres > Movie List`
  - `Discover > Movie`
- Dato TMDb: `genre_ids` y lista oficial de generos
- Decision: dato nativo TMDb
- Riesgo: bajo
- Nota: el mood no sale de TMDb; solo los generos

### Runtime o duracion

- Necesidad de MoodFix: traducir `Algo rapido` o `Tengo tiempo`
- Disponibilidad en TMDb: si
- Endpoints de referencia:
  - `Movies > Details`
- Dato TMDb: `runtime`
- Decision: dato nativo TMDb, umbral derivado por MoodFix
- Riesgo: bajo

### Ano o epoca

- Necesidad de MoodFix: traducir `Actual`, `Moderna`, `Clasica`
- Disponibilidad en TMDb: si
- Endpoints de referencia:
  - `Movies > Details`
  - `Discover > Movie`
- Dato TMDb: fecha de estreno o ano
- Decision: dato nativo TMDb, rangos de epoca derivados por MoodFix
- Riesgo: bajo

### Idioma original

- Necesidad de MoodFix: cruzar comodidad linguistica del usuario
- Disponibilidad en TMDb: si
- Endpoints de referencia:
  - `Movies > Details`
  - `Configuration > Languages`
- Dato TMDb: idioma original y lista de idiomas
- Decision: dato nativo TMDb
- Riesgo: bajo

### Providers por pelicula

- Necesidad de MoodFix: saber si la pelicula esta disponible en plataformas validas
- Disponibilidad en TMDb: si
- Endpoints de referencia:
  - `Movies > Watch Providers`
  - `Watch Providers > Movie Providers`
  - `Watch Providers > Available Regions`
- Dato TMDb: disponibilidad y proveedores por region
- Decision: dato nativo TMDb
- Riesgo: medio
- Nota: conviene validar pronto la consistencia real de providers por region para la demo

### Pais o region

- Necesidad de MoodFix: filtrar por mercado real del usuario
- Disponibilidad en TMDb: si
- Endpoints de referencia:
  - `Configuration > Countries`
  - `Movies > Watch Providers`
- Dato TMDb: paises soportados y providers por region
- Decision: dato nativo TMDb para referencia, seleccion del pais desde input usuario
- Riesgo: bajo

### Mood

- Necesidad de MoodFix: captar la intencion principal de la sesion
- Disponibilidad en TMDb: no directamente
- Endpoints de referencia:
  - `Genres > Movie List`
  - `Discover > Movie`
- Dato TMDb: generos que pueden apoyar la definicion
- Decision: derivacion propia de MoodFix
- Riesgo: medio
- Nota: TMDb aporta generos, no moods

### Energy preference

- Necesidad de MoodFix: traducir `Ponmelo facil` y `Acepto el reto`
- Disponibilidad en TMDb: no directa
- Endpoints de referencia: ninguno suficiente por si solo
- Dato TMDb: no hay un campo nativo que represente esfuerzo cognitivo
- Decision: derivacion propia de MoodFix
- Riesgo: alto

### Safe vs discover

- Necesidad de MoodFix: modular si el usuario quiere algo mas seguro o mas exploratorio
- Disponibilidad en TMDb: no directa
- Endpoints de referencia:
  - `Movie Lists > Popular`
  - `Movies > Details`
  - `Discover > Movie`
- Dato TMDb: popularidad u otras señales proximas
- Decision: derivacion propia de MoodFix apoyada en algunos datos TMDb
- Riesgo: medio

### Hard nos

- Necesidad de MoodFix: evitar lineas rojas del usuario
- Disponibilidad en TMDb: parcialmente
- Endpoints de referencia:
  - `Genres > Movie List`
  - `Movies > Details`
  - `Keywords`
- Dato TMDb: algunos generos o keywords pueden ayudar
- Decision: derivacion propia de MoodFix basada en preferencias del usuario
- Riesgo: medio
- Nota: no todo `hard no` tendra correspondencia simple con un campo TMDb

### Watch later, disliked, history

- Necesidad de MoodFix: recordar afinidades, rechazos y repeticiones
- Disponibilidad en TMDb: no como fuente de verdad del producto
- Endpoints de referencia:
  - existen endpoints de cuenta y watchlist en TMDb, pero no deben ser la base del MVP
- Dato TMDb: no necesario para la persistencia principal del MVP
- Decision: store propio de MoodFix
- Riesgo: bajo

## Resumen ejecutivo

### Datos que TMDb si aporta razonablemente

- peliculas y metadata base
- generos
- runtime
- fecha de estreno o ano
- idioma original
- paises y lenguajes de referencia
- providers por pelicula y region

### Datos que MoodFix debe derivar por su cuenta

- moods
- energia de la sesion
- seguro versus descubrir
- semantica de epoca
- semantica de tiempo
- interpretacion de lineas rojas complejas

## Decision de producto derivada

EPIC 0 no debe asumir que TMDb resuelve la semantica del producto. TMDb aporta base de datos y MoodFix define la logica que convierte esa base en recomendacion.

