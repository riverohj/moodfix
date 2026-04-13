from __future__ import annotations

MOODS_A_GENEROS_PRINCIPALES = {
    "acelerar_corazon": (28, 53),
    "resuelve_un_crimen": (9648, 80),
    "peliculas_emocionales": (18, 10749),
    "pasar_un_buen_rato": (35, 10751),
    "historias_que_inspiran": (18, 12),
    "descubre_el_mundo": (99,),
}


def generos_principales_para_mood(mood: str | None) -> tuple[int, ...]:
    if mood is None:
        return ()
    return MOODS_A_GENEROS_PRINCIPALES.get(mood, ())


def coincide_con_mood(movie: dict, mood: str | None) -> bool:
    if mood is None:
        return True

    movie_genres = set(movie.get("genre_ids") or [])
    mood_genres = set(generos_principales_para_mood(mood))
    if not mood_genres:
        return True
    return not movie_genres.isdisjoint(mood_genres)
