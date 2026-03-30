# EPIC 0 Motor Rules Contract

## Definicion

Este documento define el contrato minimo entre producto y Mood Radar. Su funcion es cerrar como deben usarse las variables del MVP en el motor, incluso antes de implementarlo.

## Principio general

Mood Radar no recibe deseos vagos. Recibe variables cerradas y las traduce a filtros, shortlist y top 3.

## Clasificacion de señales

### Filtros duros esperados

- `pais`
- `plataformas`
- `idiomas_comodos`
- `tolerancia_subtitulos`
- `no_rotundos`
- `historial` o repeticion reciente
- `titulos_descartados`

## Filtros duros o casi duros

- `preferencia_tiempo`
- `preferencia_epoca`

## Señales de ranking o filtro blando

- `seguro_o_descubrir`
- `preferencia_energia`
- `ver_luego`
- parte de la interpretacion del `mood`

## Contrato minimo de entrada del motor

### Perfil estable

- `pais`
- `plataformas`
- `idiomas_comodos`
- `tolerancia_subtitulos`
- `no_rotundos`
- `historial`
- `ver_luego`
- `titulos_descartados`

### Sesion

- `modo_entrada`
- `mood`
- `preferencia_tiempo`
- `preferencia_energia`
- `seguro_o_descubrir`
- `preferencia_epoca`

### Catalogo local

- metadata minima de peliculas
- providers por region
- idiomas
- runtime
- ano
- genero

## Contrato minimo de salida del motor

- `conjunto_candidato` o conjunto inicial util
- `lista_corta`
- `top_3_final`
- trazabilidad interna minima de por que una candidata entro o salio

## Reglas operativas cerradas

### Algo rapido

- valor visible: `Algo rapido`
- valor tecnico: `algo_rapido`
- regla cerrada: `runtime < 90`

### Tengo tiempo

- valor visible: `Tengo tiempo`
- valor tecnico: `tengo_tiempo`
- regla cerrada: `runtime >= 90`

### Facil

- valor visible: `Ponmelo facil`
- valor tecnico: `facil`
- regla cerrada: prioriza `runtime < 120` y `vote_average >= 6`
- nota: actua solo como ranking secundario

### Reto

- valor visible: `Acepto el reto`
- valor tecnico: `reto`
- regla cerrada: prioriza `runtime >= 100` y `vote_average >= 7.2`
- nota: actua solo como ranking secundario

### Actual / Moderna / Clasica

- valores visibles: `Actual`, `Moderna`, `Clasica`
- valores tecnicos: `actual`, `moderna`, `clasica`
- reglas cerradas:
  - `actual` = `release_year >= 2015`
  - `moderna` = `release_year >= 1990 AND release_year < 2015`
  - `clasica` = `release_year < 1990`

### Seguro / Descubrir

- valores visibles: `Ir a lo seguro`, `Descubrir`
- valores tecnicos: `seguro`, `descubrir`
- reglas cerradas:
  - `seguro` prioriza candidatas con `vote_count >= 10000`
  - `descubrir` prioriza candidatas con `vote_count >= 1000 AND vote_count < 10000`
- nota: `vote_count` se usa como señal principal porque es mas estable que `popularity`
- clasificacion: señal de ranking de sesion, no señal estable de perfil

## Fallback

Si tras aplicar filtros quedan menos de 3 candidatas, se aplica este orden de relajacion controlado:

1. relajar `preferencia_epoca`
2. relajar `preferencia_tiempo`
3. mantener siempre:
   - `no_rotundos`
   - incompatibilidades fuertes de idioma
   - filtro de `pais` si existe
   - filtro de `plataformas` si existe

La relajacion de `preferencia_epoca` y `preferencia_tiempo` debe ser moderada y no abrir demasiado el intervalo de cada una.
