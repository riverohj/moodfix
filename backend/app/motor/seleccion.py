from __future__ import annotations

from typing import Any

from .filtros import filtrar_por_contexto_estricto
from .moods import coincide_con_mood
from .puntuacion import puntuar_pelicula


def _serializar_pelicula(pelicula: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": pelicula["id"],
        "tmdb_id": pelicula["tmdb_id"],
        "title": pelicula["title"],
        "poster_path": pelicula["poster_path"],
        "runtime": pelicula["runtime"],
        "release_year": pelicula["release_year"],
        "original_language": pelicula["original_language"],
        "overview": pelicula["overview"],
        "popularity": pelicula.get("popularity") or 0,
        "vote_count": pelicula.get("vote_count") or 0,
        "genre_ids": pelicula.get("genre_ids") or [],
        "providers": pelicula["providers"],
    }


def _ordenar_peliculas(
    peliculas: list[dict[str, Any]],
    perfil_estable: dict[str, Any],
    sesion_actual: dict[str, Any],
) -> list[dict[str, Any]]:
    return sorted(
        peliculas,
        key=lambda pelicula: (
            puntuar_pelicula(pelicula, perfil_estable, sesion_actual),
            1 if coincide_con_mood(pelicula, sesion_actual.get("mood")) else 0,
            pelicula.get("vote_count") or 0,
            pelicula.get("popularity") or 0,
            pelicula.get("tmdb_id") or 0,
        ),
        reverse=True,
    )


def construir_salida_motor(
    candidatas: list[dict[str, Any]],
    perfil_estable: dict[str, Any],
    sesion_actual: dict[str, Any],
) -> dict[str, list[dict[str, Any]]]:
    candidatas_estrictas = filtrar_por_contexto_estricto(candidatas, sesion_actual)
    peliculas_activas = candidatas_estrictas if len(candidatas_estrictas) >= 3 else candidatas
    peliculas_ordenadas = _ordenar_peliculas(peliculas_activas, perfil_estable, sesion_actual)

    lista_corta = [_serializar_pelicula(pelicula) for pelicula in peliculas_ordenadas[:10]]
    seleccion_final = lista_corta[:3]

    return {
        "candidatas_filtradas": [_serializar_pelicula(pelicula) for pelicula in candidatas],
        "lista_corta": lista_corta,
        "seleccion_final": seleccion_final,
    }
