#!/usr/bin/env python3
"""
EPIC 1 — Ingestion inicial del catalogo de peliculas
=====================================================
Popula la base de datos SQLite local con una carga inicial ampliada,
incluyendo solo proveedores permitidos para las regiones indicadas.

Uso:
    python backend/scripts/ingest.py
    python backend/scripts/ingest.py --limit 500 --countries ES

Requisitos:
    pip install requests python-dotenv
    Configura TMDB_API_KEY en tu archivo .env
"""

import argparse
import os
import sqlite3
import sys
import time
from pathlib import Path

try:
    import requests
except ImportError:
    print("Instala requests: pip install requests python-dotenv")
    sys.exit(1)

try:
    from dotenv import load_dotenv
except ImportError:
    def load_dotenv(*a, **kw): pass

# ── Configuracion ──────────────────────────────────────────────────────────────
ROOT_DIR = Path(__file__).resolve().parents[2]
load_dotenv(ROOT_DIR / ".env")

TMDB_API_KEY = os.getenv("TMDB_API_KEY", "")
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


# ── DB path (misma logica que db.py) ──────────────────────────────────────────
def get_db_path() -> Path:
    configured = os.getenv("DATABASE_PATH")
    if configured:
        path = Path(configured)
        if not path.is_absolute():
            path = ROOT_DIR / configured
        return path
    return ROOT_DIR / "backend" / "data" / "moodfix.db"


# ── TMDb helpers ──────────────────────────────────────────────────────────────
def tmdb_get(endpoint: str, params: dict = None, retries: int = 3) -> dict:
    if params is None:
        params = {}
    params["api_key"] = TMDB_API_KEY
    url = f"{TMDB_BASE}/{endpoint}"

    for attempt in range(retries):
        try:
            resp = requests.get(url, params=params, timeout=10)
            if resp.status_code == 429:
                wait = int(resp.headers.get("Retry-After", 10))
                print(f"  Rate limited. Esperando {wait}s...")
                time.sleep(wait)
                continue
            if resp.status_code == 404:
                return {}
            resp.raise_for_status()
            return resp.json()
        except requests.RequestException as e:
            if attempt == retries - 1:
                return {}
            time.sleep(2 ** attempt)
    return {}


def normalize_provider_name(name: str | None) -> str:
    if not name:
        return ""
    normalized = "".join(ch for ch in name.lower() if ch.isalnum() or ch == "+")
    return ALLOWED_PROVIDER_ALIASES.get(normalized, "")


# ── Fetch funciones ───────────────────────────────────────────────────────────
def extend_movie_ids(movie_ids: list[int], seen_ids: set[int], results: list[dict], limit: int) -> None:
    for movie in results:
        movie_id = movie.get("id")
        if not movie_id or movie_id in seen_ids:
            continue
        seen_ids.add(movie_id)
        movie_ids.append(movie_id)
        if len(movie_ids) >= limit:
            break


def fetch_movie_ids(limit: int) -> list[int]:
    """Construye una lista mixta de IDs para reducir sesgo de catalogo."""
    movie_ids: list[int] = []
    seen_ids: set[int] = set()

    query_batches = [
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

    remaining = max(limit - sum(batch["target"] for batch in query_batches), 0)
    genre_target = max(remaining // max(len(MOOD_GENRE_IDS), 1), 1) if remaining else 0

    for genre_id in MOOD_GENRE_IDS:
        query_batches.append(
            {
                "label": f"genero_{genre_id}",
                "params": {
                    "sort_by": "popularity.desc",
                    "vote_count.gte": MIN_VOTE_COUNT,
                    "with_runtime.gte": MIN_RUNTIME,
                    "with_genres": genre_id,
                },
                "target": genre_target,
            }
        )

    for batch in query_batches:
        if len(movie_ids) >= limit:
            break

        target = min(batch["target"], limit - len(movie_ids))
        if target <= 0:
            continue

        page = 1
        collected_for_batch = 0

        while collected_for_batch < target and page <= MAX_PAGES_PER_QUERY and len(movie_ids) < limit:
            params = dict(batch["params"])
            params["page"] = page
            data = tmdb_get("discover/movie", params)
            results = data.get("results", [])
            if not results:
                break

            before = len(movie_ids)
            extend_movie_ids(movie_ids, seen_ids, results, limit)
            collected_for_batch += len(movie_ids) - before

            total_pages = data.get("total_pages", 1)
            if page >= min(total_pages, MAX_PAGES_PER_QUERY):
                break
            page += 1

    return movie_ids[:limit]


def fetch_detail(tmdb_id: int) -> dict:
    """Detalles completos de una pelicula."""
    return tmdb_get(f"movie/{tmdb_id}")


def fetch_providers(tmdb_id: int, countries: list) -> list:
    """Proveedores permitidos para los paises dados."""
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
            for p in providers:
                canonical_name = normalize_provider_name(p.get("provider_name"))
                if not canonical_name:
                    continue
                rows.append({
                    "country_code": country_code,
                    "provider_id": p.get("provider_id"),
                    "provider_name": canonical_name,
                    "provider_type": provider_type,
                })
    return rows


# ── DB helpers ────────────────────────────────────────────────────────────────
def upsert_movie(conn: sqlite3.Connection, detail: dict):
    """Inserta o actualiza una pelicula. Devuelve el id local o None si se descarta."""
    tmdb_id = detail.get("id")
    title = detail.get("title")
    if not tmdb_id or not title:
        return None

    release_date = detail.get("release_date", "")
    release_year = int(release_date[:4]) if release_date and len(release_date) >= 4 else None

    runtime = detail.get("runtime") or 0
    vote_count = detail.get("vote_count") or 0

    # Filtros de calidad
    if runtime < MIN_RUNTIME or vote_count < MIN_VOTE_COUNT:
        return None

    cur = conn.execute(
        """
        INSERT INTO movies
            (tmdb_id, title, poster_path, runtime, release_year,
             original_language, overview, popularity, vote_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(tmdb_id) DO UPDATE SET
            title              = excluded.title,
            poster_path        = excluded.poster_path,
            runtime            = excluded.runtime,
            release_year       = excluded.release_year,
            original_language  = excluded.original_language,
            overview           = excluded.overview,
            popularity         = excluded.popularity,
            vote_count         = excluded.vote_count,
            updated_at         = CURRENT_TIMESTAMP
        """,
        (
            tmdb_id,
            title,
            detail.get("poster_path"),
            runtime,
            release_year,
            detail.get("original_language"),
            detail.get("overview"),
            detail.get("popularity"),
            vote_count,
        ),
    )
    # Recuperar el id real (en upsert lastrowid puede ser 0)
    row = conn.execute("SELECT id FROM movies WHERE tmdb_id = ?", (tmdb_id,)).fetchone()
    return row[0] if row else None


def insert_providers(conn: sqlite3.Connection, movie_db_id: int, providers: list) -> int:
    """Inserta proveedores ignorando duplicados. Devuelve cantidad insertada."""
    count = 0
    for p in providers:
        if not p.get("provider_id") or not p.get("provider_name"):
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
                    p["country_code"],
                    p["provider_id"],
                    p["provider_name"],
                    p["provider_type"],
                ),
            )
            if cursor.rowcount == 1:
                count += 1
        except sqlite3.Error:
            pass
    return count


# ── Runner principal ──────────────────────────────────────────────────────────
def run(limit: int, countries: list) -> None:
    if not TMDB_API_KEY:
        print("TMDB_API_KEY no esta configurada. Añadela a tu archivo .env")
        sys.exit(1)

    db_path = get_db_path()
    db_path.parent.mkdir(parents=True, exist_ok=True)
    normalized_countries = [country.upper() for country in countries]

    print(f"Base de datos : {db_path}")
    print(f"Objetivo      : {limit} peliculas | Paises: {', '.join(normalized_countries)}")
    print(f"Providers     : {', '.join(sorted(set(ALLOWED_PROVIDER_ALIASES.values())))}")
    print()

    # Inicializar tablas (reutiliza init_db de Juan)
    sys.path.insert(0, str(ROOT_DIR))
    from backend.app.db import init_db
    init_db()

    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA journal_mode = WAL")

    print("Buscando IDs en TMDb con estrategia mixta...")
    movie_ids = fetch_movie_ids(limit)
    print(f"   {len(movie_ids)} candidatos encontrados")
    print()

    inserted = 0
    skipped = 0
    total_providers = 0

    for i, tmdb_id in enumerate(movie_ids, start=1):
        detail = fetch_detail(tmdb_id)
        if not detail:
            skipped += 1
            continue

        providers = fetch_providers(tmdb_id, normalized_countries)
        if not providers:
            skipped += 1
            continue

        with conn:
            movie_db_id = upsert_movie(conn, detail)

        if movie_db_id is None:
            skipped += 1
            continue

        with conn:
            n = insert_providers(conn, movie_db_id, providers)

        total_providers += n
        inserted += 1

        title_short = (detail.get("title") or "")[:38]
        print(f"[{i:>3}/{len(movie_ids)}] {title_short:<38} | {n} proveedores")

        time.sleep(0.07)  # ~14 req/s, bien dentro del limite de TMDb

    conn.close()

    print()
    print("=" * 52)
    print("Ingestion completada!")
    print(f"  Peliculas insertadas/actualizadas : {inserted}")
    print(f"  Peliculas descartadas             : {skipped}")
    print(f"  Filas de proveedores              : {total_providers}")
    print(f"  Base de datos                     : {db_path}")
    print("=" * 52)


# ── CLI ───────────────────────────────────────────────────────────────────────
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
