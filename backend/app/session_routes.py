from __future__ import annotations

import json
import sqlite3
from typing import Any

from flask import Blueprint, jsonify

from .db import get_db_path
from .user.auth_model import AuthError, RequestValidationError, get_authenticated_user_from_request
from .user.request_utils import get_json_payload
from .user.user_profile_model import get_or_create_profile


session_api = Blueprint("session_api", __name__)

DEFAULT_PROFILE_CONTEXT = {
    "pais": "ES",
    "plataformas": [],
    "idiomas_comodos": ["es", "en"],
    "tolerancia_subtitulos": "si",
    "no_rotundos": [],
}

VALID_MODES = {"sorprendeme", "preguntame"}
VALID_MOODS = {
    "acelerar_corazon",
    "resuelve_un_crimen",
    "peliculas_emocionales",
    "pasar_un_buen_rato",
    "historias_que_inspiran",
    "descubre_el_mundo",
}
VALID_TIME_PREFERENCES = {"algo_rapido", "tengo_tiempo"}
VALID_ENERGY_PREFERENCES = {"facil", "reto"}
VALID_DISCOVERY_PREFERENCES = {"seguro", "descubrir"}
VALID_ERA_PREFERENCES = {"actual", "moderna", "clasica"}


def _ensure_list(value: Any, field_name: str) -> list[Any]:
    if value is None:
        return []
    if not isinstance(value, list):
        raise RequestValidationError(f"`{field_name}` debe enviarse como array.")
    return value


def _normalize_country_code(value: Any) -> str:
    if not isinstance(value, str) or len(value.strip()) != 2:
        return DEFAULT_PROFILE_CONTEXT["pais"]
    return value.strip().upper()


def _normalize_language_codes(value: Any) -> list[str]:
    languages: list[str] = []
    for item in _ensure_list(value, "idiomas_comodos"):
        if isinstance(item, str) and item.strip():
            languages.append(item.strip().lower())
    return languages


def _normalize_provider_ids(value: Any) -> list[int]:
    providers: list[int] = []
    for item in _ensure_list(value, "plataformas"):
        if isinstance(item, bool):
            continue
        try:
            providers.append(int(item))
        except (TypeError, ValueError):
            continue
    return providers


def _normalize_int_list(value: Any, field_name: str) -> list[int]:
    normalized: list[int] = []
    for item in _ensure_list(value, field_name):
        if isinstance(item, bool):
            continue
        try:
            normalized.append(int(item))
        except (TypeError, ValueError):
            continue
    return normalized


def _decode_genre_ids(value: Any) -> list[int]:
    if not value:
        return []

    try:
        raw_items = json.loads(value) if isinstance(value, str) else value
    except json.JSONDecodeError:
        return []

    if not isinstance(raw_items, list):
        return []

    genre_ids: list[int] = []
    for item in raw_items:
        if isinstance(item, bool):
            continue
        try:
            genre_ids.append(int(item))
        except (TypeError, ValueError):
            continue
    return genre_ids


def _profile_context_for_request() -> dict[str, Any]:
    user = get_authenticated_user_from_request(required=False)
    context = dict(DEFAULT_PROFILE_CONTEXT)

    if user is None:
        return context

    profile = get_or_create_profile(user_id=user["id"])
    context["pais"] = _normalize_country_code(profile.get("pais"))
    context["plataformas"] = _normalize_provider_ids(profile.get("plataformas"))
    context["idiomas_comodos"] = _normalize_language_codes(profile.get("idiomas_comodos"))
    tolerancia = profile.get("tolerancia_subtitulos")
    context["tolerancia_subtitulos"] = tolerancia if tolerancia in ("si", "no") else "si"
    context["no_rotundos"] = _normalize_int_list(profile.get("no_rotundos"), "no_rotundos")
    return context


def _validate_enum(payload: dict[str, Any], field_name: str, valid_values: set[str]) -> Any:
    value = payload.get(field_name)
    if value is None:
        return None
    if value not in valid_values:
        allowed = ", ".join(sorted(valid_values))
        raise RequestValidationError(f"`{field_name}` solo permite: {allowed}.")
    return value


def _normalize_session_payload(payload: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(payload, dict):
        raise RequestValidationError("El body JSON debe ser un objeto.")

    mode = payload.get("mode")
    if mode not in VALID_MODES:
        raise RequestValidationError("`mode` es obligatorio y solo permite `sorprendeme` o `preguntame`.")

    normalized = {
        "mode": mode,
        "mood": None,
        "preferencia_tiempo": None,
        "preferencia_energia": None,
        "seguro_o_descubrir": None,
        "preferencia_epoca": None,
    }

    if mode == "preguntame":
        normalized["mood"] = _validate_enum(payload, "mood", VALID_MOODS)
        if normalized["mood"] is None:
            raise RequestValidationError("`mood` es obligatorio en `preguntame`.")

        normalized["preferencia_tiempo"] = _validate_enum(
            payload, "preferencia_tiempo", VALID_TIME_PREFERENCES
        )
        normalized["preferencia_energia"] = _validate_enum(
            payload, "preferencia_energia", VALID_ENERGY_PREFERENCES
        )
        normalized["seguro_o_descubrir"] = _validate_enum(
            payload, "seguro_o_descubrir", VALID_DISCOVERY_PREFERENCES
        )
        normalized["preferencia_epoca"] = _validate_enum(
            payload, "preferencia_epoca", VALID_ERA_PREFERENCES
        )

    return normalized


def _fetch_movies(country_code: str) -> list[dict[str, Any]]:
    db_path = get_db_path()
    if not db_path.exists():
        return []

    with sqlite3.connect(db_path) as connection:
        connection.row_factory = sqlite3.Row
        rows = connection.execute(
            """
            SELECT
                movies.id,
                movies.tmdb_id,
                movies.title,
                movies.poster_path,
                movies.runtime,
                movies.release_year,
                movies.original_language,
                movies.overview,
                movies.popularity,
                movies.vote_count,
                movies.genre_ids,
                movie_providers.provider_id,
                movie_providers.provider_name,
                movie_providers.provider_type
            FROM movies
            LEFT JOIN movie_providers
                ON movie_providers.movie_id = movies.id
                AND movie_providers.country_code = ?
            ORDER BY movies.popularity DESC, movies.vote_count DESC, movies.id DESC
            """,
            (country_code,),
        ).fetchall()

    movies: dict[int, dict[str, Any]] = {}
    for row in rows:
        movie_id = row["id"]
        movie = movies.get(movie_id)
        if movie is None:
            movie = {
                "id": row["id"],
                "tmdb_id": row["tmdb_id"],
                "title": row["title"],
                "poster_path": row["poster_path"],
                "runtime": row["runtime"],
                "release_year": row["release_year"],
                "original_language": row["original_language"],
                "overview": row["overview"],
                "popularity": row["popularity"] or 0,
                "vote_count": row["vote_count"] or 0,
                "genre_ids": _decode_genre_ids(row["genre_ids"]),
                "providers": [],
            }
            movies[movie_id] = movie

        if row["provider_id"] is not None:
            movie["providers"].append(
                {
                    "provider_id": row["provider_id"],
                    "provider_name": row["provider_name"],
                    "provider_type": row["provider_type"],
                }
            )

    return list(movies.values())


def _matches_time_preference(movie: dict[str, Any], preference: str | None) -> bool:
    runtime = movie.get("runtime")
    if runtime is None or preference is None:
        return True
    if preference == "algo_rapido":
        return runtime < 90
    if preference == "tengo_tiempo":
        return runtime >= 90
    return True


def _matches_era_preference(movie: dict[str, Any], preference: str | None) -> bool:
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


def _matches_base_filters(movie: dict[str, Any], profile_context: dict[str, Any]) -> bool:
    if not movie["providers"]:
        return False

    provider_ids = {provider["provider_id"] for provider in movie["providers"]}
    selected_providers = set(profile_context["plataformas"])
    if selected_providers and provider_ids.isdisjoint(selected_providers):
        return False

    comfortable_languages = profile_context["idiomas_comodos"]
    if (
        profile_context["tolerancia_subtitulos"] == "no"
        and comfortable_languages
        and movie.get("original_language") not in comfortable_languages
    ):
        return False

    blocked_genres = set(profile_context["no_rotundos"])
    movie_genres = set(movie.get("genre_ids") or [])
    if blocked_genres and movie_genres and not blocked_genres.isdisjoint(movie_genres):
        return False

    return True


def _score_movie(movie: dict[str, Any], profile_context: dict[str, Any], session_payload: dict[str, Any]) -> int:
    score = 0
    runtime = movie.get("runtime") or 0
    release_year = movie.get("release_year") or 0
    vote_count = movie.get("vote_count") or 0
    popularity = movie.get("popularity") or 0

    score += int(popularity)
    score += min(vote_count // 50, 120)

    if movie.get("original_language") in profile_context["idiomas_comodos"]:
        score += 16

    provider_ids = {provider["provider_id"] for provider in movie["providers"]}
    selected_providers = set(profile_context["plataformas"])
    if selected_providers and not provider_ids.isdisjoint(selected_providers):
        score += 25

    if any(provider["provider_type"] == "flatrate" for provider in movie["providers"]):
        score += 10

    if _matches_time_preference(movie, session_payload.get("preferencia_tiempo")):
        score += 18

    if _matches_era_preference(movie, session_payload.get("preferencia_epoca")):
        score += 18

    energy = session_payload.get("preferencia_energia")
    if energy == "facil":
        if runtime and runtime < 120:
            score += 12
    elif energy == "reto":
        if runtime >= 100:
            score += 12

    discovery = session_payload.get("seguro_o_descubrir")
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

    if session_payload.get("mood") is not None:
        score += 5

    if release_year >= 2015:
        score += 3

    return score


def _build_reason(movie: dict[str, Any], profile_context: dict[str, Any], session_payload: dict[str, Any]) -> str | None:
    reasons: list[str] = []

    if session_payload["mode"] == "preguntame":
        if _matches_time_preference(movie, session_payload.get("preferencia_tiempo")):
            if session_payload.get("preferencia_tiempo") == "algo_rapido":
                reasons.append("encaja con una sesión rápida")
            elif session_payload.get("preferencia_tiempo") == "tengo_tiempo":
                reasons.append("aprovecha que hoy tienes tiempo")

        if _matches_era_preference(movie, session_payload.get("preferencia_epoca")):
            era = session_payload.get("preferencia_epoca")
            if era == "actual":
                reasons.append("pertenece a una etapa reciente")
            elif era == "moderna":
                reasons.append("entra en la etapa moderna")
            elif era == "clasica":
                reasons.append("aporta un toque clásico")

        discovery = session_payload.get("seguro_o_descubrir")
        vote_count = movie.get("vote_count") or 0
        if discovery == "seguro" and vote_count >= 10000:
            reasons.append("va a lo seguro por popularidad")
        elif discovery == "descubrir" and 1000 <= vote_count < 10000:
            reasons.append("se siente como un descubrimiento sólido")
    else:
        if movie.get("original_language") in profile_context["idiomas_comodos"]:
            reasons.append("respeta tus idiomas más cómodos")

    matching_providers = [
        provider["provider_name"]
        for provider in movie["providers"]
        if provider["provider_id"] in set(profile_context["plataformas"])
    ]
    if matching_providers:
        reasons.append(f"está disponible en {matching_providers[0]}")
    elif movie["providers"]:
        reasons.append(f"está disponible hoy en {movie['providers'][0]['provider_name']}")

    if not reasons:
        return None

    return "Te la proponemos porque " + ", ".join(reasons[:2]) + "."


def _select_recommendations(
    profile_context: dict[str, Any], session_payload: dict[str, Any]
) -> list[dict[str, Any]]:
    candidates = [
        movie
        for movie in _fetch_movies(profile_context["pais"])
        if _matches_base_filters(movie, profile_context)
    ]

    strict_candidates = [
        movie
        for movie in candidates
        if _matches_time_preference(movie, session_payload.get("preferencia_tiempo"))
        and _matches_era_preference(movie, session_payload.get("preferencia_epoca"))
    ]

    selected = strict_candidates if len(strict_candidates) >= 3 else candidates
    ranked = sorted(
        selected,
        key=lambda movie: (
            _score_movie(movie, profile_context, session_payload),
            movie.get("vote_count") or 0,
            movie.get("popularity") or 0,
            movie["id"],
        ),
        reverse=True,
    )

    recommendations: list[dict[str, Any]] = []
    for movie in ranked[:3]:
        recommendations.append(
            {
                "id": movie["id"],
                "tmdb_id": movie["tmdb_id"],
                "title": movie["title"],
                "poster_path": movie["poster_path"],
                "runtime": movie["runtime"],
                "release_year": movie["release_year"],
                "original_language": movie["original_language"],
                "overview": movie["overview"],
                "providers": movie["providers"],
                "reason": _build_reason(movie, profile_context, session_payload),
            }
        )

    return recommendations


@session_api.post("/session/recommend")
def recommend_session():
    try:
        payload = get_json_payload()
        session_payload = _normalize_session_payload(payload)
        profile_context = _profile_context_for_request()
        items = _select_recommendations(profile_context, session_payload)
    except RequestValidationError as error:
        return jsonify({"status": "error", "message": str(error)}), 400
    except AuthError as error:
        return jsonify({"status": "error", "message": str(error)}), 401

    message = ""
    if not items:
        message = (
            "No hemos encontrado recomendaciones con el catálogo local actual para ese perfil."
        )

    return jsonify(
        {
            "status": "ok",
            "mode": session_payload["mode"],
            "message": message,
            "items": items,
        }
    )
