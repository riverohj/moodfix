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

- Que se hizo: se actualizo la documentacion de EPIC 1 para alinearla con la implementacion actual por `TMDB_API_KEY`, se documento la diferencia con Bearer token y se cerro una estrategia mixta de carga inicial para reducir sesgo.
- Que queda: integrar el script de ingestión en `main`, corregir el conteo de `movie_providers` para reflejar solo inserciones reales y exponer un endpoint minimo de consulta del catalogo.
- Bloqueos o riesgos: mientras el script viva en una rama separada, la correccion del contador y la estrategia de carga no quedan integradas en el flujo principal del equipo.

## Regla de uso

Actualizar este archivo al cerrar una tarea importante o cuando aparezca un bloqueo real que pueda afectar al equipo.
