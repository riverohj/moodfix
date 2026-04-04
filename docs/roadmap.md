# Roadmap

## Definicion

Este documento es el cuaderno de ruta del proyecto. Su funcion es decir en que punto estamos, que bloque de trabajo toca ahora y que viene despues, sin convertirse en un plan burocratico ni demasiado detallado.

## Estado del proyecto

- Estado general: EPIC 0 y EPIC 1 cerrados; EPIC 2 en implementacion y PR
- Fecha objetivo del MVP: 24 de abril
- Estado actual: catalogo local validado en el Mac mini de referencia, backend comun LAN operativo y onboarding de EPIC 2 en integracion real contra auth y profile

## Bloques de trabajo

### EPIC 0 · Canon de producto y taxonomia interna

Objetivo:
Cerrar definiciones compartidas para que front, backend y motor usen el mismo lenguaje.

Estado:
Cerrado

### EPIC 1 · Catalogo local e integracion con TMDb

Objetivo:
Construir un catalogo local minimo de peliculas con los datos necesarios para que Mood Radar recomiende sin depender de TMDb en cada decision.

Estado:
Cerrado

Alcance esperado:

- conexion con TMDb y obtencion de peliculas
- normalizacion y almacenamiento local de:
  - titulo
  - poster
  - runtime
  - ano
  - `original_language`
  - generos
  - overview
  - `popularity`
  - `vote_count`
  - providers por region
- modelo de base de datos para catalogo y providers
- estrategia simple de recarga manual
- catalogo inicial suficiente para demo y pruebas del motor

Notas de implementacion:

- TMDb es fuente de datos, no logica de recomendacion
- no hace falta refresh automatico en esta fase
- el tamano actual objetivo de la carga inicial es `500` peliculas utiles para demo
- la implementacion actual contra TMDb usa `TMDB_READ_ACCESS_TOKEN`
- conviene separar endpoints minimos de ingestión de endpoints de apoyo o validacion
- la carga inicial no debe apoyarse solo en `popularity.desc`; conviene combinar popularidad, peliculas bien valoradas y variedad de generos
- la carga actual filtra providers a una lista cerrada de plataformas objetivo
- la ingestión inicial ya esta integrada en `main`
- existe un endpoint minimo `GET /api/movies` para consultar el catalogo local
- la carga real ya fue ejecutada en el Mac mini de referencia con `--limit 500 --countries ES`
- el catalogo validado para demo queda en `417` peliculas y `1129` filas en `movie_providers`
- el backend comun local sirve la base desde la LAN y la SQLite vive solo en ese Mac mini

### EPIC 2 · Perfil estable del usuario y onboarding con skip

Objetivo:
Persistir las señales estables minimas del usuario con el menor roce posible.

Estado:
En implementacion y PR

Alcance esperado:

- flujo de onboarding estable con skip
- payload minimo de perfil estable
- persistencia minima de perfil
- posibilidad de editar el perfil mas adelante
- mensaje claro cuando el usuario decide no completar el perfil

Notas de implementacion:

- EPIC 2 debe respetar lo ya cerrado en `epic-0-profile-signals.md`
- ningun campo del onboarding es obligatorio
- no debe mezclarse con preguntas de sesion
- la UI de `login/signup` debe vivir sobre el flujo real de auth y no en una maqueta aislada
- `GET /api/profile` requiere usuario autenticado
- `PUT /api/profile` reemplaza el perfil y `PATCH /api/profile` mergea cambios
- `POST /api/profile/skip` permite cerrar onboarding sin completar todos los campos
- frontend debe enviar valores tecnicos compatibles con backend: pais ISO, `provider_id`, codigos de idioma y `genre_id`
- al completar o saltar el onboarding, EPIC 2 solo exige una salida minima consistente y una forma simple de reabrir el perfil
- el handoff guest -> autenticado de preguntas de sesion queda fuera de EPIC 2 y pasa a EPIC 3
- la shell posterior al onboarding, incluyendo navbar, footer y cajon de navegacion, no forma parte de EPIC 2
- historico, favoritos y cualquier memoria interna basada en esos datos para mejorar el prompt del top 3 se mueven a EPIC 3
- cualquier rama vieja de auth o maquetas aisladas debe retirarse para evitar PRs sobre una base obsoleta

### EPIC 3 · Flujos de sesion: Sorprendeme y Preguntame

Objetivo:
Capturar bien la intencion de la sesion, llevar al usuario hasta resultados y empezar a dar forma a la experiencia posterior al onboarding.

Estado:
Pendiente

Notas de implementacion:

- EPIC 3 debe cerrar como se conserva el payload de sesion cuando el usuario responde como guest y se autentica justo antes del resultado
- ese handoff no debe resolverse usando `user_profiles`; pertenece a la capa de `sessions`
- para MVP puede bastar con conservar temporalmente el payload en frontend hasta completar login y reenviarlo despues autenticado
- la pantalla posterior al onboarding, junto con navbar, footer o cajon de navegacion, pasa a EPIC 3
- la primera version de historico y favoritos, y la memoria interna derivada de esos datos para ayudar al top 3, pasan a EPIC 3

### EPIC 4 · Mood Radar v1

Objetivo:
Construir shortlist y top 3 con filtros deterministas y logica propia.

Estado:
Pendiente

### EPIC 5 · Persistencia de aprendizaje basico

Objetivo:
Guardar historial, watch later, descartes, sesiones y recommendation sets.

Estado:
Pendiente

### EPIC 6 · IA opcional sobre shortlist

Objetivo:
Reordenar o elegir sobre candidatas validas sin romper el motor base.

Estado:
Opcional

### EPIC 7 · QA, integracion final, demo y defensa

Objetivo:
Estabilizar, ensayar y dejar una demo defendible.

Estado:
Pendiente

## Regla de uso

Cuando cambiemos de fase o cerremos un bloque, se actualiza este archivo en vez de abrir documentos nuevos.
