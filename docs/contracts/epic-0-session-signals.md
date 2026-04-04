# EPIC 0 Session Signals Contract

## Definicion

Este documento define las señales situacionales de la sesion. Su funcion es cerrar que recoge el producto en cada sesion, como se nombra internamente y como debe usarse despues en el motor.

## Variables de sesion

### Modo de entrada

- Nombre visible: `Sorprendeme` / `Preguntame`
- Nombre tecnico: `modo_entrada`
- Tipo: enumeracion
- Valores permitidos: `sorprendeme`, `preguntame`
- Origen: input usuario
- Uso en motor: determina cuantas señales de sesion existen
- Persistencia: si, dentro de `sessions`

### Mood

- Nombre visible: moods definidos por producto
- Nombre tecnico: `mood`
- Tipo: enumeracion
- Valores permitidos:
  - `acelerar_corazon`
  - `resuelve_un_crimen`
  - `peliculas_emocionales`
  - `pasar_un_buen_rato`
  - `historias_que_inspiran`
  - `descubre_el_mundo`
- Origen: input usuario
- Uso en motor: orientacion principal de la sesion
- Persistencia: si, dentro de `sessions`

### Preferencia de tiempo

- Nombre visible: `Algo rapido` / `Tengo tiempo`
- Nombre tecnico: `preferencia_tiempo`
- Tipo: enumeracion
- Valores permitidos: `algo_rapido`, `tengo_tiempo`
- Origen: input usuario
- Uso en motor: filtro duro o casi duro por duracion
- Persistencia: si, dentro de `sessions`
- Regla cerrada:
  - `algo_rapido` = `runtime < 90`
  - `tengo_tiempo` = `runtime >= 90`

### Preferencia de energia

- Nombre visible: `Ponmelo facil` / `Acepto el reto`
- Nombre tecnico: `preferencia_energia`
- Tipo: enumeracion
- Valores permitidos: `facil`, `reto`
- Origen: input usuario
- Uso en motor: ranking secundario, no filtro duro
- Persistencia: si, dentro de `sessions`
- Regla cerrada:
  - `facil` prioriza `runtime < 120` y `vote_average >= 6`
  - `reto` prioriza `runtime >= 100` y `vote_average >= 7.2`
- Nota: es una heuristica debil y no debe venderse como medida exacta de complejidad cognitiva

### Seguro o descubrir

- Nombre visible: `Ir a lo seguro` / `Descubrir`
- Nombre tecnico: `seguro_o_descubrir`
- Tipo: enumeracion
- Valores permitidos: `seguro`, `descubrir`
- Origen: input usuario
- Uso en motor: ranking, no filtro duro
- Persistencia: si, dentro de `sessions`
- Regla cerrada:
  - `seguro` prioriza candidatas con `vote_count >= 10000`
  - `descubrir` prioriza candidatas con `vote_count >= 1000 AND vote_count < 10000`
- Nota: `vote_count` se usa como señal principal porque es mas estable que `popularity`

### Preferencia de epoca

- Nombre visible: `Actual` / `Moderna` / `Clasica`
- Nombre tecnico: `preferencia_epoca`
- Tipo: enumeracion
- Valores permitidos: `actual`, `moderna`, `clasica`
- Origen: input usuario
- Uso en motor: filtro duro o casi duro por rango de anos
- Persistencia: si, dentro de `sessions`
- Regla cerrada:
  - `actual` = `release_year >= 2015`
  - `moderna` = `release_year >= 1990 AND release_year < 2015`
  - `clasica` = `release_year < 1990`

## Contrato de flujo

### Sorprendeme

- Recoge solo `modo_entrada`
- No hace preguntas adicionales
- Debe apoyarse en perfil estable
- Si falta perfil estable, usa estos defaults:
  - `pais = ES` para demo
  - `plataformas = []`
  - `idiomas_comodos = ['es', 'en']`
  - `tolerancia_subtitulos = si`
  - `no_rotundos = []`
  - no filtra por plataforma si `plataformas` esta vacio

### Preguntame

- Recoge `mood`
- Recoge `preferencia_tiempo`
- Recoge `preferencia_energia`
- Recoge `seguro_o_descubrir`
- Recoge `preferencia_epoca`
- Debe generar un payload de sesion consistente y reutilizable

## Handoff guest -> autenticado

- si un usuario responde preguntas de sesion sin login y se autentica justo antes del resultado, esas respuestas no deben perderse
- este handoff pertenece a la capa de `sessions`, no al perfil estable ni a `user_profiles`
- para MVP puede resolverse guardando temporalmente el payload en frontend hasta login y reenviandolo despues autenticado
- si mas adelante se quiere robustecer, puede resolverse con una `guest session` persistida en backend y vinculada al usuario tras autenticacion
- esta decision operativa debe cerrarse en implementacion de EPIC 3 y no en EPIC 2

## Estado

Las senales de sesion quedan cerradas para MVP. La validacion con ejemplos reales del catalogo se hara ya en fase de implementacion y prueba, no como parte del contrato.
