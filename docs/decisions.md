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

### 2026-03-30 · Credenciales TMDb definidas para EPIC 1

- Decision: EPIC 1 trabajara con dos credenciales documentadas para TMDb, usando `TMDB_API_KEY` como mecanismo principal en la implementacion actual y dejando `TMDB_READ_ACCESS_TOKEN` como alternativa documentada.
- Motivo: el equipo necesita una forma clara y consistente de autenticarse contra TMDb al arrancar la integracion, y el script real de ingestión usa API key.
- Impacto: las credenciales deben vivir en variables de entorno y no deben quedar expuestas en frontend, logs, capturas ni documentos con valores reales.
- Responsable o acuerdo del equipo: arranque tecnico de EPIC 1.

### 2026-03-30 · EPIC 1 se centra en catalogo local minimo y carga manual inicial

- Decision: EPIC 1 se limita a conexion con TMDb, esquema local, ingestión inicial, providers por region y recarga manual simple.
- Motivo: hace falta una base de datos local suficiente para el motor sin sobredisenar la arquitectura.
- Impacto: no entra refresh automatico, no entra motor final, no entra IA ni contenido de series.
- Responsable o acuerdo del equipo: alcance del core MVP.

### 2026-03-31 · Endpoints minimos y endpoints de apoyo quedan separados en EPIC 1

- Decision: en EPIC 1 se distinguen endpoints minimos obligatorios para la primera ingestión y endpoints de apoyo o validacion.
- Motivo: el equipo necesita una version funcional rapida del catalogo local sin bloquearse por validaciones auxiliares.
- Impacto: el flujo minimo se apoya en `genre/movie/list`, `discover/movie`, `movie/{movie_id}` y `movie/{movie_id}/watch/providers`. El resto queda como apoyo.
- Responsable o acuerdo del equipo: revision del contrato de endpoints de TMDb.

### 2026-03-31 · Esquema minimo de catalogo local cerrado para EPIC 1

- Decision: el catalogo local del MVP se modela con dos tablas base: `movies` y `movie_providers`.
- Motivo: es el minimo suficiente para soportar filtros por tiempo, epoca, idioma, pais y plataformas sin sobredisenar la base de datos.
- Impacto: el backend ya puede crear la base local y servir como soporte para la ingestión inicial.
- Responsable o acuerdo del equipo: arranque tecnico de EPIC 1.

### 2026-03-31 · Ingestión inicial manual cerrada como siguiente paso de EPIC 1

- Decision: la primera carga del catalogo sera manual y se apoyara en `genre/movie/list`, `discover/movie`, `movie/{movie_id}` y `movie/{movie_id}/watch/providers`.
- Motivo: necesitamos una primera version funcional y reproducible del catalogo antes de pensar en automatizaciones.
- Impacto: la siguiente implementacion debe centrarse en traer unas `200-300` peliculas y poblar `movies` y `movie_providers`.
- Responsable o acuerdo del equipo: continuidad tecnica de EPIC 1.

### 2026-04-01 · Estrategia de carga mixta para evitar sesgo del catalogo inicial

- Decision: la ingestión inicial no debe apoyarse solo en `popularity.desc`; debe combinar popularidad, peliculas bien valoradas con volumen suficiente de votos y variedad por generos o moods.
- Motivo: una carga basada solo en popularidad sesga el catalogo hacia peliculas demasiado conocidas y empobrece el MVP.
- Impacto: `popularity` se mantiene como señal util, pero se complementa con `vote_average` y criterios de variedad.
- Responsable o acuerdo del equipo: refinamiento tecnico de EPIC 1.

### 2026-04-01 · Conteo de providers debe reflejar inserciones reales

- Decision: cualquier script de ingestión que inserte en `movie_providers` debe contar solo filas realmente insertadas, no intentos ignorados por duplicados.
- Motivo: el equipo necesita metricas fiables al validar la calidad de la carga inicial.
- Impacto: al integrar el script de ingestión, el contador de providers debe basarse en inserciones reales.
- Responsable o acuerdo del equipo: calidad de datos de EPIC 1.

### 2026-04-01 · Consulta minima del catalogo expuesta por la API

- Decision: la API del backend expone `GET /api/movies` con paginacion basica para verificar el catalogo local.
- Motivo: el equipo necesita demostrar que el catalogo ya puede consultarse desde la app sin depender de TMDb para cada recomendacion.
- Impacto: EPIC 1 ya cubre no solo la carga local sino tambien una primera lectura util del catalogo desde backend.
- Responsable o acuerdo del equipo: cierre tecnico de EPIC 1.

## Regla de uso

Si una decision afecta al alcance, al modelo de datos, al contrato API o a Mood Radar, debe quedar registrada aqui.
