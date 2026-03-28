# EPIC 0 Profile Signals Contract

## Definicion

Este documento define las señales estables del perfil del usuario. Su funcion es cerrar que memoria debe guardar el sistema, que campos son obligatorios u opcionales y como se usan despues en recomendacion.

## Variables de perfil

### Country

- Nombre visible: `Pais`
- Nombre tecnico: `country`
- Tipo: string o codigo de pais
- Origen: input usuario
- Uso en motor: filtro duro de disponibilidad regional
- Persistencia: si
- Obligatorio: pendiente de cierre

### Platforms

- Nombre visible: `Plataformas que usa`
- Nombre tecnico: `platforms`
- Tipo: lista
- Origen: input usuario
- Uso en motor: filtro duro de disponibilidad por proveedor
- Persistencia: si
- Obligatorio: pendiente de cierre

### Comfortable languages

- Nombre visible: `Idiomas en los que ve cine comodo`
- Nombre tecnico: `comfortable_languages`
- Tipo: lista
- Origen: input usuario
- Uso en motor: filtro duro o casi duro por barrera de idioma
- Persistencia: si
- Obligatorio: pendiente de cierre

### Subtitle tolerance

- Nombre visible: `Tolerancia a subtitulos`
- Nombre tecnico: `subtitle_tolerance`
- Tipo: enumeracion
- Valores permitidos sugeridos: `yes`, `depends`, `no`
- Origen: input usuario
- Uso en motor: filtro duro o casi duro combinado con idioma
- Persistencia: si
- Obligatorio: pendiente de cierre

### Safe vs discover

- Nombre visible: `Ir a lo seguro` / `Descubrir`
- Nombre tecnico: `safe_vs_discover`
- Tipo: enumeracion
- Valores permitidos sugeridos: `safe`, `discover`
- Origen: input usuario
- Uso en motor: ranking, no filtro duro
- Persistencia: si
- Obligatorio: pendiente de cierre

### Hard nos

- Nombre visible: `Lineas rojas`
- Nombre tecnico: `hard_nos`
- Tipo: lista
- Origen: input usuario
- Uso en motor: filtro duro
- Persistencia: si
- Obligatorio: no

### Disliked titles

- Nombre visible: `Peliculas rechazadas`
- Nombre tecnico: `disliked_titles`
- Tipo: lista de peliculas
- Origen: interaccion usuario
- Uso en motor: filtro duro o penalizacion fuerte
- Persistencia: si
- Obligatorio: no

### Watch later

- Nombre visible: `Ver luego`
- Nombre tecnico: `watch_later`
- Tipo: lista de peliculas
- Origen: interaccion usuario
- Uso en motor: señal positiva de afinidad
- Persistencia: si
- Obligatorio: no

### History

- Nombre visible: `Historial`
- Nombre tecnico: `history`
- Tipo: lista de peliculas o eventos
- Origen: interaccion usuario
- Uso en motor: evitar repeticiones y detectar patrones basicos
- Persistencia: si
- Obligatorio: no

## Puntos pendientes de cierre

- que campos del perfil son obligatorios en onboarding
- que defaults se aplican si el usuario hace skip
- formato exacto de `country`
- formato exacto de `platforms`
- modelado final de `hard_nos`

