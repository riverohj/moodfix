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

### 2026-03-27 · Contratos por epic

- Decision: cada epic tendra su propio contrato documentado en `docs/contracts/`.
- Motivo: necesitamos alinear producto, front, backend, datos y motor antes de implementar.
- Impacto: EPIC 0 se documenta como contrato operativo y servira de base para los siguientes epics.
- Responsable o acuerdo del equipo: acuerdo de trabajo del equipo.

### 2026-03-27 · TMDb como fuente de datos, no como semantica de producto

- Decision: TMDb se usara como fuente de datos y MoodFix derivara su propia semantica de producto.
- Motivo: TMDb aporta generos, runtime, idiomas y providers, pero no moods, energia o seguro/descubrir como conceptos nativos.
- Impacto: se documenta un mapeo explicito `TMDb -> derivacion MoodFix` dentro del contrato de EPIC 0.
- Responsable o acuerdo del equipo: especificaciones del proyecto y validacion con documentacion oficial de TMDb.

## Regla de uso

Si una decision afecta al alcance, al modelo de datos, al contrato API o a Mood Radar, debe quedar registrada aqui.
