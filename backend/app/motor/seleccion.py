from __future__ import annotations

from typing import Any

from .filtros import filtrar_por_contexto_estricto
from .moods import coincide_con_mood
from .puntuacion import puntuar_pelicula


def _serializar_pelicula(movie: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": movie["id"],
        "tmdb_id": movie["tmdb_id"],
        "title": movie["title"],
        "poster_path": movie["poster_path"],
        "runtime": movie["runtime"],
        "release_year": movie["release_year"],
        "original_language": movie["original_language"],
        "overview": movie["overview"],
        "providers": movie["providers"],
    }


def construir_salida_motor(
    candidatas: list[dict[str, Any]],
    perfil_estable: dict[str, Any],
    sesion_actual: dict[str, Any],
) -> dict[str, list[dict[str, Any]]]:
    candidatas_estrictas = filtrar_por_contexto_estricto(candidatas, sesion_actual)
    conjunto_activo = candidatas_estrictas if len(candidatas_estrictas) >= 3 else candidatas

    ranked = sorted(
        conjunto_activo,
        key=lambda movie: (
            puntuar_pelicula(movie, perfil_estable, sesion_actual),
            1 if coincide_con_mood(movie, sesion_actual.get("mood")) else 0,
            movie.get("vote_count") or 0,
            movie.get("popularity") or 0,
            movie.get("tmdb_id") or 0,
        ),
        reverse=True,
    )

    lista_corta = [_serializar_pelicula(movie) for movie in ranked[:10]]
    seleccion_final = lista_corta[:3]

    return {
        "candidatas_filtradas": [_serializar_pelicula(movie) for movie in candidatas],
        "lista_corta": lista_corta,
        "seleccion_final": seleccion_final,
    }
