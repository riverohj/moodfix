from __future__ import annotations

import os
import sqlite3
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parents[2]
DEFAULT_DB_PATH = ROOT_DIR / "backend" / "data" / "moodfix.db"


def get_db_path() -> Path:
    configured = os.getenv("DATABASE_PATH")
    if configured:
        path = Path(configured)
        if not path.is_absolute():
            path = ROOT_DIR / configured
        return path
    return DEFAULT_DB_PATH


def init_db() -> None:
    db_path = get_db_path()
    db_path.parent.mkdir(parents=True, exist_ok=True)

    with sqlite3.connect(db_path) as connection:
        connection.execute("PRAGMA foreign_keys = ON")
        connection.executescript(
            """
            CREATE TABLE IF NOT EXISTS movies (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tmdb_id INTEGER NOT NULL UNIQUE,
                title TEXT NOT NULL,
                poster_path TEXT,
                runtime INTEGER,
                release_year INTEGER,
                original_language TEXT,
                overview TEXT,
                popularity REAL,
                vote_count INTEGER,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS movie_providers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                movie_id INTEGER NOT NULL,
                country_code TEXT NOT NULL,
                provider_id INTEGER NOT NULL,
                provider_name TEXT NOT NULL,
                provider_type TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
                UNIQUE (movie_id, country_code, provider_id, provider_type)
            );
            """
        )

