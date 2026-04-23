#!/usr/bin/env python3

import argparse
import json
import os
import sqlite3
import sys
import time
from pathlib import Path
from typing import Dict, List, Optional, Set

try:
    import requests
except ImportError:
    print("Instala requests: pip install requests python-dotenv")
    sys.exit(1)

try:
    from dotenv import load_dotenv
except ImportError:
    def load_dotenv(*a, **kw):
        pass

ROOT_DIR = Path(__file__).resolve().parents[2]
load_dotenv(ROOT_DIR / ".env")

TMDB_READ_ACCESS_TOKEN = os.getenv("TMDB_READ_ACCESS_TOKEN", "").strip()
TMDB_BASE = "https://api.themoviedb.org/3"

DEFAULT_COUNTRIES = ["ES"]
DEFAULT_LIMIT = 500
MIN_VOTE_COUNT = 100
MIN_RUNTIME = 60
MAX_PAGES_PER_QUERY = 20

MOOD_GENRE_IDS = [28, 53, 9648, 80, 18, 10749, 35, 10751, 12, 99]

ALLOWED_PROVIDER_ALIASES = {
    "netflix": "Netflix",
    "movistarplus": "Movistar Plus+",
    "movistarplus+": "Movistar Plus+",
    "hbo": "HBO Max",
    "hbomax": "HBO Max",
    "max": "HBO Max",
    "disney+": "Disney Plus",
    "disneyplus": "Disney Plus",
    "amazonprimevideo": "Amazon Prime Video",
    "primevideo": "Amazon Prime Video",
    "amazonprime": "Amazon Prime Video",
    "filmin": "Filmin",
    "appletv": "Apple TV",
    "appletv+": "Apple TV",
    "appletvplus": "Apple TV",
    "skyshowtime": "SkyShowtime",
    "rakutentv": "Rakuten TV",
    "rakuten": "Rakuten TV",
}


def get_db_path() -> Path:
    configured = os.getenv("DATABASE_PATH")
    if configured:
        path = Path(configured)
        if not path.is_absolute():
            path = ROOT_DIR / configured
        return path
    return ROOT_DIR / "backend" / "data" / "moodfix.db"


def tmdb_get(endpoint: str, params: Optional[Dict] = None, retries: int = 3) -> Dict:
    params = dict(params or {})
    url = f"{TMDB_BASE}/{endpoint}"
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {TMDB_READ_ACCESS_TOKEN}",
    }

    for attempt in range(retries):
        try:
            resp = requests.get(url, params=params, headers=headers, timeout=10)
            if resp.status_code == 429:
                wait = int(resp.headers.get("Retry-After", 10))
                print(f"  Rate limited. Esperando {wait}s...")
                time.sleep(wait)
                continue
            if resp.status_code == 404:
                return {}
            resp.raise_for_status()
            return resp.json()
        except requests.RequestException:
            if attempt == retries - 1:
                return {}
            time.sleep(2 ** attempt)
    return {}


def normalizar_nombre_provider(name: Optional[str]) -> str:
    if not name:
        return ""
    normalized = "".join(ch for ch in name.lower() if ch.isalnum() or ch == "+")
    return ALLOWED_PROVIDER_ALIASES.get(normalized, "")


def agregar_ids_peliculas(
    ids_peliculas: List[int],
    ids_vistos: Set[int],
    resultados: List[Dict],
    limite: int,
) -> None:
    for pelicula in resultados:
        movie_id = pelicula.get("id")
        if not movie_id or movie_id in ids_vistos:
            continue
        ids_vistos.add(movie_id)
        ids_peliculas.append(movie_id)
        if len(ids_peliculas) >= limite:
            break


def crear_lotes_consulta(limit: int) -> List[Dict]:
    lotes = [
        {
            "label": "popularidad",
            "params": {
                "sort_by": "popularity.desc",
                "vote_count.gte": MIN_VOTE_COUNT,
                "with_runtime.gte": MIN_RUNTIME,
            },
            "target": max(int(limit * 0.4), 1),
        },
        {
            "label": "bien_valoradas",
            "params": {
                "sort_by": "vote_average.desc",
                "vote_count.gte": 500,
                "vote_average.gte": 7.0,
                "with_runtime.gte": MIN_RUNTIME,
            },
            "target": max(int(limit * 0.3), 1),
        },
    ]

    faltantes = max(limit - sum(lote["target"] for lote in lotes), 0)
    objetivo_por_genero = max(faltantes // max(len(MOOD_GENRE_IDS), 1), 1) if faltantes else 0

    for genre_id in MOOD_GENRE_IDS:
        lotes.append(
            {
                "label": f"genero_{genre_id}",
                "params": {
                    "sort_by": "popularity.desc",
                    "vote_count.gte": MIN_VOTE_COUNT,
                    "with_runtime.gte": MIN_RUNTIME,
                    "with_genres": genre_id,
                },
                "target": objetivo_por_genero,
            }
        )

    return lotes


def fetch_movie_ids(limit: int) -> List[int]:
    ids_peliculas: List[int] = []
    ids_vistos: Set[int] = set()

    for lote in crear_lotes_consulta(limit):
        if len(ids_peliculas) >= limit:
            break

        objetivo = min(lote["target"], limit - len(ids_peliculas))
        if objetivo <= 0:
            continue

        pagina = 1
        agregadas = 0

        while agregadas < objetivo and pagina <= MAX_PAGES_PER_QUERY and len(ids_peliculas) < limit:
            params = dict(lote["params"])
            params["page"] = pagina
            params["language"] = "es-ES"
            data = tmdb_get("discover/movie", params)
            resultados = data.get("results", [])
            if not resultados:
                break

            antes = len(ids_peliculas)
            agregar_ids_peliculas(ids_peliculas, ids_vistos, resultados, limit)
            agregadas += len(ids_peliculas) - antes

            total_paginas = data.get("total_pages", 1)
            if pagina >= min(total_paginas, MAX_PAGES_PER_QUERY):
                break
            pagina += 1

    return ids_peliculas[:limit]


def fetch_detail(tmdb_id: int) -> dict:
    return tmdb_get(f"movie/{tmdb_id}", {"language": "es-ES"})


def fetch_providers(tmdb_id: int, countries: List[str]) -> List[Dict]:
    data = tmdb_get(f"movie/{tmdb_id}/watch/providers")
    results = data.get("results", {})

    rows = []
    for country_code in countries:
        country_data = results.get(country_code, {})
        for provider_type, providers in country_data.items():
            if provider_type not in ("flatrate", "rent", "buy"):
                continue
            if not isinstance(providers, list):
                continue
            for provider in providers:
                provider_name = normalizar_nombre_provider(provider.get("provider_name"))
                if not provider_name:
                    continue
                rows.append(
                    {
                        "country_code": country_code,
                        "provider_id": provider.get("provider_id"),
                        "provider_name": provider_name,
                        "provider_type": provider_type,
                    }
                )
    return rows


def _leer_release_year(detail: dict) -> int | None:
    release_date = detail.get("release_date", "")
    if release_date and len(release_date) >= 4:
        return int(release_date[:4])
    return None


def _leer_genre_ids(detail: dict) -> list[int]:
    return [
        genre.get("id")
        for genre in detail.get("genres", [])
        if isinstance(genre, dict) and genre.get("id") is not None
    ]


def _pelicula_valida(detail: dict) -> bool:
    runtime = detail.get("runtime") or 0
    vote_count = detail.get("vote_count") or 0
    return runtime >= MIN_RUNTIME and vote_count >= MIN_VOTE_COUNT


def upsert_movie(conn: sqlite3.Connection, detail: dict):
    tmdb_id = detail.get("id")
    title = detail.get("title")
    if not tmdb_id or not title:
        return None

    if not _pelicula_valida(detail):
        return None

    conn.execute(
        """
        INSERT INTO movies
            (tmdb_id, title, poster_path, runtime, release_year,
             original_language, overview, popularity, vote_count, genre_ids)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(tmdb_id) DO UPDATE SET
            title              = excluded.title,
            poster_path        = excluded.poster_path,
            runtime            = excluded.runtime,
            release_year       = excluded.release_year,
            original_language  = excluded.original_language,
            overview           = excluded.overview,
            popularity         = excluded.popularity,
            vote_count         = excluded.vote_count,
            genre_ids          = excluded.genre_ids,
            updated_at         = CURRENT_TIMESTAMP
        """,
        (
            tmdb_id,
            title,
            detail.get("poster_path"),
            detail.get("runtime") or 0,
            _leer_release_year(detail),
            detail.get("original_language"),
            detail.get("overview"),
            detail.get("popularity"),
            detail.get("vote_count") or 0,
            json.dumps(_leer_genre_ids(detail)),
        ),
    )
    row = conn.execute("SELECT id FROM movies WHERE tmdb_id = ?", (tmdb_id,)).fetchone()
    return row[0] if row else None


def insert_providers(conn: sqlite3.Connection, movie_db_id: int, providers: List[Dict]) -> int:
    count = 0
    for provider in providers:
        if not provider.get("provider_id") or not provider.get("provider_name"):
            continue
        try:
            cursor = conn.execute(
                """
                INSERT OR IGNORE INTO movie_providers
                    (movie_id, country_code, provider_id, provider_name, provider_type)
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    movie_db_id,
                    provider["country_code"],
                    provider["provider_id"],
                    provider["provider_name"],
                    provider["provider_type"],
                ),
            )
            if cursor.rowcount == 1:
                count += 1
        except sqlite3.Error:
            pass
    return count


def _validar_configuracion() -> None:
    if not TMDB_READ_ACCESS_TOKEN:
        print("TMDB_READ_ACCESS_TOKEN no esta configurado. Añadelo a tu archivo .env")
        sys.exit(1)


def _normalizar_paises(countries: List[str]) -> List[str]:
    return [country.upper() for country in countries]


def _imprimir_resumen_inicial(db_path: Path, limit: int, countries: List[str]) -> None:
    providers = ", ".join(sorted(set(ALLOWED_PROVIDER_ALIASES.values())))

    print(f"Base de datos : {db_path}")
    print(f"Objetivo      : {limit} peliculas | Paises: {', '.join(countries)}")
    print("Auth TMDb     : bearer via TMDB_READ_ACCESS_TOKEN")
    print(f"Providers     : {providers}")
    print()


def _inicializar_bd() -> None:
    sys.path.insert(0, str(ROOT_DIR))
    from backend.app.db import init_db

    init_db()


def _crear_conexion(db_path: Path) -> sqlite3.Connection:
    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA journal_mode = WAL")
    return conn


def _procesar_pelicula(
    conn: sqlite3.Connection,
    tmdb_id: int,
    countries: List[str],
) -> tuple[int, str] | None:
    detail = fetch_detail(tmdb_id)
    if not detail:
        return None

    providers = fetch_providers(tmdb_id, countries)
    if not providers:
        return None

    with conn:
        movie_db_id = upsert_movie(conn, detail)
    if movie_db_id is None:
        return None

    with conn:
        providers_insertados = insert_providers(conn, movie_db_id, providers)

    titulo = (detail.get("title") or "")[:38]
    return providers_insertados, titulo


def run(limit: int, countries: List[str]) -> None:
    _validar_configuracion()

    db_path = get_db_path()
    db_path.parent.mkdir(parents=True, exist_ok=True)
    paises = _normalizar_paises(countries)

    _imprimir_resumen_inicial(db_path, limit, paises)
    _inicializar_bd()
    conn = _crear_conexion(db_path)

    print("Buscando IDs en TMDb con estrategia mixta...")
    movie_ids = fetch_movie_ids(limit)
    print(f"   {len(movie_ids)} candidatos encontrados")
    print()

    peliculas_ok = 0
    peliculas_descartadas = 0
    total_providers = 0

    for i, tmdb_id in enumerate(movie_ids, start=1):
        resultado = _procesar_pelicula(conn, tmdb_id, paises)
        if resultado is None:
            peliculas_descartadas += 1
            continue

        providers_insertados, titulo = resultado
        total_providers += providers_insertados
        peliculas_ok += 1
        print(f"[{i:>3}/{len(movie_ids)}] {titulo:<38} | {providers_insertados} proveedores")
        time.sleep(0.07)

    conn.close()

    print()
    print("=" * 52)
    print("Ingestion completada!")
    print(f"  Peliculas insertadas/actualizadas : {peliculas_ok}")
    print(f"  Peliculas descartadas             : {peliculas_descartadas}")
    print(f"  Filas de proveedores              : {total_providers}")
    print(f"  Base de datos                     : {db_path}")
    print("=" * 52)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Ingesta inicial de peliculas TMDb → moodfix.db"
    )
    parser.add_argument(
        "--limit", type=int, default=DEFAULT_LIMIT,
        help=f"Max peliculas a ingestar (default: {DEFAULT_LIMIT})"
    )
    parser.add_argument(
        "--countries", nargs="+", default=DEFAULT_COUNTRIES,
        help=f"Codigos de pais para proveedores (default: {' '.join(DEFAULT_COUNTRIES)})"
    )
    args = parser.parse_args()
    run(args.limit, args.countries)
