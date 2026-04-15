from __future__ import annotations

from typing import Any

from .catalogo import cargar_catalogo_por_pais
from .filtros import filtrar_candidatas
from .seleccion import construir_salida_motor


def recomendar_peliculas(
    perfil_estable: dict[str, Any],
    sesion_actual: dict[str, Any],
) -> dict[str, list[dict[str, Any]]]:
    catalogo = cargar_catalogo_por_pais(perfil_estable["pais"])
    candidatas = filtrar_candidatas(catalogo, perfil_estable)
    return construir_salida_motor(candidatas, perfil_estable, sesion_actual)
