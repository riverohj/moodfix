# EPIC 0 Profile Signals Contract

## Definicion

Este documento define las señales estables del perfil del usuario. Su funcion es cerrar que memoria debe guardar el sistema, que campos son obligatorios u opcionales y como se usan despues en recomendacion.

## Variables de perfil

### Pais

- Nombre visible: `Pais`
- Nombre tecnico: `pais`
- Tipo: string o codigo de pais
- Origen: input usuario
- Uso en motor: filtro duro de disponibilidad regional
- Persistencia: si
- Obligatorio: no
- Formato cerrado: `ISO 3166-1 alpha-2`

### Plataformas

- Nombre visible: `Plataformas que usa`
- Nombre tecnico: `plataformas`
- Tipo: lista
- Origen: input usuario
- Uso en motor: filtro duro de disponibilidad por proveedor
- Persistencia: si
- Obligatorio: no
- Nota de modelado: deben guardarse con un identificador estable y vinculable a proveedores de TMDb, no solo como texto libre
- Regla cerrada:
  - la fuente de verdad interna sera `provider_id` de TMDb
  - si `plataformas = []`, no se aplica filtro de plataforma y el motor trabaja con todas las plataformas disponibles

### Idiomas comodos

- Nombre visible: `Idiomas en los que ve cine comodo`
- Nombre tecnico: `idiomas_comodos`
- Tipo: lista
- Origen: input usuario
- Uso en motor: filtro duro o casi duro por barrera de idioma
- Persistencia: si
- Obligatorio: no

### Tolerancia a subtitulos

- Nombre visible: `Tolerancia a subtitulos`
- Nombre tecnico: `tolerancia_subtitulos`
- Tipo: enumeracion
- Valores permitidos cerrados: `si`, `no`
- Origen: input usuario
- Uso en motor: filtro duro o casi duro combinado con idioma
- Persistencia: si
- Obligatorio: no

### No rotundos

- Nombre visible: `Lineas rojas`
- Nombre tecnico: `no_rotundos`
- Tipo: lista
- Origen: input usuario
- Uso en motor: filtro duro
- Persistencia: si
- Obligatorio: no
- Nota de modelado: en MVP se recomienda modelarlo como lista de `genre_id` de TMDb para mantenerlo simple y auditable

### Titulos descartados

- Nombre visible: `Peliculas rechazadas`
- Nombre tecnico: `titulos_descartados`
- Tipo: lista de peliculas
- Origen: interaccion usuario
- Uso en motor: filtro duro o penalizacion fuerte
- Persistencia: si
- Obligatorio: no

### Ver luego

- Nombre visible: `Ver luego`
- Nombre tecnico: `ver_luego`
- Tipo: lista de peliculas
- Origen: interaccion usuario
- Uso en motor: señal positiva de afinidad
- Persistencia: si
- Obligatorio: no

### Historial

- Nombre visible: `Historial`
- Nombre tecnico: `historial`
- Tipo: lista de peliculas o eventos
- Origen: interaccion usuario
- Uso en motor: evitar repeticiones y detectar patrones basicos
- Persistencia: si
- Obligatorio: no

## Estado

Las senales estables del perfil quedan cerradas para MVP con onboarding completamente opcional.
