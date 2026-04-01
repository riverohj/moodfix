# Roadmap

## Definicion

Este documento es el cuaderno de ruta del proyecto. Su funcion es decir en que punto estamos, que bloque de trabajo toca ahora y que viene despues, sin convertirse en un plan burocratico ni demasiado detallado.

## Estado del proyecto

- Estado general: EPIC 0 y EPIC 1 cerrados; EPIC 2 abierto para contrato
- Fecha objetivo del MVP: 24 de abril
- Estado actual: catalogo local validado en el Mac mini de referencia, backend comun LAN operativo y siguiente foco en cerrar contrato de EPIC 2

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
Abierto para contrato

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
- primero conviene cerrar contrato y shape de datos antes de implementar UI o backend

### EPIC 3 · Flujos de sesion: Sorprendeme y Preguntame

Objetivo:
Capturar bien la intencion de la sesion y llevar al usuario hasta resultados.

Estado:
Pendiente

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
