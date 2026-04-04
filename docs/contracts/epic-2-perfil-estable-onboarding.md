# EPIC 2 Perfil Estable y Onboarding con Skip

## Definicion

Este documento abre el contrato base de EPIC 2. Su funcion es definir que datos estables del usuario vamos a guardar, como se recogen con el menor roce posible y como se conectan con el motor sin meter friccion innecesaria.

## Objetivo

Persistir las señales estables minimas del usuario para mejorar la recomendacion sin obligarle a completar un onboarding largo ni bloquear la entrada al producto.

## Por que existe

EPIC 0 ya cerro que variables de perfil existen. EPIC 2 debe convertir esas definiciones en una experiencia real de onboarding con skip y en una persistencia minima util para el MVP.

## Que entra

- definir el flujo de onboarding estable con posibilidad de skip
- decidir el orden de preguntas del perfil estable
- definir que payload envia frontend al backend
- persistir en store o base de datos las señales estables minimas
- permitir volver a editar el perfil mas adelante
- dejar claro que el producto funciona aunque el perfil este incompleto
- dejar claro que el perfil estable empieza despues de autenticacion
- permitir una salida simple del onboarding cuando el usuario termina o hace skip, sin exigir aun una pantalla completa de producto

## Que no entra

- preguntas de sesion de `Sorprendeme` y `Preguntame`
- logica del motor de recomendacion final
- explicaciones generadas por IA
- aprendizaje avanzado o personalizacion compleja
- persistencia de perfil estable para usuario guest
- handoff de respuestas guest del MUT o de sesion antes del login
- shell completa de producto tras onboarding, incluyendo navbar, footer o cajon de navegacion
- pantalla de historico
- pantalla de favoritos o `ver_luego`
- uso de `historial`, `ver_luego` o favoritos como memoria interna para enriquecer el prompt que devuelve el top 3

## Variables estables que deben cubrirse

- `pais`
- `plataformas`
- `idiomas_comodos`
- `tolerancia_subtitulos`
- `no_rotundos`
- `historial`
- `ver_luego`
- `titulos_descartados`

## Principios del onboarding

- ningun campo es obligatorio en el MVP
- el usuario puede hacer skip sin bloquearse
- si el perfil esta incompleto, el producto debe advertir que la recomendacion sera menos precisa
- cuanto mas simple sea la captura inicial, mejor
- el perfil estable y su onboarding viven detras de login
- antes del login solo existen preguntas de sesion o moods

## Orden actual del onboarding MVP

### Bloque 1 · Disponibilidad real

1. pais
2. plataformas

### Bloque 2 · Barrera de idioma

3. idiomas comodos
4. tolerancia a subtitulos

### Bloque 3 · Limites personales

5. no rotundos

## Contrato minimo de datos

El frontend debera poder enviar un payload estable de perfil con claves tecnicas ya cerradas en EPIC 0.
Estos endpoints de perfil requieren usuario autenticado y no exponen un perfil `local` guest en MVP.
Si el usuario responde preguntas de sesion antes del login y se autentica justo antes del resultado, ese handoff debe resolverse en la capa de sesiones de un epic posterior.

Ejemplo conceptual:

```json
{
  "pais": "ES",
  "plataformas": [8, 119, 337],
  "idiomas_comodos": ["es", "en"],
  "tolerancia_subtitulos": "si",
  "no_rotundos": [27]
}
```

## Semantica API de perfil

- `GET /api/profile` devuelve el perfil estable del usuario autenticado
- `PUT /api/profile` reemplaza el perfil estable y resetea a defaults los campos omitidos
- `PATCH /api/profile` actualiza solo los campos enviados y mantiene el resto
- `POST /api/profile/skip` marca `onboarding_skipped = true` sobre el perfil autenticado
- para un onboarding por pasos, lo mas natural en frontend es usar `PATCH` durante la captura y `POST /api/profile/skip` cuando el usuario decide saltarlo

## Valores tecnicos que envia frontend

- `pais`: codigo `ISO 3166-1 alpha-2`, por ejemplo `ES`
- `plataformas`: lista de `provider_id` de TMDb, por ejemplo `8`, `119`, `337`
- `idiomas_comodos`: lista de codigos de idioma, por ejemplo `es`, `en`
- `tolerancia_subtitulos`: `si` o `no`
- `no_rotundos`: lista de `genre_id` de TMDb, por ejemplo `27`

## Congelacion MVP actual

- el onboarding visible de EPIC 2 queda congelado con `pais`, `plataformas`, `idiomas_comodos`, `tolerancia_subtitulos` y `no_rotundos`
- `historial`, `ver_luego` y `titulos_descartados` permanecen en la estructura del perfil, pero no forman parte del onboarding MVP
- peliculas favoritas, autocomplete contra TMDb y logica de cluster quedan fuera de EPIC 2
- la pantalla posterior al onboarding no tiene por que ser todavia la home final del producto; basta una salida minima y consistente del flujo
- navbar, footer, cajon de navegacion, historico, favoritos y la memoria interna basada en estos datos pasan a EPIC 3

## Estado operativo actual

- la UI de `login/signup` ya esta integrada sobre el flujo real de auth de EPIC 2
- al completar o saltar el onboarding, el usuario sale a una vista minima temporal y puede reabrir su perfil desde header
- la re-edicion del perfil existe dentro de EPIC 2, sin depender todavia de la shell completa de EPIC 3
- la rama aislada de auth que se abrio solo como maqueta visual fue retirada para evitar que el equipo abra PRs sobre una base vieja

## Decisiones que habra que cerrar en EPIC 2

- en que orden exacto aparece cada pregunta
- si el onboarding se muestra al principio o se puede abrir despues
- donde se persiste el perfil en el MVP
- como se edita el perfil una vez creado
- si hace falta pulir mas el copy final del flujo de skip y de la salida minima

## Definicion de hecho provisional

EPIC 2 podra darse por bien encaminado cuando:

- exista un contrato claro del onboarding estable
- el equipo sepa que datos guarda el perfil y con que nombres
- quede claro que el usuario puede saltarse preguntas sin romper el flujo
- frontend y backend compartan el mismo shape de datos del perfil
- quede clara la semantica de lectura y escritura del perfil desde frontend
- exista una entrada de auth visual conectada al backend real
- exista una salida minima consistente tras completar o saltar el onboarding
- quede documentado que historico, favoritos y memoria para mejorar el top 3 no se resuelven en EPIC 2
