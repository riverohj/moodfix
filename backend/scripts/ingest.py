#!/usr/bin/env python3
"""
EPIC 1 — Ingestion inicial del catalogo de peliculas
=====================================================
Popula la base de datos SQLite local con 200-300 peliculas de TMDb,
incluyendo disponibilidad de proveedores para ES, MX y AR.

Uso:
    python backend/scripts/ingest.py
    python backend/scripts/ingest.py --limit 300 --countries ES MX AR

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

DEFAULT_COUNTRIES = ["ES", "MX", "AR"]
DEFAULT_LIMIT = 250
MIN_VOTE_COUNT = 100
MIN_RUNTIME = 60


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


# ── Fetch funciones ───────────────────────────────────────────────────────────
def fetch_movie_ids(limit: int) -> list:
    """Pagina discover/movie para obtener hasta `limit` IDs."""
    movie_ids = []
    page = 1

    while len(movie_ids) < limit:
        data = tmdb_get("discover/movie", {
            "sort_by": "popularity.desc",
            "vote_count.gte": MIN_VOTE_COUNT,
            "with_runtime.gte": MIN_RUNTIME,
            "page": page,
        })

        results = data.get("results", [])
        if not results:
            break

        for m in results:
            if len(movie_ids) >= limit:
                break
            movie_ids.append(m["id"])

        total_pages = data.get("total_pages", 1)
        if page >= min(total_pages, 50):  # max 50 paginas por llamada
            break
        page += 1

    return movie_ids


def fetch_detail(tmdb_id: int) -> dict:
    """Detalles completos de una pelicula."""
    return tmdb_get(f"movie/{tmdb_id}")


def fetch_providers(tmdb_id: int, countries: list) -> list:
    """Proveedores de streaming para los paises dados."""
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
                rows.append({
                    "country_code": country_code,
                    "provider_id": p.get("provider_id"),
                    "provider_name": p.get("provider_name"),
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
            conn.execute(
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

    print(f"Base de datos : {db_path}")
    print(f"Objetivo      : {limit} peliculas | Paises: {', '.join(countries)}")
    print()

    # Inicializar tablas (reutiliza init_db de Juan)
    sys.path.insert(0, str(ROOT_DIR))
    from backend.app.db import init_db
    init_db()

    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA journal_mode = WAL")

    print("Buscando IDs en TMDb discover...")
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

        with conn:
            movie_db_id = upsert_movie(conn, detail)

        if movie_db_id is None:
            skipped += 1
            continue

        providers = fetch_providers(tmdb_id, countries)
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
