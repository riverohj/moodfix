from __future__ import annotations

from typing import Any


def coincide_con_tiempo(movie: dict[str, Any], preference: str | None) -> bool:
    runtime = movie.get("runtime")
    if runtime is None or preference is None:
        return True
    if preference == "algo_rapido":
        return runtime < 90
    if preference == "tengo_tiempo":
        return runtime >= 90
    return True


def coincide_con_epoca(movie: dict[str, Any], preference: str | None) -> bool:
    release_year = movie.get("release_year")
    if release_year is None or preference is None:
        return True
    if preference == "actual":
        return release_year >= 2015
    if preference == "moderna":
        return 1990 <= release_year < 2015
    if preference == "clasica":
        return release_year < 1990
    return True


def construir_tmdb_ids_excluidos(perfil_estable: dict[str, Any]) -> set[int]:
    return set(perfil_estable["peliculas_vistas"]) | set(perfil_estable["peliculas_para_ver"]) | set(
        perfil_estable["peliculas_descartadas"]
    )


def pasa_filtros_duros(movie: dict[str, Any], perfil_estable: dict[str, Any]) -> bool:
    if not movie["providers"]:
        return False

    provider_ids = {provider["provider_id"] for provider in movie["providers"]}
    selected_providers = set(perfil_estable["plataformas"])
    if selected_providers and provider_ids.isdisjoint(selected_providers):
        return False

    comfortable_languages = perfil_estable["idiomas_comodos"]
    if (
        perfil_estable["tolerancia_subtitulos"] == "no"
        and comfortable_languages
        and movie.get("original_language") not in comfortable_languages
    ):
        return False

    blocked_genres = set(perfil_estable["no_rotundos"])
    movie_genres = set(movie.get("genre_ids") or [])
    if blocked_genres and movie_genres and not blocked_genres.isdisjoint(movie_genres):
        return False

    if movie.get("tmdb_id") in construir_tmdb_ids_excluidos(perfil_estable):
        return False

    return True


def filtrar_candidatas(catalogo: list[dict[str, Any]], perfil_estable: dict[str, Any]) -> list[dict[str, Any]]:
    return [movie for movie in catalogo if pasa_filtros_duros(movie, perfil_estable)]


def filtrar_por_contexto_estricto(
    candidatas: list[dict[str, Any]],
    sesion_actual: dict[str, Any],
) -> list[dict[str, Any]]:
    return [
        movie
        for movie in candidatas
        if coincide_con_tiempo(movie, sesion_actual.get("preferencia_tiempo"))
        and coincide_con_epoca(movie, sesion_actual.get("preferencia_epoca"))
    ]
