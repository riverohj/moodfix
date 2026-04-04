# Progress Log

## Definicion

Este documento es el diario corto del proyecto. Sirve para dejar trazabilidad de lo que ya se ha hecho, que esta en curso y que bloqueos existen. La idea es que cualquier persona del equipo pueda abrirlo y entender el estado del trabajo en pocos minutos.

## Formato acordado

Cada actualizacion debe incluir:

- fecha
- que se hizo
- que queda
- bloqueos o riesgos

## Entradas iniciales

### 2026-03-27

- Que se hizo: se creo la base del repositorio con `backend/`, `frontend/`, `docs/`, `README.md` y `.env.example`.
- Que queda: crear repo remoto, invitar colaboradores, instalar dependencias y validar arranque local.
- Bloqueos o riesgos: aun no estan cerradas las definiciones operativas del MVP para empezar producto.

### 2026-03-27

- Que se hizo: se creo la carpeta `docs/contracts/` y se redacto una primera version del contrato de EPIC 0.
- Que queda: cerrar los puntos pendientes de moods, tiempo, energia, epoca, defaults y orden de fallback.
- Bloqueos o riesgos: `Inspiracionales` y `Entender el mundo` siguen siendo los moods mas ambiguos del MVP.

### 2026-03-27

- Que se hizo: se anadio el documento `epic-0-tmdb-mapping.md` para separar datos nativos de TMDb y derivaciones propias de MoodFix.
- Que queda: validar con el equipo si algun `hard no` se modelara solo por genero o tambien por keywords.
- Bloqueos o riesgos: los providers por region pueden introducir inconsistencias y conviene testearlos pronto.

### 2026-03-27

- Que se hizo: se anadio `epic-0-proposed-decisions.md` con propuestas operativas para cerrar tiempo, epoca, idiomas, defaults, fallback y moods ambiguos.
- Que queda: validar estas propuestas en equipo y convertir las aceptadas en contrato cerrado.
- Bloqueos o riesgos: si no se validan pronto, EPIC 1 y EPIC 4 pueden avanzar con interpretaciones distintas.

### 2026-03-30

- Que se hizo: se consolidaron los contratos base de EPIC 0 y se eliminaron los documentos provisionales. Quedaron cerrados moods, señales de sesion, señales estables de perfil, reglas base del motor y mapeo TMDb.
- Que queda: usar este contrato cerrado como base para arrancar EPIC 1, EPIC 2 y EPIC 3 sin reinterpretaciones.
- Bloqueos o riesgos: conviene validar pronto con datos reales de TMDb que los providers por region y los moods cerrados devuelven resultados razonables al pasar a implementacion.

### 2026-03-30

- Que se hizo: arranco EPIC 1 con el contrato de credenciales TMDb y la definicion refinada del alcance del catalogo local minimo.
- Que queda: cerrar endpoints concretos, esquema de `movies` y `movie_providers`, e implementar la primera ingestión.
- Bloqueos o riesgos: si las credenciales reales se comparten en documentos o capturas, deben rotarse y pasar a variables de entorno cuanto antes.

### 2026-03-31

- Que se hizo: se anadio y reviso el contrato de endpoints de TMDb para EPIC 1, separando endpoints minimos obligatorios de endpoints de apoyo o validacion.
- Que queda: cerrar el esquema de base de datos del catalogo local y arrancar la primera ingestión con datos reales.
- Bloqueos o riesgos: si la ingestión se apoya solo en `discover/movie`, el catalogo inicial puede quedar demasiado sesgado hacia peliculas mainstream.

### 2026-03-31

- Que se hizo: se documento e implemento el esquema minimo de base de datos del catalogo local con `movies` y `movie_providers`, y se dejo creado el contrato de ingestión inicial.
- Que queda: implementar el script o servicio que traiga peliculas desde TMDb y las persista en estas tablas.
- Bloqueos o riesgos: sigue siendo importante no depender solo de `discover/movie` con orden por popularidad para evitar un catalogo demasiado sesgado.

### 2026-04-01

- Que se hizo: se actualizo la documentacion de EPIC 1 para alinear la implementacion principal con `TMDB_READ_ACCESS_TOKEN` como formato unico de autenticacion y se cerro una estrategia mixta de carga inicial para reducir sesgo.
- Que queda: integrar el script de ingestión en `main`, corregir el conteo de `movie_providers` para reflejar solo inserciones reales y exponer un endpoint minimo de consulta del catalogo.
- Bloqueos o riesgos: mientras el script viva en una rama separada, la correccion del contador y la estrategia de carga no quedan integradas en el flujo principal del equipo.

### 2026-04-01

- Que se hizo: se integro `feat/lourdes` en `main`, se corrigio el conteo real de inserciones en `movie_providers` y se anadio `GET /api/movies` con paginacion basica para consultar el catalogo local desde la API.
- Que queda: ejecutar una carga real del catalogo, validar cantidad y calidad de peliculas/providers y decidir si EPIC 1 queda cerrado.
- Bloqueos o riesgos: al ampliar la carga a 500 peliculas y filtrar providers, conviene validar tiempos de ejecución y calidad final del catalogo.

### 2026-04-01

- Que se hizo: se dejo una checklist de cierre de EPIC 1 y se abrio el contrato base de EPIC 2 para perfil estable y onboarding con skip.
- Que queda: validar en equipo la estrategia de base compartida para EPIC 1 y cerrar las decisiones concretas de EPIC 2.
- Bloqueos o riesgos: EPIC 2 puede desordenarse rapido si mezcla onboarding estable con preguntas de sesion o con aprendizaje avanzado.

### 2026-04-01

- Que se hizo: se ejecuto la carga real de EPIC 1 en el Mac mini de referencia con `TMDB_READ_ACCESS_TOKEN`, se validaron `GET /api/db/status` y `GET /api/movies`, el backend comun LAN quedo operativo con la SQLite local viviendo solo en esa maquina y con esto EPIC 1 queda cerrado.
- Que queda: abrir y cerrar en equipo el contrato operativo de EPIC 2 para perfil estable y onboarding con skip.
- Bloqueos o riesgos: la URL LAN actual depende de la IP local del Mac mini y convendra reservarla en el router para evitar cambios futuros.

### 2026-04-01

- Que se hizo: se alineo la documentacion de EPIC 2 con la implementacion real del backend, dejando el perfil estable como auth-only, documentando la semantica `PUT` reemplaza / `PATCH` mergea y separando el handoff guest del MUT como trabajo de `sessions` para EPIC 3.
- Que queda: abrir el PR de la rama `epic-2-2.1-user_prifile_model`, validar el flujo con Lourdes desde frontend y decidir el orden final de preguntas visibles del onboarding.
- Bloqueos o riesgos: si frontend mezcla onboarding estable con preguntas de sesion antes de cerrar EPIC 3, puede reaparecer la confusion entre `user_profiles` y `sessions`.

### 2026-04-03

- Que se hizo: se empezo la integracion real del frontend de EPIC 2 sobre la rama de auth y perfil, manteniendo `App` como entrada normal, conectando onboarding a `GET /api/profile`, `PATCH /api/profile` y `POST /api/profile/skip`, y alineando los valores del formulario con el contrato tecnico de backend.
- Que queda: validar la integracion visual con Lourdes, revisar el PR frontend con backend ya disponible y cerrar el flujo extremo a extremo de registro o login, onboarding y re-edicion.
- Bloqueos o riesgos: si frontend y backend usan labels visibles en vez de `provider_id`, `genre_id`, codigos ISO o codigos de idioma, el onboarding puede parecer correcto en UI pero persistir datos incompatibles con el motor.

### 2026-04-03

- Que se hizo: se acoto de forma mas estricta el alcance de EPIC 2 para que cubra solo auth, perfil estable, onboarding con skip y persistencia minima; se movio a EPIC 3 la shell posterior al onboarding, junto con navbar, footer o cajon, la pantalla de historico, la pantalla de favoritos y la memoria interna basada en esos datos para enriquecer la respuesta final del top 3.
- Que queda: documentar la salida minima del onboarding en frontend, cerrar el flujo extremo a extremo y decidir si esa salida minima sera una confirmacion simple o una transicion temporal antes de la shell de EPIC 3.
- Bloqueos o riesgos: si el equipo vuelve a mezclar en EPIC 2 historico, favoritos o memoria para el prompt, el cierre del onboarding se volvera difuso y costara mas separar responsabilidades entre epics.

### 2026-04-04

- Que se hizo: se integro la UI de auth sobre el flujo real de EPIC 2, manteniendo `login/signup` conectados al backend, se dejo una salida minima tras completar o saltar el onboarding, y se habilito una re-edicion simple del perfil desde header.
- Que se hizo: se paso un smoke funcional extremo a extremo sobre frontend y backend locales, validando `register`, `login`, `GET /api/profile`, `PATCH /api/profile`, `POST /api/profile/skip`, persistencia, logout/login y re-edicion.
- Que se hizo: se retiro la rama remota vieja `epic-2-1-LOGINSINGUP` para evitar que el equipo abra PRs desde una maqueta aislada de auth en vez de usar la rama operativa actual.
- Que queda: coordinar los PRs del equipo sobre `epic-2-2.1-user_prifile_model`, decidir si hace falta mas pulido visual en auth y cerrar EPIC 2 cuando el equipo de frontend confirme el flujo final.
- Bloqueos o riesgos: si alguien vuelve a sacar trabajo desde una rama vieja o mezcla shell, historico o favoritos dentro de EPIC 2, se reabrira una confusion de alcance que ya esta resuelta en los contratos.

## Regla de uso

Actualizar este archivo al cerrar una tarea importante o cuando aparezca un bloqueo real que pueda afectar al equipo.
