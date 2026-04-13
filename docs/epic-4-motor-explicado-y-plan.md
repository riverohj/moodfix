# EPIC 4 Motor Explicado y Plan Hasta el Lunes

## Definicion

Este documento resume dos cosas:

1. que codigo del motor determinista se ha implementado en esta sesion
2. como podemos repartir el trabajo entre 4 personas hasta el lunes para seguir avanzando sin pisarnos

## Objetivo de esta sesion

El objetivo de la implementacion hecha en esta sesion fue:

- sacar la logica del motor fuera de `session_routes.py`
- reutilizar el mapeo de moods ya cerrado en EPIC 0
- excluir por `tmdb_id` las peliculas vistas, guardadas para ver despues y descartadas
- dejar el backend listo para que el siguiente paso sea conectar las acciones del frontend con persistencia real
- retirar la explicacion visible `reason` de backend y frontend para dejar esa parte en backlog

## Resumen corto de lo implementado

- se creo el paquete `backend/app/motor/`
- se separo validacion, carga de catalogo, filtros, puntuacion y seleccion
- `POST /api/session/recommend` ya no contiene la logica del motor dentro
- el `mood` ya usa los `genre_ids` principales definidos en EPIC 0
- `historial`, `ver_luego` y `titulos_descartados` ya se leen como memoria de peliculas y excluyen recomendaciones por `tmdb_id`
- se quito `reason` de la respuesta backend y de la UI de resultados

## Explicacion archivo por archivo

### 1. `backend/app/motor/contrato.py`

Por que lo usamos:

- porque el motor no debe depender del shape crudo del perfil o del body HTTP
- porque necesitamos traducir nombres actuales del backend a nombres de negocio del motor

Para que sirve:

- normaliza el perfil antes de entrar al motor
- normaliza el payload de sesion antes de entrar al motor
- fija defaults coherentes cuando falta informacion
- convierte `historial`, `ver_luego` y `titulos_descartados` a listas de `tmdb_id`

Donde se usa:

- desde `backend/app/session_routes.py`

Funciones:

- `_ensure_list`
  - por que: para validar que ciertos campos llegan como lista
  - para que: evitar que el motor reciba basura o tipos inconsistentes
  - donde: lo usan las funciones de normalizacion de listas dentro del mismo archivo

- `normalizar_codigo_pais`
  - por que: el pais es filtro duro y debe tener formato estable
  - para que: forzar `ES` como fallback y devolver el codigo en mayusculas
  - donde: dentro de `normalizar_contexto_perfil`

- `normalizar_codigos_idioma`
  - por que: los idiomas son filtro y no queremos duplicados ni valores vacios
  - para que: devolver una lista limpia de codigos como `es`, `en`
  - donde: dentro de `normalizar_contexto_perfil`

- `normalizar_ids_proveedor`
  - por que: `plataformas` debe compararse por `provider_id`
  - para que: convertir la lista a enteros deduplicados
  - donde: dentro de `normalizar_contexto_perfil`

- `normalizar_lista_enteros`
  - por que: `no_rotundos` se trabaja como lista de `genre_id`
  - para que: limpiar listas numericas
  - donde: dentro de `normalizar_contexto_perfil`

- `_extraer_tmdb_id`
  - por que: la memoria de peliculas puede llegar como entero, string o diccionario
  - para que: sacar el `tmdb_id` canonico
  - donde: dentro de `normalizar_tmdb_ids`

- `normalizar_tmdb_ids`
  - por que: queriamos usar `tmdb_id` como identificador de exclusión
  - para que: construir listas limpias de exclusiones
  - donde: dentro de `normalizar_contexto_perfil`

- `normalizar_contexto_perfil`
  - por que: el motor necesita `perfil_estable` ya traducido
  - para que: convertir el perfil actual del backend al lenguaje del motor
  - donde: `backend/app/session_routes.py`

- `_validar_enum`
  - por que: las señales de sesion tienen valores cerrados
  - para que: bloquear valores inventados o incompatibles
  - donde: dentro de `normalizar_payload_sesion`

- `normalizar_payload_sesion`
  - por que: el motor necesita un payload consistente y validado
  - para que: dejar lista la entrada de `sorprendeme` o `preguntame`
  - donde: `backend/app/session_routes.py`

### 2. `backend/app/motor/moods.py`

Por que lo usamos:

- porque el significado de los moods ya se cerro en EPIC 0 y no queriamos redefinirlo dentro del motor

Para que sirve:

- centraliza el mapeo `mood -> genre_ids principales`
- da una funcion unica para consultar si una pelicula encaja con un mood

Donde se usa:

- en `puntuacion.py`
- en `seleccion.py`

Funciones:

- `generos_principales_para_mood`
  - por que: necesitamos recuperar rapido los generos principales de un mood
  - para que: alimentar el scoring del motor
  - donde: `puntuacion.py`

- `coincide_con_mood`
  - por que: necesitamos una comprobacion booleana simple de encaje con el mood
  - para que: usarla como criterio auxiliar en la seleccion final
  - donde: `seleccion.py`

### 3. `backend/app/motor/catalogo.py`

Por que lo usamos:

- porque leer SQLite y preparar peliculas es una responsabilidad distinta de Flask o del scoring

Para que sirve:

- cargar el catalogo local
- agrupar providers por pelicula
- decodificar `genre_ids`
- devolver peliculas con el shape que el motor necesita

Donde se usa:

- en `backend/app/motor/motor.py`

Funciones:

- `_decode_genre_ids`
  - por que: en BD `genre_ids` vive serializado
  - para que: convertirlo a lista de enteros
  - donde: `cargar_catalogo_por_pais`

- `cargar_catalogo_por_pais`
  - por que: el catalogo depende del pais al cargar providers
  - para que: devolver una lista de peliculas preparadas para filtrar y puntuar
  - donde: `motor.py`

### 4. `backend/app/motor/filtros.py`

Por que lo usamos:

- porque queriamos separar las reglas de descarte y filtrado de la puntuacion

Para que sirve:

- aplicar filtros duros
- aplicar filtros estrictos de contexto
- construir la bolsa de exclusiones por `tmdb_id`

Donde se usa:

- en `motor.py`
- en `puntuacion.py`
- en `seleccion.py`

Funciones:

- `coincide_con_tiempo`
  - por que: tiempo afecta tanto a filtro como a score
  - para que: decidir si una peli encaja con `algo_rapido` o `tengo_tiempo`
  - donde: `puntuacion.py` y `filtrar_por_contexto_estricto`

- `coincide_con_epoca`
  - por que: epoca tambien afecta a filtro y score
  - para que: decidir si una peli encaja con `actual`, `moderna` o `clasica`
  - donde: `puntuacion.py` y `filtrar_por_contexto_estricto`

- `construir_tmdb_ids_excluidos`
  - por que: queriamos una sola bolsa de peliculas que no deben volver a salir
  - para que: unir `peliculas_vistas`, `peliculas_para_ver` y `peliculas_descartadas`
  - donde: `pasa_filtros_duros`

- `pasa_filtros_duros`
  - por que: el motor necesita decidir pronto si una candidata es viable o no
  - para que: aplicar providers, idioma, subtitulos, `no_rotundos` y exclusiones por `tmdb_id`
  - donde: `filtrar_candidatas`

- `filtrar_candidatas`
  - por que: queriamos reducir el catalogo a un conjunto viable antes de puntuar
  - para que: quedarnos solo con candidatas validas
  - donde: `motor.py`

- `filtrar_por_contexto_estricto`
  - por que: tiempo y epoca deben apretar primero y relajarse solo si hace falta
  - para que: generar un subconjunto estricto antes de seleccionar
  - donde: `seleccion.py`

### 5. `backend/app/motor/puntuacion.py`

Por que lo usamos:

- porque despues de filtrar todavia hay que ordenar las candidatas segun el contexto de sesion

Para que sirve:

- calcular una puntuacion determinista por pelicula
- usar de verdad el `mood` con el mapeo de generos de EPIC 0

Donde se usa:

- en `backend/app/motor/seleccion.py`

Funciones:

- `puntuar_pelicula`
  - por que: hacia falta una funcion unica de ranking, legible y testeable
  - para que:
    - sumar por idioma comodo
    - sumar por plataforma elegida
    - sumar por disponibilidad `flatrate`
    - empujar fuerte cuando el `mood` coincide por `genre_ids`
    - sumar por tiempo, epoca, energia y `seguro_o_descubrir`
  - donde: `seleccion.py`

### 6. `backend/app/motor/seleccion.py`

Por que lo usamos:

- porque queriamos separar ranking y construccion de salida de la fase de filtros

Para que sirve:

- decidir si usar conjunto estricto o relajado
- ordenar candidatas
- construir `lista_corta`
- devolver `seleccion_final`

Donde se usa:

- en `backend/app/motor/motor.py`

Funciones:

- `_serializar_pelicula`
  - por que: la API no necesita devolver toda la estructura interna del motor
  - para que: limitar la salida a los campos que consume frontend
  - donde: dentro de `construir_salida_motor`

- `construir_salida_motor`
  - por que: el motor necesitaba una funcion clara para montar la salida final
  - para que:
    - priorizar el conjunto estricto si hay suficientes candidatas
    - ordenar por score
    - producir `candidatas_filtradas`, `lista_corta` y `seleccion_final`
  - donde: `motor.py`

### 7. `backend/app/motor/motor.py`

Por que lo usamos:

- porque queriamos un unico punto de entrada al motor, facil de llamar y de testear

Para que sirve:

- orquestar catalogo, filtros y seleccion

Donde se usa:

- en `backend/app/session_routes.py`

Funciones:

- `recomendar_peliculas`
  - por que: hace falta una funcion principal del motor
  - para que:
    - cargar catalogo del pais
    - filtrar candidatas
    - delegar la salida final
  - donde: `session_routes.py`

### 8. `backend/app/session_routes.py`

Por que lo usamos:

- porque Flask sigue necesitando un endpoint HTTP, pero ya no queriamos meter ahi la logica del motor

Para que sirve:

- actuar como adaptador entre request HTTP y motor

Donde se usa:

- se registra en `backend/app/__init__.py`

Funciones:

- `_contexto_perfil_para_peticion`
  - por que: el endpoint necesita recuperar usuario y perfil si existe
  - para que: obtener el perfil del usuario o defaults si no hay login
  - donde: `recommend_session`

- `recommend_session`
  - por que: es la ruta real `POST /api/session/recommend`
  - para que:
    - leer el JSON
    - normalizar sesion
    - normalizar perfil
    - llamar al motor
    - devolver `items`
  - donde: la usa frontend via `postSessionRecommend`

### 9. Limpieza de `reason` en frontend y backend

Por que lo quitamos:

- porque el equipo decidio dejar IA y explicaciones visibles para mas adelante

Para que sirvio:

- simplificar el contrato del endpoint
- simplificar las cards y el modal de resultados
- evitar invertir tiempo ahora en una capa que no forma parte del MVP del motor determinista

Donde se toco:

- `backend/app/session_routes.py`
- `frontend/pages/SessionScreen.jsx`
- `frontend/css/SessionScreen.css`

## Que no se ha implementado todavia

Importante:

- el motor ya sabe leer `peliculas_vistas`, `peliculas_para_ver` y `peliculas_descartadas`
- pero la pantalla de sesion todavia no persiste esas acciones al backend
- los botones `Ver luego`, `Ya la he visto` y `No me interesa` siguen en `TODO`
- las valoraciones con estrellitas todavia no se guardan

## Verificacion hecha en esta sesion

- backend compila con `compileall`
- `POST /api/session/recommend` responde `200`
- el endpoint devuelve `items` con el shape esperado
- una pelicula deja de salir si su `tmdb_id` entra en `peliculas_vistas`
- una pelicula deja de salir si su `tmdb_id` entra en `peliculas_para_ver`
- el frontend hace `npm run build` correctamente

## Objetivo hasta el lunes

Llegar al lunes con esto resuelto:

- las acciones de las cards de resultados ya persisten memoria real
- la siguiente busqueda ya respeta esa memoria sin depender de mocks manuales
- tenemos tests basicos del motor y de la persistencia
- el equipo puede entrar en la siguiente iteracion con menos deuda y menos incertidumbre

## Reparto para 4 personas

### Persona 1 · Backend persistencia de memoria

Objetivo:

- dejar listo el backend para guardar acciones sobre peliculas desde sesion

Que hacer:

- decidir si usamos `PATCH /api/profile` o endpoints mas especificos
- implementar helpers de escritura sobre:
  - `historial`
  - `ver_luego`
  - `titulos_descartados`
- garantizar que trabajen por `tmdb_id`
- evitar duplicados
- decidir reglas de convivencia:
  - si una peli pasa a `historial`, ¿sale de `ver_luego`?
  - si una peli pasa a `titulos_descartados`, ¿sale de `ver_luego`?

Archivos probables:

- `backend/app/user/user_profile_model.py`
- `backend/app/user/profile_routes.py`
- o endpoints nuevos si el equipo prefiere separarlo

Entrega esperada:

- endpoints o patches listos para que frontend persista memoria real

### Persona 2 · Frontend acciones de resultados

Objetivo:

- conectar los botones de las cards con el backend real

Que hacer:

- reemplazar los `TODO` de:
  - `handleSave`
  - `handleSeen`
  - `handleDismiss`
  - `handleRate`
- llamar al backend tras cada accion
- decidir si la UI sera optimista o conservadora
- manejar errores visuales si falla la persistencia

Archivos probables:

- `frontend/pages/SessionScreen.jsx`
- `frontend/src/lib/api.js`

Entrega esperada:

- las acciones del usuario ya escriben memoria real

### Persona 3 · Tests y validacion del motor

Objetivo:

- que no avancemos a ciegas con el motor

Que hacer:

- crear pruebas basicas de:
  - exclusión por `peliculas_vistas`
  - exclusión por `peliculas_para_ver`
  - exclusión por `peliculas_descartadas`
  - filtrado por `no_rotundos`
  - comportamiento por `mood`
  - fallback cuando no hay suficientes candidatas estrictas
- crear un pequeño set de escenarios manuales compartidos para demos internas

Archivos probables:

- carpeta de tests backend si se abre ahora
- o script temporal de smoke si el equipo aun no tiene infraestructura de tests formal

Entrega esperada:

- base mínima de confianza sobre el motor

### Persona 4 · QA funcional, documentacion y audit prep

Objetivo:

- que el equipo no pierda tiempo la semana que viene redescubriendo decisiones

Que hacer:

- validar manualmente los flujos principales
- revisar si el documento de contrato y este documento siguen alineados con el codigo
- listar deuda real detectada en frontend y backend para el futuro audit
- preparar backlog claro para:
  - `valoraciones_vistas`
  - aprendizaje a partir de feedback
  - IA posterior

Archivos probables:

- `docs/contracts/epic-4-motor-determinista-mvp.md`
- `docs/epic-4-motor-explicado-y-plan.md`
- notas de audit si el equipo abre una nueva doc

Entrega esperada:

- checklist clara de QA y backlog util para la siguiente sesion

## Recomendacion de orden

Para no bloquearos entre vosotros, yo seguiria este orden:

1. Persona 1 cierra contrato de persistencia backend
2. Persona 2 conecta frontend contra ese contrato
3. Persona 3 prueba motor y persistencia en paralelo
4. Persona 4 documenta decisiones, valida y prepara backlog

## Cierre operativo sugerido para el lunes

Si el lunes se cumple esto, vamos muy bien:

- recomendar una peli
- marcarla como `Ver luego`, `Ya la he visto` o `No me interesa`
- lanzar nueva busqueda
- comprobar que ya no vuelve a salir

Ese seria el cierre minimo bueno de esta siguiente tanda.
