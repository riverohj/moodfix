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

## Que no entra

- preguntas de sesion de `Sorprendeme` y `Preguntame`
- logica del motor de recomendacion final
- explicaciones generadas por IA
- aprendizaje avanzado o personalizacion compleja
- persistencia de perfil estable para usuario guest
- handoff de respuestas guest del MUT o de sesion antes del login

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

## Preguntas que previsiblemente habra que resolver

### Bloque 1 · Disponibilidad real

- pais
- plataformas

### Bloque 2 · Barrera de idioma

- idiomas comodos
- tolerancia a subtitulos

### Bloque 3 · Limites personales

- no rotundos

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

## Decisiones que habra que cerrar en EPIC 2

- en que orden exacto aparece cada pregunta
- si el onboarding se muestra al principio o se puede abrir despues
- donde se persiste el perfil en el MVP
- como se edita el perfil una vez creado
- que mensaje exacto se muestra cuando el usuario hace skip
- si `historial`, `ver_luego` y `titulos_descartados` entran ya en implementacion o se dejan solo como estructura preparada

## Definicion de hecho provisional

EPIC 2 podra darse por bien encaminado cuando:

- exista un contrato claro del onboarding estable
- el equipo sepa que datos guarda el perfil y con que nombres
- quede claro que el usuario puede saltarse preguntas sin romper el flujo
- frontend y backend compartan el mismo shape de datos del perfil
- quede clara la semantica de lectura y escritura del perfil desde frontend
