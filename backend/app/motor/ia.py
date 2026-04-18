from __future__ import annotations

import json
import os
from typing import Any

import anthropic

GENRE_LABELS = {
    12: "Aventura", 14: "Fantasía", 16: "Animación", 18: "Drama",
    27: "Terror", 28: "Acción", 35: "Comedia", 36: "Historia",
    37: "Western", 53: "Thriller", 80: "Crimen", 99: "Documental",
    878: "Ciencia ficción", 9648: "Misterio", 10402: "Música",
    10749: "Romance", 10751: "Familia", 10752: "Bélica",
}

MOOD_LABELS = {
    "acelerar_corazon": "Acelerar el corazón",
    "resuelve_un_crimen": "Resolver un crimen",
    "peliculas_emocionales": "Películas emotivas",
    "pasar_un_buen_rato": "Pasar un buen rato",
    "historias_que_inspiran": "Historias que inspiran",
    "descubre_el_mundo": "Descubrir el mundo",
}


def _genre_names(genre_ids: list[int]) -> str:
    return ", ".join(GENRE_LABELS.get(g, str(g)) for g in genre_ids) or "Sin género"


def _build_prompt(
    candidatas: list[dict[str, Any]],
    perfil: dict[str, Any],
    sesion: dict[str, Any],
) -> str:
    # Perfil
    plataformas = ", ".join(
        p.get("provider_name", str(p)) if isinstance(p, dict) else str(p)
        for p in perfil.get("plataformas", [])
    ) or "cualquiera"
    idiomas = ", ".join(perfil.get("idiomas_comodos", [])) or "cualquiera"
    no_rotundos = _genre_names(perfil.get("no_rotundos", []))
    vistas = len(perfil.get("peliculas_vistas", []))
    para_ver = len(perfil.get("peliculas_para_ver", []))

    # Sesión
    modo = sesion.get("modo_entrada", "sorprendeme")
    mood = MOOD_LABELS.get(sesion.get("mood", ""), sesion.get("mood", "Sin preferencia"))
    tiempo = sesion.get("preferencia_tiempo") or "sin preferencia"
    energia = sesion.get("preferencia_energia") or "sin preferencia"
    epoca = sesion.get("preferencia_epoca") or "sin preferencia"

    # Candidatas
    lista = ""
    for i, movie in enumerate(candidatas, 1):
        providers = ", ".join(
            p["provider_name"] for p in movie.get("providers", [])
            if p.get("provider_type") == "flatrate"
        ) or "sin plataforma"
        generos = _genre_names(movie.get("genre_ids", []))
        lista += (
            f"{i}. [{movie['tmdb_id']}] {movie['title']} ({movie.get('release_year', '?')}) "
            f"| {generos} | {providers} | {movie.get('runtime', '?')}min\n"
            f"   {movie.get('overview', '')[:120]}\n\n"
        )

    return f"""Eres el motor de recomendación de MoodFix. Elige la mejor película para este usuario ahora mismo.

PERFIL DEL USUARIO:
- Plataformas disponibles: {plataformas}
- Idiomas cómodos: {idiomas}
- Géneros que nunca quiere ver: {no_rotundos}
- Películas ya vistas: {vistas}
- Guardadas para ver luego: {para_ver}

SESIÓN DE HOY:
- Modo: {"Sorpréndeme" if modo == "sorprendeme" else "Pregúntame"}
- Estado de ánimo: {mood}
- Tiempo disponible: {tiempo}
- Nivel de energía: {energia}
- Época preferida: {epoca}

CANDIDATAS VÁLIDAS (ya filtradas, todas son viables):
{lista}
Elige LA MEJOR película para este usuario hoy. Responde ÚNICAMENTE con este JSON, sin texto adicional:
{{
  "tmdb_id": <número>,
  "razon": "<Una frase directa explicando por qué esta película es perfecta para este usuario hoy. Máximo 20 palabras.>"
}}"""


def elegir_con_ia(
    candidatas: list[dict[str, Any]],
    perfil: dict[str, Any],
    sesion: dict[str, Any],
) -> dict[str, Any] | None:
    """Devuelve la candidata elegida por IA con su razon, o None si falla."""
    if not candidatas:
        return None

    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        return None

    try:
        client = anthropic.Anthropic(api_key=api_key)
        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=256,
            messages=[{"role": "user", "content": _build_prompt(candidatas, perfil, sesion)}],
        )
        raw = message.content[0].text.strip()
        # Quitar bloques markdown ```json ... ``` si los hay
        if raw.startswith("```"):
            raw = raw.split("```", 2)[1]
            if raw.startswith("json"):
                raw = raw[4:]
            raw = raw.strip()
        data = json.loads(raw)
        tmdb_id = int(data["tmdb_id"])
        razon = str(data["razon"])

        # Buscar la película elegida en las candidatas
        elegida = next((m for m in candidatas if m["tmdb_id"] == tmdb_id), None)
        if elegida is None:
            return None

        return {**elegida, "razon_ia": razon}

    except Exception:
        return None
