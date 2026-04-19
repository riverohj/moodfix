import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../css/Favorites.css";
import {
  deleteWatchlistMovie,
  getWatchlistMovies,
} from "../src/lib/api";
import {
  formatLanguageLabel,
  formatPopularity,
  formatVoteCount,
  getFlatrateProviders,
  getGenreLabels,
  getPosterUrl,
  getPrimaryGenreLabel,
} from "../src/lib/movieMetadata";

function MovieDetailModal({ movie, onClose }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const providers = getFlatrateProviders(movie);
  const genreLabels = getGenreLabels(movie);

  return (
    <div className="library-modal-backdrop" onClick={onClose}>
      <div
        aria-label={movie.title}
        aria-modal="true"
        className="library-modal"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="library-modal-close" type="button" onClick={onClose}>
          ✕
        </button>
        <div className="library-modal-layout">
          <div className="library-modal-poster-shell">
            {movie.poster_path ? (
              <img
                alt={movie.title}
                className="library-modal-poster"
                src={getPosterUrl(movie, "w342")}
                onError={(event) => {
                  event.target.onerror = null;
                  event.target.style.display = "none";
                  event.target.parentNode.classList.add("library-modal-poster-shell-has-fallback");
                }}
              />
            ) : (
              <div className="library-modal-poster-fallback" aria-hidden="true">
                {movie.title.slice(0, 1)}
              </div>
            )}
          </div>

          <div className="library-modal-body">
            <p className="library-modal-kicker">Ver luego</p>
            <h2 className="library-modal-title">{movie.title}</h2>
            <div className="library-modal-meta">
              <span>{movie.release_year ?? "Sin año"}</span>
              <span>·</span>
              <span>{movie.runtime ? `${movie.runtime} min` : "Duración sin dato"}</span>
              <span>·</span>
              <span>{getPrimaryGenreLabel(movie)}</span>
            </div>

            <div className="library-modal-facts">
              <div className="library-modal-fact">
                <span className="library-modal-fact-label">Idioma</span>
                <span className="library-modal-fact-value">{formatLanguageLabel(movie.original_language)}</span>
              </div>
              <div className="library-modal-fact">
                <span className="library-modal-fact-label">Popularidad</span>
                <span className="library-modal-fact-value">{formatPopularity(movie.popularity)}</span>
              </div>
              <div className="library-modal-fact">
                <span className="library-modal-fact-label">Votos</span>
                <span className="library-modal-fact-value">{formatVoteCount(movie.vote_count)}</span>
              </div>
            </div>

            <div className="library-modal-block">
              <p className="library-modal-block-title">Géneros</p>
              <div className="library-provider-list">
                {genreLabels.map((genreLabel) => (
                  <span key={`${movie.tmdb_id}-${genreLabel}`} className="library-provider-pill">
                    {genreLabel}
                  </span>
                ))}
              </div>
            </div>

            <p className="library-modal-overview">
              {movie.overview || "Todavía no tenemos una sinopsis ampliada para esta película."}
            </p>

            {providers.length > 0 ? (
              <div className="library-modal-block">
                <p className="library-modal-block-title">Disponible en</p>
                <div className="library-provider-list">
                  {providers.map((provider) => (
                    <span key={`${movie.tmdb_id}-${provider.provider_id}`} className="library-provider-pill">
                      {provider.provider_name}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function Favorites({ onProfileChange, token }) {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detailMovie, setDetailMovie] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadWatchlist() {
      if (!token) {
        setWatchlist([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await getWatchlistMovies(token);
        if (!cancelled) {
          setWatchlist(Array.isArray(response.items) ? response.items : []);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || "No pudimos cargar tu Ver luego.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadWatchlist();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const watchlistCountLabel = `${watchlist.length} película${watchlist.length !== 1 ? "s" : ""} guardada${watchlist.length !== 1 ? "s" : ""}`;

  async function handleRemove(movie) {
    if (!token) {
      return;
    }

    setRemovingId(movie.tmdb_id);
    setError("");

    try {
      const response = await deleteWatchlistMovie(token, movie.tmdb_id);
      setWatchlist((current) => current.filter((item) => item.tmdb_id !== movie.tmdb_id));
      onProfileChange?.(response.item);
      if (detailMovie?.tmdb_id === movie.tmdb_id) {
        setDetailMovie(null);
      }
    } catch (removeError) {
      setError(removeError.message || "No pudimos quitar esta película de Ver luego.");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <section className="favorites-screen">
      <header className="favorites-screen-header">
        <div>
          <div className="favoritos-title-row">
            <h1 className="favoritos-titulo">Tu Ver luego</h1>
            <span className="favoritos-title-heart" aria-hidden="true">🍿</span>
          </div>
          {watchlist.length > 0 ? (
            <p className="favoritos-subtitulo">{watchlistCountLabel}</p>
          ) : (
            <p className="favoritos-subtitulo">
              Aquí reuniremos las películas que quieras volver a tener a mano.
            </p>
          )}
        </div>

        <Link className="ghost-button" to="/inicio">
          Volver a inicio
        </Link>
      </header>

      {error ? <p className="library-feedback library-feedback-error">{error}</p> : null}

      {loading ? (
        <section className="favorites-empty-card">
          <div className="favorites-empty-icon" aria-hidden="true">⏳</div>
          <h2>Cargando tu Ver luego...</h2>
          <p>Estamos trayendo tus películas guardadas desde tu perfil.</p>
        </section>
      ) : watchlist.length === 0 ? (
        <section className="favorites-empty-card">
          <div className="favorites-empty-icon" aria-hidden="true">🎬</div>
          <h2>Aún no has guardado nada para después</h2>
          <p>
            Cuando en sesión pulses <strong>Ver luego</strong>, tus pelis aparecerán aquí para recuperarlas rápido.
          </p>
          <div className="favorites-empty-actions">
            <Link className="primary-button" to="/sesion">
              Encontrar película
            </Link>
          </div>
        </section>
      ) : (
        <section className="favorites-grid" aria-label="Películas guardadas para ver luego">
          {watchlist.map((movie) => (
            <article key={movie.tmdb_id} className="favorito-card">
              <div className="favorito-poster-wrapper">
                {movie.poster_path ? (
                  <img
                    src={getPosterUrl(movie)}
                    alt={movie.title}
                    className="favorito-poster"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = "none";
                      e.target.parentNode.classList.add("favorito-poster-has-fallback");
                    }}
                  />
                ) : (
                  <div className="favorito-poster-fallback" aria-hidden="true" />
                )}
              </div>

              <div className="favorito-card-body">
                <h2 className="favorito-nombre">{movie.title}</h2>
                <p className="favorito-genero">{getPrimaryGenreLabel(movie)}</p>
                <p className="favorito-año">
                  <span className="favorito-año-icon" aria-hidden="true">📅</span>
                  {movie.release_year ?? "Sin año"}
                </p>

                <div className="favorito-acciones">
                  <button
                    className="btn-ver"
                    type="button"
                    onClick={() => setDetailMovie(movie)}
                  >
                    Ver detalles
                  </button>
                  <button
                    className="btn-eliminar"
                    disabled={removingId === movie.tmdb_id}
                    type="button"
                    onClick={() => {
                      void handleRemove(movie);
                    }}
                  >
                    {removingId === movie.tmdb_id ? "Quitando..." : "Quitar de Ver luego"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {detailMovie ? (
        <MovieDetailModal movie={detailMovie} onClose={() => setDetailMovie(null)} />
      ) : null}
    </section>
  );
}

export default Favorites;
