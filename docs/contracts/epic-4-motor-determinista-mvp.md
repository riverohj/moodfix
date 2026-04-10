# EPIC 4 Motor Determinista MVP

## Definicion

Este documento define el contrato operativo del EPIC 4. Su funcion es cerrar que entra en el motor determinista del MVP, que datos consume, que datos deja fuera por ahora y como deben nombrarse los bloques principales para que producto, frontend, backend y motor trabajen sobre el mismo mapa.

## Objetivo

Construir un motor determinista capaz de filtrar, ordenar y devolver una recomendacion util sin depender todavia de IA ni de aprendizaje avanzado.

## Dolor que ataca

- el usuario recibe recomendaciones que no puede ver o no quiere ver
- el sistema puede repetir peliculas ya vistas, descartadas o guardadas para ver luego
- el equipo puede mezclar gustos estables, intencion puntual y memoria de peliculas en una sola bolsa
- sin un contrato claro, frontend, backend y motor pueden implementar productos distintos

## Principio general

El motor MVP debe resolver primero lo basico y hacerlo bien:

1. entender que peliculas son viables
2. descartar las que nunca deberian salir
3. ordenar las candidatas segun perfil estable e intencion de sesion
4. devolver una seleccion final coherente

La IA, las explicaciones visibles y el aprendizaje mas fino quedan para despues.

## Bloques del contrato

### 1. Perfil estable

Que es:
Datos lentos del usuario, que no cambian segun el dia.

Dolor que resuelve:
Evita recomendar cosas incompatibles con la realidad o con los limites permanentes de la persona.

Objetivo:
Definir las restricciones y preferencias base que el motor debe respetar siempre o casi siempre.

Variables:

- `pais`
- `plataformas`
- `idiomas_comodos`
- `tolerancia_subtitulos`
- `no_rotundos`

Uso tecnico:

- `pais`: filtro duro por region
- `plataformas`: filtro duro por proveedor
- `idiomas_comodos`: filtro duro o casi duro por idioma
- `tolerancia_subtitulos`: filtro duro o casi duro combinado con idioma
- `no_rotundos`: filtro duro

Terminos tecnicos utiles:

- `perfil_estable`
- `hard filters`
- `constraints`

### 2. Sesion actual

Que es:
La intencion del usuario hoy.

Dolor que resuelve:
Evita tratar todos los dias como si el usuario quisiera ver lo mismo.

Objetivo:
Capturar el contexto puntual de la recomendacion.

Variables:

- `modo_entrada`
- `mood`
- `preferencia_tiempo`
- `preferencia_energia`
- `seguro_o_descubrir`
- `preferencia_epoca`

Uso tecnico:

- `modo_entrada`: define si hay solo apoyo en perfil o preguntas adicionales
- `mood`: orientacion principal de la sesion
- `preferencia_tiempo`: filtro duro o casi duro
- `preferencia_energia`: ranking secundario
- `seguro_o_descubrir`: ranking secundario
- `preferencia_epoca`: filtro duro o casi duro

Terminos tecnicos utiles:

- `sesion_actual`
- `session payload`
- `ranking`
- `heuristics`

### 3. Memoria de peliculas

Que es:
Las acciones del usuario sobre peliculas concretas.

Dolor que resuelve:
Evita repetir peliculas, ignorar descartes y desaprovechar senales basicas ya dadas por el usuario.

Objetivo:
Dar al motor una memoria minima y util de interacciones reales.

Variables de negocio:

- `peliculas_vistas`
- `peliculas_para_ver`
- `peliculas_descartadas`
- `valoraciones_vistas`

Decision MVP:

- `peliculas_vistas` entra en v1 y debe impedir volver a recomendar una pelicula ya vista
- `peliculas_descartadas` entra en v1 y debe impedir volver a recomendar una pelicula descartada
- `peliculas_para_ver` entra en v1 y debe impedir volver a recomendar una pelicula ya guardada para ver despues
- `valoraciones_vistas` queda fuera del motor MVP y pasa a backlog

Nota de compatibilidad con nombres actuales:

- `peliculas_vistas` corresponde hoy a `historial`
- `peliculas_para_ver` corresponde hoy a `ver_luego`
- `peliculas_descartadas` corresponde hoy a `titulos_descartados`
- `valoraciones_vistas` todavia no tiene contrato cerrado ni campo estable en backend

Terminos tecnicos utiles:

- `memoria_de_peliculas`
- `movie feedback`
- `interaction history`
- `exclusion list`
- `canonical identifier`

## Que entra en EPIC 4 MVP

- contrato unico de entrada al motor
- filtros duros sobre catalogo
- reglas de relajacion controlada si faltan candidatas
- ranking determinista con reglas cerradas
- exclusion de peliculas vistas
- exclusion de peliculas guardadas para ver despues
- exclusion de peliculas descartadas
- salida final con seleccion util para producto

## Que no entra en EPIC 4 MVP

- IA para reordenar o explicar resultados
- explicaciones visibles del tipo "por que te recomendamos esto"
- aprendizaje a partir de `peliculas_para_ver`
- aprendizaje a partir de `valoraciones_vistas`
- personalizacion avanzada por patrones ocultos
- ajuste automatico de pesos a partir del comportamiento

## Contrato minimo de entrada del motor

### Bloque 1. Perfil estable

```json
{
  "pais": "ES",
  "plataformas": [8, 119, 337],
  "idiomas_comodos": ["es", "en"],
  "tolerancia_subtitulos": "si",
  "no_rotundos": [27]
}
```

### Bloque 2. Sesion actual

```json
{
  "modo_entrada": "preguntame",
  "mood": "pasar_un_buen_rato",
  "preferencia_tiempo": "algo_rapido",
  "preferencia_energia": "facil",
  "seguro_o_descubrir": "seguro",
  "preferencia_epoca": "actual"
}
```

### Bloque 3. Memoria de peliculas

```json
{
  "peliculas_vistas": [550, 13, 680],
  "peliculas_para_ver": [27205, 496243],
  "peliculas_descartadas": [238, 424],
  "valoraciones_vistas": []
}
```

Regla cerrada:

- `peliculas_vistas`, `peliculas_para_ver` y `peliculas_descartadas` deben viajar usando `tmdb_id` como identificador canonico de exclusión
- si backend o frontend manejan tambien `movie_id` interno, ese valor debe normalizarse a `tmdb_id` antes de entrar al motor

### Bloque 4. Catalogo local

Debe aportar, como minimo:

- `movie_id` o identificador interno
- `tmdb_id`
- `title`
- `genre_ids`
- `runtime`
- `release_year`
- `original_language`
- `overview`
- `providers`
- `vote_average`
- `vote_count`

Terminos tecnicos utiles:

- `input schema`
- `catalogo_local`
- `candidate pool`

## Regla de moods para EPIC 4

El motor determinista no debe reinventar el significado de los moods.

Decision cerrada:

- el mapeo `mood -> genre_ids principales` ya quedó definido en EPIC 0
- EPIC 4 debe reutilizar ese contrato tal cual, sin abrir una redefinicion paralela

Referencias:

- `docs/contracts/epic-0-moods.md`
- `docs/contracts/epic-0-taxonomia-interna.md`

Uso tecnico:

- el `mood` orienta el ranking usando los `genre_ids` principales ya cerrados
- en MVP, la logica sigue siendo simple: coincidencia por genero principal en logica `OR`
- no se introducen pesos por genero ni interpretaciones editoriales nuevas en esta fase

## Contrato minimo de salida del motor

El motor MVP debe devolver:

- `candidatas_filtradas`
- `lista_corta`
- `seleccion_final`

Regla de producto:

- `seleccion_final` debe poder entregar una recomendacion principal o un top 3
- el contrato no exige todavia explicacion visible ni trazabilidad expuesta en frontend

## Pipeline operativo del motor

### Paso 1. Filtrado duro

Aplicar primero:

- `pais`
- `plataformas`
- `idiomas_comodos`
- `tolerancia_subtitulos`
- `no_rotundos`
- `peliculas_vistas`
- `peliculas_para_ver`
- `peliculas_descartadas`

Objetivo:
quitar lo que nunca deberia salir

Terminos tecnicos utiles:

- `hard filtering`
- `candidate filtering`

### Paso 2. Filtrado o sesgo por sesion

Aplicar despues:

- `preferencia_tiempo`
- `preferencia_epoca`

Objetivo:
ajustar la lista al contexto de hoy sin perder demasiado catalogo

Terminos tecnicos utiles:

- `soft constraints`
- `controlled relaxation`

### Paso 3. Ranking determinista

Ordenar las candidatas segun:

- `mood`
- `preferencia_energia`
- `seguro_o_descubrir`
- senales basicas del catalogo

Objetivo:
dejar arriba las peliculas que mejor encajan con el contexto de sesion

Nota:

- `peliculas_para_ver` no participa en ranking porque, al ser lista de guardado para ver despues, ya actua como exclusión y no debe volver a salir como recomendacion nueva

Terminos tecnicos utiles:

- `scoring`
- `weights`
- `ranking rules`

### Paso 4. Seleccion final

Elegir la recomendacion principal o top 3 final evitando listas torpes o demasiado repetitivas.

Objetivo:
entregar una salida de producto util y presentable

Terminos tecnicos utiles:

- `top_n`
- `selection`
- `final ranking`

## Reglas cerradas para MVP

### Repeticiones

- una pelicula presente en `peliculas_vistas` no debe volver a recomendarse por defecto
- una pelicula presente en `peliculas_para_ver` no debe volver a recomendarse por defecto
- una pelicula presente en `peliculas_descartadas` no debe volver a recomendarse por defecto

### Peliculas para ver

- `peliculas_para_ver` se persiste como memoria de producto
- actua como exclusion en el motor MVP
- no debe modificar todavia el ranking del motor MVP

### Valoraciones de vistos

- las estrellas o notas de peliculas vistas no entran en el motor MVP
- se dejan para una fase posterior de aprendizaje por feedback

## Fallback

Si despues de aplicar filtros quedan muy pocas candidatas, el orden de relajacion recomendado es:

1. relajar `preferencia_epoca`
2. relajar `preferencia_tiempo`
3. mantener siempre `no_rotundos`
4. mantener siempre exclusiones por `peliculas_vistas`
5. mantener siempre exclusiones por `peliculas_para_ver`
6. mantener siempre exclusiones por `peliculas_descartadas`

## Propuesta de modulos backend en español

Estos nombres buscan que el backend sea legible para todo el equipo y que cada archivo tenga una responsabilidad clara.

### `backend/app/motor/contrato.py`

Que hace:

- define el shape de entrada y salida del motor
- normaliza nombres actuales del backend a nombres de negocio del motor
- centraliza defaults y reglas de validacion basica

Ejemplos:

- traducir `historial -> peliculas_vistas`
- traducir `ver_luego -> peliculas_para_ver`
- traducir `titulos_descartados -> peliculas_descartadas`

### `backend/app/motor/moods.py`

Que hace:

- codifica el mapeo `mood -> genre_ids principales` ya cerrado en EPIC 0
- evita duplicar esa decision en varios sitios del backend

### `backend/app/motor/catalogo.py`

Que hace:

- carga el catalogo local desde SQLite
- devuelve peliculas con el shape que necesita el motor
- deja fuera detalles HTTP o de Flask

### `backend/app/motor/filtros.py`

Que hace:

- aplica filtros duros
- aplica exclusiones por `tmdb_id`
- concentra la logica de pais, plataformas, idioma, subtitulos, `no_rotundos`, vistas, para-ver y descartadas

### `backend/app/motor/puntuacion.py`

Que hace:

- calcula la puntuacion determinista de cada candidata
- usa `mood`, `preferencia_energia`, `seguro_o_descubrir` y otras reglas cerradas

### `backend/app/motor/seleccion.py`

Que hace:

- ordena candidatas ya puntuadas
- construye `lista_corta`
- decide la `seleccion_final`

### `backend/app/motor/motor.py`

Que hace:

- orquesta el pipeline completo
- recibe entrada normalizada
- llama a catalogo, filtros, puntuacion y seleccion
- devuelve la respuesta final lista para `session_routes.py`

### `backend/app/session_routes.py`

Papel despues del refactor:

- validar request HTTP
- recuperar usuario y perfil
- construir entrada del motor
- llamar a `motor.py`
- devolver JSON

Regla de arquitectura:

- `session_routes.py` no debe quedarse con la logica del motor dentro
- la logica de recomendacion debe vivir en `backend/app/motor/`

## Backlog paluego

Esto queda explicitamente para despues del motor determinista y de la integracion base del producto:

- usar `valoraciones_vistas` para inferir gustos
- aprender preferencias por genero, epoca, duracion o idioma desde feedback real
- anadir IA para reordenar una lista corta valida
- anadir IA para explicar la recomendacion

## Decision operativa

EPIC 4 debe cerrar primero el motor determinista. La memoria minima de peliculas entra solo para exclusiones claras. El aprendizaje a partir de feedback y cualquier capa de IA quedan en backlog.
