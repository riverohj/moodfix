# EPIC 1 Credenciales TMDb

## Definicion

Este documento deja cerrado el contrato de credenciales para integracion con TMDb durante el MVP. Su funcion es definir que credencial usa hoy el proyecto, como debe configurarse y que diferencia practica hay frente al formato de API key.

## Credencial soportada

### Token de acceso de lectura

- Nombre tecnico: `TMDB_READ_ACCESS_TOKEN`
- Tipo: token Bearer de lectura
- Uso actual: autenticacion principal de la implementacion de EPIC 1
- Valor:

```txt
definir_en_variable_de_entorno
```

## Regla general

Para el MVP, la fuente de verdad operativa es la implementacion real del proyecto. Ahora mismo esa implementacion usa solo `TMDB_READ_ACCESS_TOKEN` como mecanismo de autenticacion mediante header Bearer.

## Diferencia sencilla entre API key y Bearer token

- `TMDB_API_KEY`: se envia normalmente como query param en la URL. Es simple de probar y muy comoda para scripts pequenos.
- `TMDB_READ_ACCESS_TOKEN`: se envia en el header `Authorization: Bearer ...`. Suele ser una opcion mas limpia para integraciones backend mas formales.

Ambas credenciales sirven para autenticarse contra TMDb, pero MoodFix ha estandarizado solo Bearer para no mezclar formatos dentro del proyecto.

## Diferencia practica para el proyecto

- `TMDB_API_KEY` suele corresponder al flujo clasico de API v3 y viaja en la propia URL como `api_key=...`.
- `TMDB_READ_ACCESS_TOKEN` es un token de lectura pensado para enviarse como credencial HTTP en el header `Authorization`.
- Bearer no hace el secreto "mas seguro" por si solo, pero evita ensuciar URLs, logs y ejemplos con credenciales incrustadas en query params.
- En nuestro caso, Bearer reduce ademas un error comun: pegar un token de lectura de TMDb y tratarlo como si fuera una API key v3.
- Regla operativa del MVP: backend, scripts y ejemplos del proyecto usan solo Bearer.

## Reglas de uso

- la implementacion actual del MVP usa `TMDB_READ_ACCESS_TOKEN`
- el proyecto no depende de `TMDB_API_KEY`
- no se deben hardcodear estas credenciales en frontend visible al usuario
- las credenciales deben almacenarse como variables de entorno
- no se deben registrar en logs, capturas, commits ni errores expuestos al cliente

## Variables de entorno sugeridas

- `TMDB_READ_ACCESS_TOKEN`

## Ejemplo actual con Bearer token

```bash
curl --request GET \
  --url 'https://api.themoviedb.org/3/movie/popular?language=es-ES&page=1' \
  --header 'Authorization: Bearer TMDB_READ_ACCESS_TOKEN' \
  --header 'accept: application/json'
```

## Criterio de integracion

Se considera correcta la integracion cuando:

- la aplicacion puede autenticarse contra TMDb con `TMDB_READ_ACCESS_TOKEN`
- el proyecto no necesita `TMDB_API_KEY` para funcionar
- las credenciales viven fuera del codigo fuente sensible del frontend
- el equipo entiende que MoodFix usa Bearer como formato unico dentro del repo

## Riesgos y precauciones

- si estas credenciales se publican en repositorios abiertos, deben rotarse
- si se usan directamente en frontend sin proteccion, pueden quedar expuestas
- no deben dejarse valores reales en archivos `.md`, commits ni capturas compartidas

## Estado

Queda cerrado para el MVP que la integracion con TMDb usa `TMDB_READ_ACCESS_TOKEN` como formato unico de autenticacion dentro del proyecto.
