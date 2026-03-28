# EPIC 0 Overview Contract

## Definicion

Este documento define el contrato general del EPIC 0. Su funcion es cerrar el lenguaje operativo del MVP para que frontend, backend, base de datos y motor implementen exactamente el mismo producto y no versiones distintas del mismo concepto.

## Objetivo

Cerrar las definiciones compartidas del MVP antes de implementar logica de producto.

## Resultado esperado

Al terminar EPIC 0, el equipo debe poder responder sin ambiguedad:

- que pregunta ve el usuario
- que variable interna genera esa pregunta
- que valores puede tomar
- que significa cada valor en el sistema
- si afecta a filtro duro, filtro blando, ranking o persistencia
- si viene de TMDb o es una derivacion propia

## Que entra

- lista cerrada de moods
- lista cerrada de preguntas de sesion
- lista cerrada de señales estables del perfil
- traduccion `pregunta visible -> variable interna`
- definicion operativa de `rapido`, `reto`, `epoca`, `seguro/descubrir`
- contrato del flujo `Sorprendeme`
- contrato del flujo `Preguntame`
- contrato minimo de entrada y salida del motor

## Que no entra

- implementacion del motor de recomendacion
- scoring adaptativo complejo
- IA sobre shortlist
- diseno visual final
- integracion completa con TMDb para producto
- modelo de base de datos implementado

## Definicion de hecho

EPIC 0 se considera cerrado cuando:

- todas las variables del MVP tienen nombre visible y nombre tecnico
- cada variable tiene valores permitidos y significado operativo
- esta claro que parte viene de TMDb y que parte es logica propia
- esta claro que es filtro duro, que es filtro blando y que es ranking
- el equipo puede pasar a EPIC 1, 2 y 3 sin dudas semanticas

## Entregables obligatorios

- `docs/contracts/epic-0-overview.md`
- `docs/contracts/epic-0-moods.md`
- `docs/contracts/epic-0-session-signals.md`
- `docs/contracts/epic-0-profile-signals.md`
- `docs/contracts/epic-0-motor-rules.md`
- `docs/contracts/epic-0-tmdb-mapping.md`

## Riesgos que este epic debe resolver

- usar nombres de producto ambiguos
- asumir que TMDb da directamente señales que en realidad son derivadas
- no cerrar defaults para usuarios que hagan skip
- no distinguir entre restriccion dura y preferencia
- dejar inconsistencias entre front, backend y motor

## Decision metodologica

Durante EPIC 0 se permite documentar y explorar datos, pero no construir todavia la logica final del producto.
