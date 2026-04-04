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

- Decision: EPIC 1 trabajara solo con `TMDB_READ_ACCESS_TOKEN` como formato de autenticacion dentro del proyecto.
- Motivo: el equipo necesita una forma clara y consistente de autenticarse contra TMDb al arrancar la integracion, y el bearer token evita errores al reutilizar tokens v4 como si fueran API key v3.
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

### 2026-04-01 · Carga inicial ampliada y providers filtrados

- Decision: la carga inicial actual pasa a objetivo de `500` peliculas y conserva solo peliculas con providers permitidos en la lista cerrada del proyecto.
- Motivo: el equipo quiere una demo mas robusta y un catalogo local mas util para filtros reales de disponibilidad.
- Impacto: la ingestión filtra providers a plataformas objetivo y descarta peliculas que no tengan ninguno de esos providers en los paises elegidos.
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

### 2026-04-01 · EPIC 1 queda cerrado con backend comun local en el Mac mini

- Decision: EPIC 1 queda cerrado operativamente usando el Mac mini de referencia como backend comun local del equipo y manteniendo la SQLite solo en esa maquina.
- Motivo: la carga real del catalogo ya fue ejecutada, la API devuelve datos reales y no hace falta compartir la base por Git para seguir con el MVP.
- Impacto: el equipo trabaja contra el backend comun LAN, `movies` queda validada con `417` peliculas y `movie_providers` con `1129` filas, y el siguiente foco pasa a EPIC 2.
- Responsable o acuerdo del equipo: cierre operativo de EPIC 1.

### 2026-04-01 · EPIC 2 se abre como contrato antes de implementacion

- Decision: EPIC 2 se trabajara primero como contrato de perfil estable y onboarding con skip antes de pasar a codigo.
- Motivo: el equipo ya tiene cerradas las variables en EPIC 0 y ahora necesita convertirlas en flujo real sin reinterpretaciones.
- Impacto: primero se cerraran preguntas, orden, payload y persistencia minima; despues se implementara.
- Responsable o acuerdo del equipo: continuidad ordenada del MVP.

### 2026-04-04 · Shell de frontend comun con layout y routing basico

- Decision: el frontend adopta un `Layout` comun con navbar y footer persistentes, y centraliza la navegacion en `frontend/src/routes.jsx` usando `react-router-dom`.
- Motivo: el equipo necesita una base limpia para crecer por paginas sin duplicar estructura comun y dejando claro donde vive el routing de la app.
- Impacto: la home queda servida en `/` dentro del layout, la pantalla de autenticacion vive en `/auth`, y `main.jsx` renderiza directamente el router como punto de entrada unico del frontend.
- Responsable o acuerdo del equipo: implementacion actual del frontend para EPIC 3.1.

### 2026-04-04 · Estado de autenticacion se mantiene provisional en frontend

- Decision: mientras no exista una implementacion fuente de autenticacion en backend, el estado `isAuthenticated` se mantiene como bandera provisional en el router del frontend y el navbar solo expone `Login` o `Logout` segun ese valor.
- Motivo: el producto debe permitir navegacion como invitado y avanzar en la interfaz comun sin bloquearse por una capa de auth que todavia no esta integrada en codigo versionado.
- Impacto: la navegacion hacia `/auth` funciona como flujo visual, pero login, logout y registro siguen siendo UI sin persistencia ni validacion contra API; el equipo no debe asumir sesion real hasta cerrar ese contrato.
- Responsable o acuerdo del equipo: decision temporal aceptada para desacoplar construccion de interfaz y futura integracion de autenticacion.

### 2026-04-04 · Navbar reducido a acciones esenciales segun sesion

- Decision: el navbar elimina `Inicio` y `Explorar`, y mantiene `Favoritos` solo cuando el usuario esta logueado.
- Motivo: esas opciones no aportan valor en el estado actual del flujo y `Favoritos` solo tiene sentido como espacio ligado a una sesion de usuario.
- Impacto: la navegacion publica queda centrada en el acceso al login, mientras la opcion de favoritos pasa a depender explicitamente del estado de autenticacion.
- Responsable o acuerdo del equipo: ajuste de interfaz aplicado en EPIC 3.1.

## Regla de uso

Si una decision afecta al alcance, al modelo de datos, al contrato API o a Mood Radar, debe quedar registrada aqui.
