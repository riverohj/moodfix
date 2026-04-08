from __future__ import annotations

import os
import sqlite3
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parents[2]
DEFAULT_DB_PATH = ROOT_DIR / "backend" / "data" / "moodfix.db"


def _ensure_column(connection: sqlite3.Connection, table_name: str, column_name: str, definition: str) -> None:
    columns = {
        row[1]
        for row in connection.execute(f"PRAGMA table_info({table_name})").fetchall()
    }
    if column_name not in columns:
        connection.execute(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {definition}")


def _ensure_index(connection: sqlite3.Connection, index_name: str, statement: str) -> None:
    exists = connection.execute(
        "SELECT 1 FROM sqlite_master WHERE type = 'index' AND name = ?",
        (index_name,),
    ).fetchone()
    if exists is None:
        connection.execute(statement)


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
                genre_ids TEXT NOT NULL DEFAULT '[]',
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

            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                password_salt TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS user_profiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                profile_key TEXT NOT NULL UNIQUE,
                user_id INTEGER UNIQUE,
                pais TEXT,
                plataformas TEXT NOT NULL DEFAULT '[]',
                idiomas_comodos TEXT NOT NULL DEFAULT '[]',
                tolerancia_subtitulos TEXT,
                no_rotundos TEXT NOT NULL DEFAULT '[]',
                historial TEXT NOT NULL DEFAULT '[]',
                ver_luego TEXT NOT NULL DEFAULT '[]',
                titulos_descartados TEXT NOT NULL DEFAULT '[]',
                onboarding_completed INTEGER NOT NULL DEFAULT 0,
                onboarding_skipped INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CHECK (
                    tolerancia_subtitulos IS NULL
                    OR tolerancia_subtitulos IN ('si', 'no')
                ),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS auth_tokens (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                token_hash TEXT NOT NULL UNIQUE,
                expires_at TEXT NOT NULL,
                revoked_at TEXT,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
            """
        )
        _ensure_column(connection, "movies", "genre_ids", "TEXT NOT NULL DEFAULT '[]'")
        _ensure_column(connection, "user_profiles", "user_id", "INTEGER")
        _ensure_index(
            connection,
            "idx_user_profiles_user_id_unique",
            "CREATE UNIQUE INDEX idx_user_profiles_user_id_unique ON user_profiles(user_id) WHERE user_id IS NOT NULL",
        )
        _ensure_index(
            connection,
            "idx_auth_tokens_user_id",
            "CREATE INDEX idx_auth_tokens_user_id ON auth_tokens(user_id)",
        )
        _ensure_index(
            connection,
            "idx_auth_tokens_expires_at",
            "CREATE INDEX idx_auth_tokens_expires_at ON auth_tokens(expires_at)",
        )
