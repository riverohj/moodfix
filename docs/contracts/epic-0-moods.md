# EPIC 0 Moods Contract

## Definicion

Este documento cierra el contrato de moods del MVP. Su funcion es definir que significa cada mood de forma visible para producto y util para el motor, sin depender solo del nombre comercial ni solo de los generos de TMDb.

## Regla general

En el MVP, un mood no es un genero unico. Es una intencion de experiencia que se aproxima con una combinacion de generos TMDb y reglas propias.

## Reglas de modelado

- un mood puede apoyarse en varios generos TMDb
- los generos no explican por si solos toda la semantica del mood
- si un genero es conflictivo, debe quedar marcado como secundario o condicionado
- si un mood es demasiado ambiguo, debe señalarse como riesgo y no darse por cerrado sin acuerdo del equipo

## Contrato por mood

### Acelerar corazon

- Nombre visible: `Acelerar corazon`
- Nombre tecnico: `accelerate_heart`
- Definicion: peliculas orientadas a tension, adrenalina o suspense alto.
- Generos TMDb principales: `28`, `53`
- Generos TMDb secundarios o condicionados: `27`
- Nombres de generos: Accion, Suspense, Terror
- Precauciones: Terror no debe dominar este mood si el usuario tiene `hard_nos` relacionados.
- Riesgos: si Terror se trata igual que Accion o Suspense, puede producir recomendaciones demasiado agresivas.

### Resuelve un crimen

- Nombre visible: `Resuelve un crimen`
- Nombre tecnico: `solve_a_crime`
- Definicion: peliculas orientadas a investigacion, misterio y crimen.
- Generos TMDb principales: `9648`, `80`
- Generos TMDb secundarios o condicionados: `53`
- Nombres de generos: Misterio, Crimen, Suspense
- Precauciones: el Suspense puede servir de apoyo, pero no debe desplazar el foco de investigacion.
- Riesgos: si el mood se define solo por Crimen, puede meter peliculas de mafia o violencia sin parte deductiva.

### Peliculas emocionales

- Nombre visible: `Peliculas emocionales`
- Nombre tecnico: `emotional_movies`
- Definicion: peliculas centradas en carga emocional, relaciones o impacto afectivo.
- Generos TMDb principales: `18`, `10749`
- Generos TMDb secundarios o condicionados: ninguno en esta primera version
- Nombres de generos: Drama, Romance
- Precauciones: no asumir que Romance es siempre obligatorio.
- Riesgos: puede quedarse algo estrecho si luego faltan candidatas, pero es defendible para MVP.

### Pasar un buen rato

- Nombre visible: `Pasar un buen rato`
- Nombre tecnico: `have_a_good_time`
- Definicion: peliculas ligeras, agradables o faciles de disfrutar.
- Generos TMDb principales: `35`
- Generos TMDb secundarios o condicionados: `16`, `10751`
- Nombres de generos: Comedia, Animacion, Familia
- Precauciones: no confundir este mood con contenido exclusivamente infantil.
- Riesgos: si Familia pesa demasiado, puede sesgar el resultado a cine familiar cuando el usuario no lo busca.

### Inspiracionales

- Nombre visible: `Inspiracionales`
- Nombre tecnico: `inspirational`
- Definicion: peliculas que dejan sensacion de impulso, superacion o admiracion.
- Generos TMDb principales: ninguno cerrado todavia como unica base suficiente
- Generos TMDb secundarios o condicionados: `12`, `36`, `10402`, `14`
- Nombres de generos: Aventura, Historia, Musica, Fantasia
- Precauciones: este mood no queda bien definido solo con genero TMDb.
- Riesgos: es el mood mas ambiguo del MVP y requiere criterio propio adicional para quedar bien cerrado.
- Estado: pendiente de cierre semantico final

### Entender el mundo

- Nombre visible: `Entender el mundo`
- Nombre tecnico: `understand_the_world`
- Definicion: peliculas con foco en comprension, contexto social, historico o reflexivo.
- Generos TMDb principales: `99`
- Generos TMDb secundarios o condicionados: `878`, `10752`, `37`
- Nombres de generos: Documental, Ciencia ficcion, Belica, Western
- Precauciones: `10770` no entra porque `Pelicula de TV` esta fuera del MVP.
- Riesgos: Ciencia ficcion, Belica y Western no son equivalentes directos de este mood; solo podrian entrar con reglas adicionales muy bien justificadas.
- Estado: pendiente de limpieza final

## Decisiones ya cerradas

- `Pelicula de TV (10770)` no entra en el MVP
- `Entender el puto mundo` no debe convivir con `Entender el mundo`; hay que usar un solo nombre visible final

## Puntos pendientes de cierre

- nombre visible final de `Entender el mundo`
- criterio adicional para `Inspiracionales`
- criterio adicional para `Entender el mundo`
- peso exacto de generos principales y secundarios
- posibles exclusiones por mood

