# EPIC 0 Proposed Decisions

## Definicion

Este documento recoge propuestas concretas para cerrar los puntos que siguen abiertos en EPIC 0. No sustituye al contrato base; su funcion es acelerar la validacion interna del equipo y convertir ambiguedades en decisiones operativas.

## Objetivo

Proponer valores minimos, implementables y defendibles para que el equipo pueda validar EPIC 0 y pasar a EPIC 1, 2 y 3 sin bloquearse.

## Propuestas de cierre

### 1. Time preference

#### Propuesta

- `quick` = peliculas con `runtime <= 100`
- `have_time` = peliculas con `runtime > 100`

#### Motivo

Es una regla simple, explicable y facil de implementar con `runtime`, que TMDb aporta de forma nativa.

#### Riesgo asumido

No toda pelicula corta se siente "rapida" ni toda pelicula larga se siente "tengo tiempo", pero para MVP es suficiente.

### 2. Era preference

#### Propuesta

- `current` = `release_year >= 2020`
- `modern` = `release_year >= 2000 AND release_year <= 2019`
- `classic` = `release_year < 2000`

#### Motivo

Da tres bloques claros, faciles de explicar en demo y sin solapamientos.

### 3. Country format

#### Propuesta

- `country` se guarda en formato `ISO 3166-1 alpha-2`
- Ejemplo: `ES`, `US`, `FR`

#### Motivo

Es el formato mas util para cruzarlo con providers por region en TMDb.

### 4. Platforms

#### Propuesta

Cerrar una primera lista corta de plataformas soportadas en MVP:

- Netflix
- Max
- Prime Video
- Disney Plus
- Apple TV Plus
- Filmin

#### Regla

- en producto se muestran nombres legibles
- en backend se guarda una referencia estable a `provider_id` de TMDb

#### Motivo

Reducir alcance y evitar tener que soportar todos los providers desde el dia uno.

### 5. Comfortable languages + subtitle tolerance

#### Propuesta

Regla combinada minima:

- si el idioma original de la pelicula esta en `comfortable_languages`, la pelicula pasa
- si el idioma original no esta en `comfortable_languages`:
  - pasa solo si `subtitle_tolerance = yes`
  - se puede considerar si `subtitle_tolerance = depends`
  - no pasa si `subtitle_tolerance = no`

#### Motivo

Da una regla clara y suficientemente simple para MVP.

#### Nota

`depends` debe tratarse como filtro blando o estado revisable, no como hard yes.

### 6. Onboarding obligatorio vs opcional

#### Propuesta

Campos obligatorios si el usuario completa onboarding:

- `country`
- `platforms`

Campos opcionales:

- `comfortable_languages`
- `subtitle_tolerance`
- `safe_vs_discover`
- `hard_nos`

#### Motivo

`country` y `platforms` son los filtros mas utiles para asegurar recomendaciones realmente visibles.

### 7. Defaults de Sorprendeme

#### Propuesta

Si el usuario entra sin perfil completo:

- `entry_mode = surprise_me`
- `country = ES` solo en demo local si el equipo decide fijarlo para presentacion; en producto real no deberia asumirse por defecto
- `platforms = []`
- `comfortable_languages = ['es', 'en']`
- `subtitle_tolerance = yes`
- `safe_vs_discover = safe`
- `hard_nos = []`

#### Regla adicional

Si `platforms` esta vacio, el sistema debe decidir entre:

- no filtrar por plataforma en modo demo
- o pedir completar perfil antes de recomendar

#### Recomendacion

Para demo, mejor no bloquear y tratar `platforms = []` como "sin filtro de plataforma", dejando esto documentado como concesion temporal.

### 8. Hard nos

#### Propuesta MVP

Modelar `hard_nos` como lista de `genre_id` de TMDb.

Ejemplos:

- Terror = `27`
- Belica = `10752`
- Romance = `10749`

#### Motivo

Es la opcion mas auditable, simple y consistente con el catalogo.

#### Limitacion documentada

No cubre bien sensibilidades mas finas como gore o temas delicados si no estan expresados por genero.

### 9. Disliked titles vs history

#### Propuesta

- `history` guarda peliculas mostradas, elegidas o vistas
- `disliked_titles` guarda rechazos explicitos

#### Regla operativa

- una pelicula solo entra en `disliked_titles` si el usuario hace una accion explicita de rechazo
- ver, abrir o elegir una pelicula no implica dislike

### 10. Fallback cuando hay menos de 3 candidatas

#### Propuesta de orden de relajacion

1. relajar `era_preference`
2. relajar `time_preference`
3. relajar `energy_preference`
4. ampliar ligeramente la exploracion dentro de `safe_vs_discover`
5. mantener siempre:
   - `hard_nos`
   - `country`
   - `platforms` si existen
   - incompatibilidades fuertes de idioma

#### Motivo

Nunca deberian relajarse primero las restricciones que afectan a seguridad o disponibilidad real.

### 11. Safe vs discover

#### Propuesta operativa minima

- `safe`:
  - favorece peliculas con `popularity` alta
  - favorece peliculas con `vote_count` suficiente
  - penaliza opciones demasiado marginales dentro de la shortlist

- `discover`:
  - permite peliculas menos populares dentro de candidatas validas
  - favorece variedad frente a lo mas obvio
  - no rompe filtros duros ni convierte la recomendacion en azar

#### Regla

En MVP debe actuar como ranking, nunca como filtro duro.

### 12. Energy preference

#### Propuesta operativa minima

- `easy`:
  - favorecer peliculas populares
  - favorecer generos mas directos para el mood
  - evitar candidatas demasiado densas si hay alternativas

- `challenge`:
  - permitir peliculas menos obvias
  - permitir mayor peso de drama, documental o ciencia ficcion si encajan con el mood

#### Regla

En MVP debe actuar como ranking secundario, no como filtro duro.

### 13. Inspirational

#### Propuesta de cierre MVP

- generos base de apoyo: `18`, `12`, `36`, `10402`
- excluir `14` como genero base en primera version
- criterio editorial minimo:
  - peliculas con tono de superacion, admiracion o impulso
  - si no hay enriquecimiento extra, priorizar `vote_average >= 7.0` y `vote_count >= 500` como proxy de calidad minima

#### Motivo

No es perfecto, pero es mas defendible que dejarlo solo como mezcla abierta de generos.

### 14. Entender el mundo

#### Propuesta de cierre MVP

- nombre visible final: `Entender el mundo`
- genero principal: `99`
- generos secundarios permitidos solo si el equipo los justifica despues: `36`, `10752`, `878`
- `37` sale de la base inicial
- `10770` queda fuera del MVP

#### Motivo

Documental es el ancla mas clara. El resto mete demasiado ruido si entra sin criterio adicional.

## Recomendacion de validacion

El equipo deberia revisar estas propuestas en una sola sesion y para cada punto elegir una de estas salidas:

- `cerrado`
- `cerrado con ajuste`
- `pendiente`

