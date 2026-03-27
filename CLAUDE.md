# CLAUDE.md

## Definicion

Este archivo resume como queremos que cualquier asistente AI, incluido Claude, entienda y trate este repositorio. Su funcion es alinear el trabajo automatico con las decisiones del equipo y evitar cambios improvisados.

## Contexto del proyecto

- MoodFix usa TMDb como fuente de datos.
- Mood Radar toma las decisiones con logica propia.
- El MVP debe recomendar 3 peliculas validas.
- La IA sobre la shortlist es opcional y nunca sustituye al motor determinista.

## Reglas de colaboracion

- No implementar funcionalidades fuera del alcance definido en `docs/mvp-scope.md`.
- Priorizar simplicidad, trazabilidad y velocidad de entrega.
- Registrar decisiones tecnicas o de producto en `docs/decisions.md`.
- Registrar avances, bloqueos y siguientes pasos en `docs/progress-log.md`.
- Mantener el backend y el frontend listos para demo antes de sofisticar la arquitectura.

## Convencion de ramas

- `feat/...` para nuevas piezas de trabajo
- `fix/...` para correcciones
- `docs/...` para documentacion
- `chore/...` para setup, tooling o mantenimiento

## Convencion de commits

Ejemplos validos:

- `feat: add onboarding skeleton`
- `fix: correct session payload mapping`
- `docs: update roadmap after epic 0`
- `chore: configure flask development entrypoint`

## Limites de esta fase

- No introducir todavia logica de producto final.
- No inventar campos, reglas o features no cerradas.
- No sobredisenar la arquitectura.

