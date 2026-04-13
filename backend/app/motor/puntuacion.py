from __future__ import annotations

from typing import Any

from .filtros import coincide_con_epoca, coincide_con_tiempo
from .moods import generos_principales_para_mood


def puntuar_pelicula(
    movie: dict[str, Any],
    perfil_estable: dict[str, Any],
    sesion_actual: dict[str, Any],
) -> int:
    score = 0
    runtime = movie.get("runtime") or 0
    vote_count = movie.get("vote_count") or 0
    popularity = movie.get("popularity") or 0

    score += min(int(popularity), 40)
    score += min(vote_count // 100, 40)

    if movie.get("original_language") in perfil_estable["idiomas_comodos"]:
        score += 12

    provider_ids = {provider["provider_id"] for provider in movie["providers"]}
    selected_providers = set(perfil_estable["plataformas"])
    if selected_providers and not provider_ids.isdisjoint(selected_providers):
        score += 18

    if any(provider["provider_type"] == "flatrate" for provider in movie["providers"]):
        score += 8

    mood = sesion_actual.get("mood")
    if mood is not None:
        mood_genres = set(generos_principales_para_mood(mood))
        movie_genres = set(movie.get("genre_ids") or [])
        mood_matches = len(mood_genres.intersection(movie_genres))
        if mood_matches:
            score += 90 + (mood_matches * 20)
        else:
            score -= 40

    if coincide_con_tiempo(movie, sesion_actual.get("preferencia_tiempo")):
        score += 20

    if coincide_con_epoca(movie, sesion_actual.get("preferencia_epoca")):
        score += 18

    energy = sesion_actual.get("preferencia_energia")
    if energy == "facil":
        if runtime and runtime < 100:
            score += 16
        elif runtime and runtime < 120:
            score += 10
    elif energy == "reto":
        if runtime >= 120:
            score += 16
        elif runtime >= 100:
            score += 10

    discovery = sesion_actual.get("seguro_o_descubrir")
    if discovery == "seguro":
        if vote_count >= 10000:
            score += 24
        elif vote_count >= 5000:
            score += 12
    elif discovery == "descubrir":
        if 1000 <= vote_count < 10000:
            score += 24
        elif 300 <= vote_count < 1000:
            score += 10

    return score
