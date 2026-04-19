from __future__ import annotations

import json
import sqlite3
from typing import Any

from ..db import get_db_path
from .auth_model import obtener_usuario_por_id


CAMPOS_PERFIL = (
    "pais",
    "plataformas",
    "idiomas_comodos",
    "tolerancia_subtitulos",
    "no_rotundos",
    "historial",
    "ver_luego",
    "titulos_descartados",
    "onboarding_completed",
    "onboarding_skipped",
)
CAMPOS_LISTA = (
    "plataformas",
    "idiomas_comodos",
    "no_rotundos",
    "historial",
    "ver_luego",
    "titulos_descartados",
)
CAMPOS_PERMITIDOS = set(CAMPOS_PERFIL)


def _perfil_vacio() -> dict[str, Any]:
    return {
        "pais": None,
        "plataformas": [],
        "idiomas_comodos": [],
        "tolerancia_subtitulos": None,
        "no_rotundos": [],
        "historial": [],
        "ver_luego": [],
        "titulos_descartados": [],
        "onboarding_completed": False,
        "onboarding_skipped": False,
    }


def _conectar_bd() -> sqlite3.Connection:
    conexion = sqlite3.connect(get_db_path())
    conexion.row_factory = sqlite3.Row
    return conexion


def _asegurar_usuario(user_id: int) -> None:
    if obtener_usuario_por_id(user_id) is None:
        raise ValueError("Usuario no encontrado para actualizar su perfil.")


def _serializar_lista(valor: Any) -> str:
    if valor is None:
        return "[]"
    if not isinstance(valor, list):
        raise ValueError("Los campos de lista deben enviarse como arrays.")
    return json.dumps(valor)


def _serializar_bandera(valor: Any) -> int:
    return 1 if bool(valor) else 0


def _decodificar_fila(fila: sqlite3.Row | None) -> dict[str, Any] | None:
    if fila is None:
        return None

    perfil = dict(fila)
    for campo in CAMPOS_LISTA:
        perfil[campo] = json.loads(perfil[campo] or "[]")
    perfil["onboarding_completed"] = bool(perfil["onboarding_completed"])
    perfil["onboarding_skipped"] = bool(perfil["onboarding_skipped"])
    return perfil


def _leer_fila_perfil(conexion: sqlite3.Connection, user_id: int) -> sqlite3.Row | None:
    return conexion.execute(
        "SELECT * FROM user_profiles WHERE user_id = ?",
        (user_id,),
    ).fetchone()


def _crear_perfil_si_falta(conexion: sqlite3.Connection, user_id: int) -> sqlite3.Row:
    fila = _leer_fila_perfil(conexion, user_id)
    if fila is not None:
        return fila

    conexion.execute(
        "INSERT INTO user_profiles (profile_key, user_id) VALUES (?, ?)",
        (f"user:{user_id}", user_id),
    )
    return _leer_fila_perfil(conexion, user_id)


def _armar_update(campos: dict[str, Any]) -> tuple[str, list[Any]]:
    nombres = list(campos.keys())
    asignaciones = ", ".join(f"{campo} = ?" for campo in nombres)
    valores = [campos[campo] for campo in nombres]
    return asignaciones, valores


def _guardar_campos(conexion: sqlite3.Connection, user_id: int, campos: dict[str, Any]) -> None:
    if not campos:
        return
    asignaciones, valores = _armar_update(campos)
    conexion.execute(
        f"""
        UPDATE user_profiles
        SET {asignaciones},
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
        """,
        (*valores, user_id),
    )


def _normalizar_tmdb_id(valor: Any) -> int:
    if isinstance(valor, bool):
        raise ValueError("`tmdb_id` debe ser un entero positivo.")
    try:
        tmdb_id = int(valor)
    except (TypeError, ValueError) as error:
        raise ValueError("`tmdb_id` debe ser un entero positivo.") from error
    if tmdb_id <= 0:
        raise ValueError("`tmdb_id` debe ser un entero positivo.")
    return tmdb_id


def _limpiar_lista_ids(lista: list[Any], tmdb_id: int) -> list[int]:
    limpia: list[int] = []
    for item in lista or []:
        if isinstance(item, bool) or item == tmdb_id:
            continue
        limpia.append(item)
    return limpia


def normalizar_payload_perfil(payload: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(payload, dict):
        raise ValueError("El payload del perfil debe ser un objeto JSON.")

    campos_desconocidos = sorted(set(payload) - CAMPOS_PERMITIDOS)
    if campos_desconocidos:
        raise ValueError(f"Campos no soportados en perfil: {', '.join(campos_desconocidos)}.")

    perfil_normalizado: dict[str, Any] = {}

    for campo in CAMPOS_LISTA:
        if campo in payload:
            perfil_normalizado[campo] = _serializar_lista(payload[campo])

    if "pais" in payload:
        perfil_normalizado["pais"] = payload["pais"] or None

    if "tolerancia_subtitulos" in payload:
        valor = payload["tolerancia_subtitulos"]
        if valor not in (None, "si", "no"):
            raise ValueError("`tolerancia_subtitulos` solo permite `si`, `no` o null.")
        perfil_normalizado["tolerancia_subtitulos"] = valor

    if "onboarding_completed" in payload:
        perfil_normalizado["onboarding_completed"] = _serializar_bandera(
            payload["onboarding_completed"]
        )

    if "onboarding_skipped" in payload:
        perfil_normalizado["onboarding_skipped"] = _serializar_bandera(
            payload["onboarding_skipped"]
        )

    return perfil_normalizado


def obtener_o_crear_perfil(*, user_id: int) -> dict[str, Any]:
    _asegurar_usuario(user_id)
    with _conectar_bd() as conexion:
        fila = _crear_perfil_si_falta(conexion, user_id)
        conexion.commit()
    return _decodificar_fila(fila)


def agregar_pelicula_a_lista(
    tmdb_id: Any,
    campo: str,
    *,
    user_id: int,
    campos_limpiar: tuple[str, ...] = (),
) -> dict[str, Any]:
    if campo not in CAMPOS_LISTA:
        raise ValueError(f"Campo no soportado para listas de peliculas: {campo}.")

    for campo_limpiar in campos_limpiar:
        if campo_limpiar not in CAMPOS_LISTA:
            raise ValueError(
                f"Campo no soportado para limpiar listas de peliculas: {campo_limpiar}."
            )

    _asegurar_usuario(user_id)
    tmdb_id = _normalizar_tmdb_id(tmdb_id)

    with _conectar_bd() as conexion:
        conexion.execute("BEGIN IMMEDIATE")
        perfil = _decodificar_fila(_crear_perfil_si_falta(conexion, user_id))

        lista_principal = _limpiar_lista_ids(perfil.get(campo) or [], tmdb_id)
        lista_principal.append(tmdb_id)

        cambios = {campo: _serializar_lista(lista_principal)}
        for campo_limpiar in campos_limpiar:
            lista_limpia = _limpiar_lista_ids(perfil.get(campo_limpiar) or [], tmdb_id)
            cambios[campo_limpiar] = _serializar_lista(lista_limpia)

        _guardar_campos(conexion, user_id, cambios)
        conexion.commit()

    return obtener_o_crear_perfil(user_id=user_id)


def quitar_pelicula_de_lista(
    tmdb_id: Any,
    campo: str,
    *,
    user_id: int,
) -> dict[str, Any]:
    if campo not in CAMPOS_LISTA:
        raise ValueError(f"Campo no soportado para listas de peliculas: {campo}.")

    _asegurar_usuario(user_id)
    tmdb_id = _normalizar_tmdb_id(tmdb_id)

    with _conectar_bd() as conexion:
        conexion.execute("BEGIN IMMEDIATE")
        perfil = _decodificar_fila(_crear_perfil_si_falta(conexion, user_id))
        lista = _limpiar_lista_ids(perfil.get(campo) or [], tmdb_id)
        _guardar_campos(conexion, user_id, {campo: _serializar_lista(lista)})
        conexion.commit()

    return obtener_o_crear_perfil(user_id=user_id)


def guardar_perfil(
    payload: dict[str, Any],
    *,
    user_id: int,
    merge: bool = True,
) -> dict[str, Any]:
    perfil_actual = obtener_o_crear_perfil(user_id=user_id)
    perfil_base = (
        {campo: perfil_actual.get(campo) for campo in CAMPOS_PERFIL if campo in perfil_actual}
        if merge
        else _perfil_vacio()
    )
    perfil_base.update(payload)
    cambios = normalizar_payload_perfil(perfil_base)

    with _conectar_bd() as conexion:
        _guardar_campos(conexion, user_id, cambios)
        conexion.commit()

    return obtener_o_crear_perfil(user_id=user_id)
