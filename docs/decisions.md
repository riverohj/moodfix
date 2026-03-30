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

### 2026-03-30 · Seguro o descubrir pasa a ser senal de sesion

- Decision: `seguro_o_descubrir` deja de ser una preferencia estable del perfil y pasa a modelarse como senal de sesion.
- Motivo: el usuario puede querer ir a lo seguro un dia y descubrir otro, asi que encaja mejor como intencion puntual que como rasgo estable.
- Impacto: se documenta en `epic-0-session-signals.md` y sale de `epic-0-profile-signals.md`.
- Responsable o acuerdo del equipo: validacion interna del contrato de EPIC 0.

### 2026-03-30 · Onboarding completamente opcional

- Decision: ningun campo del onboarding es obligatorio para entrar en el producto.
- Motivo: se prioriza bajar friccion de entrada y permitir uso rapido, aunque con menor precision en la recomendacion.
- Impacto: el sistema debe funcionar con perfil incompleto y comunicar al usuario que, cuanto mas sepa de el, mejor afinara la recomendacion.
- Responsable o acuerdo del equipo: validacion interna del contrato de EPIC 0.

### 2026-03-30 · Plataformas y no rotundos quedan simplificados para MVP

- Decision: `plataformas` se modela con `provider_id` de TMDb como fuente de verdad y `no_rotundos` se modela como lista de `genre_id` de TMDb.
- Motivo: es la opcion mas simple, auditable e implementable para el MVP.
- Impacto: si `plataformas = []`, no se aplica filtro de plataforma. `no_rotundos` evita clasificaciones propias complejas en esta fase.
- Responsable o acuerdo del equipo: validacion interna del contrato de EPIC 0.

### 2026-03-30 · Reglas operativas cerradas para tiempo, epoca, energia y fallback

- Decision: se cierran los umbrales de tiempo y epoca, la heuristica minima de energia, y el fallback del motor.
- Motivo: el equipo necesitaba dejar de trabajar con definiciones ambiguas antes de implementar.
- Impacto: `algo_rapido < 90`, `tengo_tiempo >= 90`, `actual >= 2015`, `moderna >= 1990 y < 2015`, `clasica < 1990`. El fallback solo relaja epoca y tiempo y mantiene restricciones duras.
- Responsable o acuerdo del equipo: validacion interna del contrato de EPIC 0.

### 2026-03-30 · Nombres visibles y generos principales de moods cerrados

- Decision: se cierran los seis moods del MVP con nombres visibles y generos principales definidos, incluyendo `Historias que inspiran` y `Descubre el mundo`.
- Motivo: era necesario alinear nombre visible, expectativa de usuario y simplificacion del motor.
- Impacto: el motor podra trabajar con generos principales por mood sin sistema de puntuaciones en esta primera version.
- Responsable o acuerdo del equipo: validacion interna del contrato de EPIC 0.

## Regla de uso

Si una decision afecta al alcance, al modelo de datos, al contrato API o a Mood Radar, debe quedar registrada aqui.
