# EPIC 0 Moods Contract

## Definicion

Este documento cierra el contrato de moods del MVP. Su funcion es definir que significa cada mood de forma visible para producto y util para el motor, sin depender solo del nombre comercial ni solo de los generos de TMDb.
Los moods son senales de sesion y pueden usarse sin login; no crean ni sustituyen el perfil estable del usuario.

## Regla general

En el MVP, un mood no es un genero unico. Es una intencion de experiencia que se aproxima con una combinacion de generos TMDb y reglas propias.

## Reglas de modelado

- para simplificar el MVP, cada mood debe tener uno o varios generos principales
- los generos principales son los que mejor representan el mood dentro del catalogo TMDb
- no se usaran puntuaciones complejas en esta primera version
- si un mood no puede anclarse de forma razonable a uno o varios generos principales, debe revisarse su nombre visible o su alcance

## Logica simplificada para el motor

- una pelicula puede entrar al mood si contiene al menos uno de sus generos principales
- si un mood tiene dos o mas generos principales, se pueden usar en logica `OR`
- no se plantea en esta version una logica de pesos por genero
- esta simplificacion prioriza claridad, rapidez de implementacion y explicabilidad en demo

## Criterio para elegir generos principales

Se priorizan generos que cumplan estas condiciones:

- aparecen de forma consistente en el catalogo TMDb
- se entienden bien por el usuario final
- ayudan a que el nombre visible y el resultado esperado se parezcan
- no obligan a derivaciones demasiado subjetivas para el MVP

## Contrato por mood

### Acelerar corazon

- Nombre visible: `Acelerar corazon`
- Nombre tecnico: `acelerar_corazon`
- Definicion: peliculas orientadas a tension, adrenalina o suspense alto.
- Generos TMDb principales: `28`, `53`
- Nombres de generos: Accion, Suspense
- Justificacion: son los generos mas directos y faciles de defender para tension y adrenalina.
- Precauciones: `27` no entra como principal para evitar que el mood se convierta en terror por defecto.
- Riesgos: si el catalogo es pequeno, puede faltar algo de variedad.

### Resuelve un crimen

- Nombre visible: `Resuelve un crimen`
- Nombre tecnico: `resuelve_un_crimen`
- Definicion: peliculas orientadas a investigacion, misterio y crimen.
- Generos TMDb principales: `9648`, `80`
- Nombres de generos: Misterio, Crimen
- Justificacion: son los generos mas claros para investigacion y delito.
- Precauciones: `53` no entra como principal para no abrir demasiado el mood.
- Riesgos: `80` a veces puede meter peliculas de crimen sin componente de investigacion.

### Peliculas emocionales

- Nombre visible: `Peliculas emocionales`
- Nombre tecnico: `peliculas_emocionales`
- Definicion: peliculas centradas en carga emocional, relaciones o impacto afectivo.
- Generos TMDb principales: `18`, `10749`
- Nombres de generos: Drama, Romance
- Justificacion: son los anclajes mas directos para impacto emocional.
- Precauciones: Drama deberia ser el ancla mas fuerte de los dos.
- Riesgos: puede sesgar demasiado hacia relaciones romanticas si no se vigila el catalogo.

### Pasar un buen rato

- Nombre visible: `Pasar un buen rato`
- Nombre tecnico: `pasar_un_buen_rato`
- Definicion: peliculas ligeras, agradables o faciles de disfrutar.
- Generos TMDb principales: `35`, `10751`
- Nombres de generos: Comedia, Familia
- Justificacion: son los generos mas consistentes para una experiencia ligera y amable.
- Precauciones: `16` no entra como principal para no convertir el mood en animacion por defecto.
- Riesgos: `10751` puede acercar demasiado el mood a cine familiar si no se revisa el catalogo.

### Historias que inspiran

- Nombre visible: `Historias que inspiran`
- Nombre visible descartado: `Inspirate`
- Nombre tecnico: `historias_que_inspiran`
- Definicion: peliculas que dejan sensacion de impulso, superacion o admiracion.
- Generos TMDb principales: `18`, `12`
- Nombres de generos: Drama, Aventura
- Justificacion: no existe un genero TMDb "inspiracional", pero Drama y Aventura sostienen mejor relatos de superacion, crecimiento e impulso sin solaparse con `Descubre el mundo`.
- Precauciones: `10402` puede funcionar como ampliacion futura, pero no como base inicial.
- Riesgos: sigue siendo un mood parcialmente editorial.

### Descubre el mundo

- Nombre visible: `Descubre el mundo`
- Nombre visible alternativo: `Mirar el mundo de otra forma`
- Nombre visible descartado: `Entender el mundo`
- Nombre tecnico: `descubre_el_mundo`
- Definicion: peliculas con foco en comprension, contexto social, historico o reflexivo.
- Generos TMDb principales: `99`
- Nombres de generos: Documental
- Justificacion: es el genero mas claro, defendible y menos ambiguo para este mood.
- Precauciones: `36`, `878`, `10752` y `37` salen de la base inicial para evitar ambiguedad excesiva.
- Riesgos: sigue siendo menos intuitivo que otros moods y el nombre visible importa mucho para alinear expectativa y resultado.

## Decisiones ya cerradas

- `Pelicula de TV (10770)` no entra en el MVP
- `Entender el puto mundo` no entra en el contrato final
- `Entender el mundo` queda descartado como nombre visible final
- `Historias que inspiran` y `Descubre el mundo` quedan como nombres visibles cerrados para MVP

## Estado

Los nombres visibles y los generos principales de los seis moods quedan cerrados para MVP.

## Recomendacion de nombres visibles

### Mas alineados con resultados esperables

- `Acelerar corazon`
- `Resuelve un crimen`
- `Peliculas emocionales`
- `Pasar un buen rato`
- `Historias que inspiran`
- `Descubre el mundo`

### Menos recomendables para MVP

- `Inspiracionales`
  - suena mas abstracto y menos natural como accion de usuario

- `Entender el mundo`
  - promete una profundidad que el catalogo por genero TMDb no siempre puede sostener

## Recomendacion final

Si quereis simplificar codigo y alinear mejor nombre visible con resultado, la mejor version MVP seria:

- `Acelerar corazon` -> `28`, `53`
- `Resuelve un crimen` -> `9648`, `80`
- `Peliculas emocionales` -> `18`, `10749`
- `Pasar un buen rato` -> `35`, `10751`
- `Historias que inspiran` -> `18`, `12`
- `Descubre el mundo` -> `99`
