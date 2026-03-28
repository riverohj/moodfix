# EPIC 0 Motor Rules Contract

## Definicion

Este documento define el contrato minimo entre producto y Mood Radar. Su funcion es cerrar como deben usarse las variables del MVP en el motor, incluso antes de implementarlo.

## Principio general

Mood Radar no recibe deseos vagos. Recibe variables cerradas y las traduce a filtros, shortlist y top 3.

## Clasificacion de señales

### Filtros duros esperados

- `country`
- `platforms`
- `comfortable_languages`
- `subtitle_tolerance`
- `hard_nos`
- `history` o repeticion reciente
- `disliked_titles`

## Filtros duros o casi duros pendientes de cierre exacto

- `time_preference`
- `era_preference`

## Señales de ranking o filtro blando

- `safe_vs_discover`
- `energy_preference`
- `watch_later`
- parte de la interpretacion del `mood`

## Contrato minimo de entrada del motor

### Perfil estable

- `country`
- `platforms`
- `comfortable_languages`
- `subtitle_tolerance`
- `safe_vs_discover`
- `hard_nos`
- `history`
- `watch_later`
- `disliked_titles`

### Sesion

- `entry_mode`
- `mood`
- `time_preference`
- `energy_preference`
- `era_preference`

### Catalogo local

- metadata minima de peliculas
- providers por region
- idiomas
- runtime
- ano
- genero

## Contrato minimo de salida del motor

- `candidate_pool` o conjunto inicial util
- `shortlist`
- `top_3`
- trazabilidad interna minima de por que una candidata entro o salio

## Reglas pendientes de cierre exacto

### Quick

- valor visible: `Algo rapido`
- valor tecnico: `quick`
- pendiente: rango exacto de minutos

### Have time

- valor visible: `Tengo tiempo`
- valor tecnico: `have_time`
- pendiente: si elimina tope o si usa un umbral alto

### Easy

- valor visible: `Ponmelo facil`
- valor tecnico: `easy`
- pendiente: heuristica concreta con datos reales

### Challenge

- valor visible: `Acepto el reto`
- valor tecnico: `challenge`
- pendiente: heuristica concreta con datos reales

### Current / Modern / Classic

- valores visibles: `Actual`, `Moderna`, `Clasica`
- valores tecnicos: `current`, `modern`, `classic`
- pendiente: rangos exactos de anos

### Safe / Discover

- valores visibles: `Ir a lo seguro`, `Descubrir`
- valores tecnicos: `safe`, `discover`
- pendiente: traduccion concreta a ranking y exploracion

## Fallback pendiente de cierre

Si tras aplicar filtros quedan menos de 3 candidatas, el equipo debe definir un orden de relajacion controlado. Este orden no esta cerrado todavia y debe quedar documentado antes de implementar el motor.

