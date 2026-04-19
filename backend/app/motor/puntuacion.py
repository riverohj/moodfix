from __future__ import annotations

from typing import Any

from .filtros import coincide_con_epoca, coincide_con_tiempo
from .moods import generos_principales_para_mood


def _sumar_puntaje_base(pelicula: dict[str, Any]) -> int:
    popularidad = pelicula.get("popularity") or 0
    votos = pelicula.get("vote_count") or 0
    return min(int(popularidad), 40) + min(votos // 100, 40)


def _sumar_puntaje_por_idioma(pelicula: dict[str, Any], perfil_estable: dict[str, Any]) -> int:
    if pelicula.get("original_language") in perfil_estable["idiomas_comodos"]:
        return 12
    return 0


def _sumar_puntaje_por_plataforma(pelicula: dict[str, Any], perfil_estable: dict[str, Any]) -> int:
    provider_ids = {provider["provider_id"] for provider in pelicula["providers"]}
    plataformas_elegidas = set(perfil_estable["plataformas"])
    puntaje = 0

    if plataformas_elegidas and not provider_ids.isdisjoint(plataformas_elegidas):
        puntaje += 18
    if any(provider["provider_type"] == "flatrate" for provider in pelicula["providers"]):
        puntaje += 8

    return puntaje


def _sumar_puntaje_por_mood(pelicula: dict[str, Any], sesion_actual: dict[str, Any]) -> int:
    mood = sesion_actual.get("mood")
    if mood is None:
        return 0

    generos_mood = set(generos_principales_para_mood(mood))
    generos_pelicula = set(pelicula.get("genre_ids") or [])
    coincidencias = len(generos_mood.intersection(generos_pelicula))

    if coincidencias:
        return 90 + (coincidencias * 20)
    return -40


def _sumar_puntaje_por_tiempo_y_epoca(
    pelicula: dict[str, Any],
    sesion_actual: dict[str, Any],
) -> int:
    puntaje = 0
    if coincide_con_tiempo(pelicula, sesion_actual.get("preferencia_tiempo")):
        puntaje += 20
    if coincide_con_epoca(pelicula, sesion_actual.get("preferencia_epoca")):
        puntaje += 18
    return puntaje


def _sumar_puntaje_por_energia(pelicula: dict[str, Any], sesion_actual: dict[str, Any]) -> int:
    runtime = pelicula.get("runtime") or 0
    energia = sesion_actual.get("preferencia_energia")

    if energia == "facil":
        if runtime and runtime < 100:
            return 16
        if runtime and runtime < 120:
            return 10

    if energia == "reto":
        if runtime >= 120:
            return 16
        if runtime >= 100:
            return 10

    return 0


def _sumar_puntaje_por_descubrimiento(
    pelicula: dict[str, Any],
    sesion_actual: dict[str, Any],
) -> int:
    votos = pelicula.get("vote_count") or 0
    descubrimiento = sesion_actual.get("seguro_o_descubrir")

    if descubrimiento == "seguro":
        if votos >= 10000:
            return 24
        if votos >= 5000:
            return 12

    if descubrimiento == "descubrir":
        if 1000 <= votos < 10000:
            return 24
        if 300 <= votos < 1000:
            return 10

    return 0


def puntuar_pelicula(
    pelicula: dict[str, Any],
    perfil_estable: dict[str, Any],
    sesion_actual: dict[str, Any],
) -> int:
    puntaje = 0
    puntaje += _sumar_puntaje_base(pelicula)
    puntaje += _sumar_puntaje_por_idioma(pelicula, perfil_estable)
    puntaje += _sumar_puntaje_por_plataforma(pelicula, perfil_estable)
    puntaje += _sumar_puntaje_por_mood(pelicula, sesion_actual)
    puntaje += _sumar_puntaje_por_tiempo_y_epoca(pelicula, sesion_actual)
    puntaje += _sumar_puntaje_por_energia(pelicula, sesion_actual)
    puntaje += _sumar_puntaje_por_descubrimiento(pelicula, sesion_actual)
    return puntaje
