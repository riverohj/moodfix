from __future__ import annotations

from typing import Any

from ..user.auth_model import RequestValidationError


DEFAULT_PERFIL_ESTABLE = {
    "pais": "ES",
    "plataformas": [],
    "idiomas_comodos": ["es", "en"],
    "tolerancia_subtitulos": "si",
    "no_rotundos": [],
    "peliculas_vistas": [],
    "peliculas_para_ver": [],
    "peliculas_descartadas": [],
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


def normalizar_codigo_pais(value: Any) -> str:
    if not isinstance(value, str) or len(value.strip()) != 2:
        return DEFAULT_PERFIL_ESTABLE["pais"]
    return value.strip().upper()


def normalizar_codigos_idioma(value: Any) -> list[str]:
    languages: list[str] = []
    seen: set[str] = set()
    for item in _ensure_list(value, "idiomas_comodos"):
        if not isinstance(item, str) or not item.strip():
            continue
        normalized = item.strip().lower()
        if normalized in seen:
            continue
        seen.add(normalized)
        languages.append(normalized)
    return languages


def normalizar_ids_proveedor(value: Any) -> list[int]:
    providers: list[int] = []
    seen: set[int] = set()
    for item in _ensure_list(value, "plataformas"):
        if isinstance(item, bool):
            continue
        try:
            provider_id = int(item)
        except (TypeError, ValueError):
            continue
        if provider_id in seen:
            continue
        seen.add(provider_id)
        providers.append(provider_id)
    return providers


def normalizar_lista_enteros(value: Any, field_name: str) -> list[int]:
    normalized: list[int] = []
    seen: set[int] = set()
    for item in _ensure_list(value, field_name):
        if isinstance(item, bool):
            continue
        try:
            number = int(item)
        except (TypeError, ValueError):
            continue
        if number in seen:
            continue
        seen.add(number)
        normalized.append(number)
    return normalized


def _extraer_tmdb_id(item: Any) -> int | None:
    if isinstance(item, bool):
        return None
    if isinstance(item, int):
        return item
    if isinstance(item, str) and item.strip():
        try:
            return int(item.strip())
        except ValueError:
            return None
    if isinstance(item, dict):
        raw_value = item.get("tmdb_id")
        if isinstance(raw_value, bool):
            return None
        try:
            return int(raw_value)
        except (TypeError, ValueError):
            return None
    return None


def normalizar_tmdb_ids(value: Any, field_name: str) -> list[int]:
    normalized: list[int] = []
    seen: set[int] = set()
    for item in _ensure_list(value, field_name):
        tmdb_id = _extraer_tmdb_id(item)
        if tmdb_id is None or tmdb_id in seen:
            continue
        seen.add(tmdb_id)
        normalized.append(tmdb_id)
    return normalized


def normalizar_contexto_perfil(profile: dict[str, Any] | None) -> dict[str, Any]:
    context = dict(DEFAULT_PERFIL_ESTABLE)
    if profile is None:
        return context

    context["pais"] = normalizar_codigo_pais(profile.get("pais"))
    context["plataformas"] = normalizar_ids_proveedor(profile.get("plataformas"))
    context["idiomas_comodos"] = normalizar_codigos_idioma(profile.get("idiomas_comodos"))

    tolerancia = profile.get("tolerancia_subtitulos")
    context["tolerancia_subtitulos"] = tolerancia if tolerancia in ("si", "no") else "si"
    context["no_rotundos"] = normalizar_lista_enteros(profile.get("no_rotundos"), "no_rotundos")
    context["peliculas_vistas"] = normalizar_tmdb_ids(profile.get("historial"), "historial")
    context["peliculas_para_ver"] = normalizar_tmdb_ids(profile.get("ver_luego"), "ver_luego")
    context["peliculas_descartadas"] = normalizar_tmdb_ids(
        profile.get("titulos_descartados"),
        "titulos_descartados",
    )
    return context


def _validar_enum(payload: dict[str, Any], field_name: str, valid_values: set[str]) -> Any:
    value = payload.get(field_name)
    if value is None:
        return None
    if value not in valid_values:
        allowed = ", ".join(sorted(valid_values))
        raise RequestValidationError(f"`{field_name}` solo permite: {allowed}.")
    return value


def normalizar_payload_sesion(payload: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(payload, dict):
        raise RequestValidationError("El body JSON debe ser un objeto.")

    modo_entrada = payload.get("mode")
    if modo_entrada not in VALID_MODES:
        raise RequestValidationError(
            "`mode` es obligatorio y solo permite `sorprendeme` o `preguntame`."
        )

    normalized = {
        "modo_entrada": modo_entrada,
        "mood": None,
        "preferencia_tiempo": None,
        "preferencia_energia": None,
        "seguro_o_descubrir": None,
        "preferencia_epoca": None,
    }

    if modo_entrada == "preguntame":
        normalized["mood"] = _validar_enum(payload, "mood", VALID_MOODS)
        if normalized["mood"] is None:
            raise RequestValidationError("`mood` es obligatorio en `preguntame`.")

        normalized["preferencia_tiempo"] = _validar_enum(
            payload, "preferencia_tiempo", VALID_TIME_PREFERENCES
        )
        normalized["preferencia_energia"] = _validar_enum(
            payload, "preferencia_energia", VALID_ENERGY_PREFERENCES
        )
        normalized["seguro_o_descubrir"] = _validar_enum(
            payload, "seguro_o_descubrir", VALID_DISCOVERY_PREFERENCES
        )
        normalized["preferencia_epoca"] = _validar_enum(
            payload, "preferencia_epoca", VALID_ERA_PREFERENCES
        )

    return normalized
