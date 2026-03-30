# EPIC 1 API Key Contract

## Definicion

Este documento deja cerrado el contrato de credenciales para integracion con la API externa del MVP. Su funcion es definir que credencial existe, para que sirve cada una y como debe usarse de forma clara y consistente.

## Credenciales disponibles

### Token de acceso de lectura a la API

- Nombre tecnico: `TMDB_READ_ACCESS_TOKEN`
- Tipo: token Bearer de lectura
- Uso principal: autenticacion en requests HTTP usando el header `Authorization`
- Valor:

```txt
definir_en_variable_de_entorno
```

### Clave de la API

- Nombre tecnico: `TMDB_API_KEY`
- Tipo: API key
- Uso principal: autenticacion simple por query param cuando aplique
- Valor:

```txt
definir_en_variable_de_entorno
```

## Regla general

Para el MVP se define una unica fuente de verdad para credenciales de TMDb. El equipo puede disponer de dos formatos de autenticacion, pero debe priorizarse el token de lectura como opcion principal.

## Reglas de uso

- se debe priorizar `TMDB_READ_ACCESS_TOKEN` para llamadas server to server
- `TMDB_API_KEY` queda disponible como credencial complementaria o para compatibilidad
- no se deben hardcodear estas credenciales directamente en componentes de frontend visibles al usuario
- las credenciales deben almacenarse como variables de entorno
- no se deben registrar en logs, capturas, commits ni errores expuestos al cliente

## Implementacion recomendada

### Variables de entorno sugeridas

- `TMDB_READ_ACCESS_TOKEN`
- `TMDB_API_KEY`

### Ejemplo con token Bearer

```bash
curl --request GET \
  --url 'https://api.themoviedb.org/3/movie/popular?language=es-ES&page=1' \
  --header 'Authorization: Bearer TMDB_READ_ACCESS_TOKEN' \
  --header 'accept: application/json'
```

### Ejemplo con API key

```bash
curl --request GET \
  --url 'https://api.themoviedb.org/3/movie/popular?api_key=TMDB_API_KEY&language=es-ES&page=1' \
  --header 'accept: application/json'
```

## Criterio de integracion

Se considera correcta la integracion cuando:

- la aplicacion puede autenticarse contra TMDb con el token de lectura
- la API key queda documentada y disponible como respaldo
- las credenciales viven fuera del codigo fuente sensible del frontend
- el equipo entiende cual credencial usar y en que contexto

## Riesgos y precauciones

- si estas credenciales se publican en repositorios abiertos, deben rotarse
- si se usan directamente en frontend sin proteccion, pueden quedar expuestas
- si hay dudas entre ambas opciones, debe usarse primero el token de lectura
- no deben dejarse valores reales en archivos `.md`, commits ni capturas compartidas

## Estado

Queda cerrado para el MVP que la integracion con TMDb contara con un token de lectura y una API key documentados en este contrato, priorizando el token como mecanismo principal de autenticacion.
