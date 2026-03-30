# EPIC 0 Taxonomia Interna

## Definicion

Este documento resume la taxonomia interna del MVP. Su funcion es concentrar en una sola vista la traduccion entre lenguaje visible de producto, variable interna y uso dentro del motor, para que frontend, backend, datos y Mood Radar hablen exactamente el mismo idioma.

## Tabla principal

| Pregunta o concepto visible | Variable interna | Valor interno | Uso en el motor |
|---|---|---|---|
| Sorprendeme | `modo_entrada` | `sorprendeme` | Define flujo sin preguntas adicionales |
| Preguntame | `modo_entrada` | `preguntame` | Define flujo con señales de sesion |
| Acelerar corazon | `mood` | `acelerar_corazon` | Orienta shortlist hacia `28`, `53` |
| Resuelve un crimen | `mood` | `resuelve_un_crimen` | Orienta shortlist hacia `9648`, `80` |
| Peliculas emocionales | `mood` | `peliculas_emocionales` | Orienta shortlist hacia `18`, `10749` |
| Pasar un buen rato | `mood` | `pasar_un_buen_rato` | Orienta shortlist hacia `35`, `10751` |
| Historias que inspiran | `mood` | `historias_que_inspiran` | Orienta shortlist hacia `18`, `12` |
| Descubre el mundo | `mood` | `descubre_el_mundo` | Orienta shortlist hacia `99` |
| Algo rapido | `preferencia_tiempo` | `algo_rapido` | Filtro duro o casi duro por `runtime < 90` |
| Tengo tiempo | `preferencia_tiempo` | `tengo_tiempo` | Filtro duro o casi duro por `runtime >= 90` |
| Ponmelo facil | `preferencia_energia` | `facil` | Ranking secundario: prioriza `runtime < 120` y `vote_average >= 6` |
| Acepto el reto | `preferencia_energia` | `reto` | Ranking secundario: prioriza `runtime >= 100` y `vote_average >= 7.2` |
| Ir a lo seguro | `seguro_o_descubrir` | `seguro` | Ranking: prioriza `vote_count >= 10000` |
| Descubrir | `seguro_o_descubrir` | `descubrir` | Ranking: prioriza `1000 <= vote_count < 10000` |
| Actual | `preferencia_epoca` | `actual` | Filtro duro o casi duro por `release_year >= 2015` |
| Moderna | `preferencia_epoca` | `moderna` | Filtro duro o casi duro por `1990 <= release_year < 2015` |
| Clasica | `preferencia_epoca` | `clasica` | Filtro duro o casi duro por `release_year < 1990` |
| Pais | `pais` | `ISO 3166-1 alpha-2` | Filtro duro por disponibilidad regional |
| Plataformas que usa | `plataformas` | lista de `provider_id` TMDb | Filtro duro por disponibilidad en proveedores |
| Idiomas en los que ve cine comodo | `idiomas_comodos` | lista de codigos de idioma | Filtro duro o casi duro por barrera de idioma |
| Tolerancia a subtitulos | `tolerancia_subtitulos` | `si`, `no` | Regla combinada con idioma |
| Lineas rojas | `no_rotundos` | lista de `genre_id` TMDb | Filtro duro |
| Peliculas rechazadas | `titulos_descartados` | lista de peliculas | Filtro duro o penalizacion fuerte |
| Ver luego | `ver_luego` | lista de peliculas | Señal positiva de afinidad |
| Historial | `historial` | lista de peliculas o eventos | Evita repeticiones y mejora coherencia |

## Regla de uso

Si alguna etiqueta visible cambia en producto o si alguna variable cambia en backend o motor, esta tabla debe actualizarse para mantener coherencia entre todo el equipo.

