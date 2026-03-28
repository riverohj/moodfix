# EPIC 0 Session Signals Contract

## Definicion

Este documento define las señales situacionales de la sesion. Su funcion es cerrar que recoge el producto en cada sesion, como se nombra internamente y como debe usarse despues en el motor.

## Variables de sesion

### Entry mode

- Nombre visible: `Sorprendeme` / `Preguntame`
- Nombre tecnico: `entry_mode`
- Tipo: enumeracion
- Valores permitidos: `surprise_me`, `ask_me`
- Origen: input usuario
- Uso en motor: determina cuantas señales de sesion existen
- Persistencia: si, dentro de `sessions`

### Mood

- Nombre visible: moods definidos por producto
- Nombre tecnico: `mood`
- Tipo: enumeracion
- Valores permitidos:
  - `accelerate_heart`
  - `solve_a_crime`
  - `emotional_movies`
  - `have_a_good_time`
  - `inspirational`
  - `understand_the_world`
- Origen: input usuario
- Uso en motor: orientacion principal de la sesion
- Persistencia: si, dentro de `sessions`

### Time preference

- Nombre visible: `Algo rapido` / `Tengo tiempo`
- Nombre tecnico: `time_preference`
- Tipo: enumeracion
- Valores permitidos: `quick`, `have_time`
- Origen: input usuario
- Uso en motor: filtro duro o casi duro por duracion
- Persistencia: si, dentro de `sessions`
- Pendiente de cierre: equivalencia exacta en minutos

### Energy preference

- Nombre visible: `Ponmelo facil` / `Acepto el reto`
- Nombre tecnico: `energy_preference`
- Tipo: enumeracion
- Valores permitidos: `easy`, `challenge`
- Origen: input usuario
- Uso en motor: filtro blando o ranking, no necesariamente filtro duro
- Persistencia: si, dentro de `sessions`
- Pendiente de cierre: como se deriva operativamente usando datos reales

### Era preference

- Nombre visible: `Actual` / `Moderna` / `Clasica`
- Nombre tecnico: `era_preference`
- Tipo: enumeracion
- Valores permitidos: `current`, `modern`, `classic`
- Origen: input usuario
- Uso en motor: filtro duro o casi duro por rango de anos
- Persistencia: si, dentro de `sessions`
- Pendiente de cierre: equivalencia exacta de anos

## Contrato de flujo

### Sorprendeme

- Recoge solo `entry_mode`
- No hace preguntas adicionales
- Debe apoyarse en perfil estable
- Si falta perfil estable, requiere defaults definidos por el equipo

### Preguntame

- Recoge `mood`
- Recoge `time_preference`
- Recoge `energy_preference`
- Recoge `era_preference`
- Debe generar un payload de sesion consistente y reutilizable

## Puntos pendientes de cierre

- valores por defecto cuando falte perfil
- definicion exacta de `quick`
- definicion exacta de `easy`
- definicion exacta de `challenge`
- definicion exacta de `current`, `modern`, `classic`

