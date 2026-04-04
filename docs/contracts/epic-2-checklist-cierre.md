# EPIC 2 Checklist de Cierre

## Definicion

Este documento resume lo minimo que debe verificarse antes de dar EPIC 2 por cerrado. Su funcion es evitar que el equipo confunda "rama abierta" o "maqueta avanzada" con "onboarding estable validado".

## Checklist

- el alcance del onboarding MVP queda congelado con `pais`, `plataformas`, `idiomas_comodos`, `tolerancia_subtitulos` y `no_rotundos`
- `historial`, `ver_luego` y `titulos_descartados` quedan fuera del onboarding MVP aunque sigan existiendo en la estructura del perfil
- peliculas favoritas, autocomplete TMDb y logica de cluster quedan fuera de EPIC 2
- navbar, footer, cajon de navegacion, home final, historico y favoritos quedan fuera de EPIC 2 y pasan a EPIC 3
- la memoria interna que use historico o favoritos para enriquecer el prompt del top 3 queda fuera de EPIC 2 y pasa a EPIC 3
- la rama `epic-2-2.1-user_prifile_model` queda revisada, aprobada y mergeada en `main`
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` y `POST /api/auth/logout` responden correctamente
- `GET /api/profile`, `PUT /api/profile`, `PATCH /api/profile` y `POST /api/profile/skip` responden correctamente
- `GET /api/profile` devuelve `401` sin autenticacion
- `PATCH /api/profile` permite guardar pasos parciales del onboarding
- `POST /api/profile/skip` marca correctamente `onboarding_skipped = true`
- el perfil estable persiste tras cerrar y abrir sesion
- frontend y backend comparten el mismo shape de datos para el perfil
- Lourdes puede completar la integracion del onboarding sin inventar contratos fuera de `docs/contracts/`
- queda claro para el equipo que el handoff guest -> autenticado de preguntas de sesion no forma parte de EPIC 2 y pasa a EPIC 3
- al hacer skip o completar onboarding, el usuario sale del flujo de forma consistente aunque la home final del producto aun no este implementada

## Cierre operativo

EPIC 2 no debe marcarse como cerrado solo porque existan endpoints de auth y perfil. Debe marcarse como cerrado cuando el flujo real de registro o login, onboarding con skip, persistencia minima y re-edicion posterior funcione de extremo a extremo entre frontend y backend.

## Resultado pendiente

- pendiente validar el flujo extremo a extremo con frontend real
- pendiente decidir el orden visible exacto de las preguntas del onboarding
- pendiente confirmar si el onboarding se muestra justo tras login o puede reabrirse mas tarde desde perfil
- pendiente acordar la salida minima tras skip o finalizacion, sabiendo que la shell completa y la home final pasan a EPIC 3
