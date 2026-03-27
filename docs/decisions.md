# Decisions Log

## Definicion

Este documento es el registro de decisiones del proyecto. Solo debe guardar decisiones cerradas o supuestos temporales aceptados por el equipo. No sirve para debatir en largo, sino para dejar memoria util y evitar contradicciones.

## Formato acordado

Cada entrada debe incluir:

- fecha
- decision
- motivo
- impacto
- responsable o acuerdo del equipo

## Entradas iniciales

### 2026-03-27 · Base tecnica inicial

- Decision: arrancar con un boilerplate full stack basado en Flask API + React.
- Motivo: es el setup pedido por el profesor y permite avanzar rapido sin sobrearquitectura.
- Impacto: backend en `backend/`, frontend en `frontend/`, documentacion en `docs/`.
- Responsable o acuerdo del equipo: acuerdo inicial de arranque.

### 2026-03-27 · Fuente de datos y logica

- Decision: TMDb sera la fuente de datos y MoodFix decidira con logica propia.
- Motivo: el valor del MVP esta en Mood Radar y no en delegar la recomendacion a un tercero.
- Impacto: necesitaremos catalogo local, filtros propios y shortlist controlada.
- Responsable o acuerdo del equipo: especificaciones del proyecto.

### 2026-03-27 · Alcance de la IA

- Decision: la IA sobre la shortlist se mantiene como opcional.
- Motivo: el MVP debe sostenerse con un motor determinista defendible.
- Impacto: no puede bloquear el desarrollo del sistema base.
- Responsable o acuerdo del equipo: especificaciones del proyecto.

## Regla de uso

Si una decision afecta al alcance, al modelo de datos, al contrato API o a Mood Radar, debe quedar registrada aqui.

