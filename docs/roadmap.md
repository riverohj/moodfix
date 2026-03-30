# Roadmap

## Definicion

Este documento es el cuaderno de ruta del proyecto. Su funcion es decir en que punto estamos, que bloque de trabajo toca ahora y que viene despues, sin convertirse en un plan burocratico ni demasiado detallado.

## Estado del proyecto

- Estado general: EPIC 0 cerrado y EPIC 1 en arranque tecnico
- Fecha objetivo del MVP: 24 de abril
- Estado actual: boilerplate listo, contrato de EPIC 0 consolidado y primeras decisiones tecnicas de EPIC 1 en marcha

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
En curso

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
- conviene fijar un tamano inicial de catalogo de unas `200-300` peliculas utiles para demo
- la autenticacion contra TMDb debe priorizar `TMDB_READ_ACCESS_TOKEN`
- `TMDB_API_KEY` queda como respaldo documentado

### EPIC 2 · Perfil estable del usuario y onboarding con skip

Objetivo:
Persistir las señales estables minimas del usuario con el menor roce posible.

Estado:
Pendiente

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
