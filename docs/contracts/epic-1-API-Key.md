# EPIC 1 API Key Contract

## Definicion

Este documento deja cerrado el contrato de credenciales para integracion con TMDb durante el MVP. Su funcion es definir que credenciales existen, cual usa hoy el proyecto y como deben manejarse sin exponer secretos.

## Credenciales disponibles

### Clave de la API

- Nombre tecnico: `TMDB_API_KEY`
- Tipo: API key
- Uso actual: autenticacion principal de la implementacion de EPIC 1
- Valor:

```txt
definir_en_variable_de_entorno
```

### Token de acceso de lectura

- Nombre tecnico: `TMDB_READ_ACCESS_TOKEN`
- Tipo: token Bearer de lectura
- Uso actual: alternativa documentada para futuras integraciones server to server
- Valor:

```txt
definir_en_variable_de_entorno
```

## Regla general

Para el MVP, la fuente de verdad operativa es la implementacion real del proyecto. Ahora mismo esa implementacion usa `TMDB_API_KEY` como mecanismo principal de autenticacion.

## Diferencia sencilla entre API key y Bearer token

- `TMDB_API_KEY`: se envia normalmente como query param en la URL. Es simple de probar y muy comoda para scripts pequenos.
- `TMDB_READ_ACCESS_TOKEN`: se envia en el header `Authorization: Bearer ...`. Suele ser una opcion mas limpia para integraciones backend mas formales.

Ambas credenciales sirven para autenticarse contra TMDb. La diferencia importante para el equipo es operativa: hoy el codigo de ingestión usa API key.

## Reglas de uso

- la implementacion actual del MVP usa `TMDB_API_KEY`
- `TMDB_READ_ACCESS_TOKEN` queda documentado como alternativa valida
- no se deben hardcodear estas credenciales en frontend visible al usuario
- las credenciales deben almacenarse como variables de entorno
- no se deben registrar en logs, capturas, commits ni errores expuestos al cliente

## Variables de entorno sugeridas

- `TMDB_API_KEY`
- `TMDB_READ_ACCESS_TOKEN`

## Ejemplo actual con API key

```bash
curl --request GET \
  --url 'https://api.themoviedb.org/3/movie/popular?api_key=TMDB_API_KEY&language=es-ES&page=1' \
  --header 'accept: application/json'
```

## Ejemplo alternativo con Bearer token

```bash
curl --request GET \
  --url 'https://api.themoviedb.org/3/movie/popular?language=es-ES&page=1' \
  --header 'Authorization: Bearer TMDB_READ_ACCESS_TOKEN' \
  --header 'accept: application/json'
```

## Criterio de integracion

Se considera correcta la integracion cuando:

- la aplicacion puede autenticarse contra TMDb con `TMDB_API_KEY`
- el Bearer token queda documentado y disponible como alternativa
- las credenciales viven fuera del codigo fuente sensible del frontend
- el equipo entiende cual credencial usa hoy el proyecto y cual queda como alternativa

## Riesgos y precauciones

- si estas credenciales se publican en repositorios abiertos, deben rotarse
- si se usan directamente en frontend sin proteccion, pueden quedar expuestas
- no deben dejarse valores reales en archivos `.md`, commits ni capturas compartidas

## Estado

Queda cerrado para el MVP que la integracion con TMDb usa `TMDB_API_KEY` como mecanismo principal de autenticacion y mantiene `TMDB_READ_ACCESS_TOKEN` como alternativa documentada.
