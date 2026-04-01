# EPIC 1 Checklist de Cierre

## Definicion

Este documento resume lo minimo que debe verificarse antes de dar EPIC 1 por cerrado. Su funcion es evitar que el equipo confunda "codigo integrado" con "epic validado".

## Checklist

- existe una `TMDB_READ_ACCESS_TOKEN` valida en el entorno donde se va a ejecutar la ingestión
- la ingestión puede ejecutarse con el comando acordado
- la carga local alcanza un volumen razonable para demo
- `movies` contiene peliculas reales con metadata util
- `movie_providers` contiene disponibilidad real por region
- `GET /api/db/status` responde correctamente
- `GET /api/movies?page=1&limit=20` devuelve resultados reales desde la BD local
- la lista de providers filtrados coincide con la lista cerrada por el equipo
- el equipo decide si la base de referencia vivira en local por persona o en una maquina comun

## Cierre operativo

EPIC 1 no debe marcarse como cerrado solo porque el script exista. Debe marcarse como cerrado cuando la carga real haya sido ejecutada y el catalogo local ya pueda consultarse desde la API.

## Resultado validado

- Validado el `2026-04-01`
- Mac mini de referencia configurado como backend comun local del equipo
- SQLite mantenida solo en esa maquina y fuera de Git
- Carga real ejecutada con `backend/.venv/bin/python backend/scripts/ingest.py --limit 500 --countries ES`
- `movies`: `417`
- `movie_providers`: `1129`
- `GET /api/db/status` y `GET /api/movies?page=1&limit=20` responden correctamente
- EPIC 1 queda cerrado a nivel operativo y documental
