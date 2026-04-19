import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../css/HistoryScreen.css";
import {
  deleteHistoryMovie,
  getHistoryMovies,
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

function HistoryDetailModal({ movie, onClose }) {
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
            <p className="library-modal-kicker">Historial</p>
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

export default function HistoryScreen({ onProfileChange, token }) {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detailMovie, setDetailMovie] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      if (!token) {
        setHistoryItems([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await getHistoryMovies(token);
        if (!cancelled) {
          setHistoryItems(Array.isArray(response.items) ? response.items : []);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || "No pudimos cargar tu historial.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadHistory();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const historyCountLabel = `${historyItems.length} película${historyItems.length !== 1 ? "s" : ""} vista${historyItems.length !== 1 ? "s" : ""}`;

  async function handleRemove(movie) {
    if (!token) {
      return;
    }

    setRemovingId(movie.tmdb_id);
    setError("");

    try {
      const response = await deleteHistoryMovie(token, movie.tmdb_id);
      setHistoryItems((current) => current.filter((item) => item.tmdb_id !== movie.tmdb_id));
      onProfileChange?.(response.item);
      if (detailMovie?.tmdb_id === movie.tmdb_id) {
        setDetailMovie(null);
      }
    } catch (removeError) {
      setError(removeError.message || "No pudimos quitar esta película del historial.");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <section className="history-screen">
      <header className="history-screen-header">
        <div>
          <div className="history-title-row">
            <h1 className="history-section-title">
              <span className="history-title-line">Tu historial</span>
              <span className="history-title-line">de visualización</span>
            </h1>
            <span className="history-title-icon" aria-hidden="true">🎬</span>
          </div>
          {historyItems.length > 0 ? (
            <p className="history-screen-description">{historyCountLabel}</p>
          ) : (
            <p className="history-screen-description">
              Aquí reuniremos las películas que ya has marcado como vistas.
            </p>
          )}
        </div>

        <Link className="ghost-button" to="/inicio">
          Volver a inicio
        </Link>
      </header>

      {error ? <p className="library-feedback library-feedback-error">{error}</p> : null}

      {loading ? (
        <section className="history-empty-card">
          <div className="history-empty-icon" aria-hidden="true">⏳</div>
          <h2>Cargando tu historial...</h2>
          <p>Estamos recuperando las películas que ya has marcado como vistas.</p>
        </section>
      ) : historyItems.length > 0 ? (
        <section className="history-grid" aria-label="Historial de visualización">
          {historyItems.map((item) => (
            <article className="history-card" key={item.tmdb_id}>
              <div className="history-poster-wrapper">
                {item.poster_path ? (
                  <img
                    alt={item.title}
                    className="history-poster"
                    src={getPosterUrl(item)}
                    onError={(event) => {
                      event.target.onerror = null;
                      event.target.style.display = "none";
                      event.target.parentNode.classList.add("history-poster-has-fallback");
                    }}
                  />
                ) : (
                  <div className="history-poster-fallback" aria-hidden="true" />
                )}
              </div>

              <div className="history-card-body">
                <h2 className="history-card-title">{item.title}</h2>
                <p className="history-card-genre">{getPrimaryGenreLabel(item)}</p>
                <p className="history-card-date">
                  <span className="history-date-icon" aria-hidden="true">
                    📅
                  </span>
                  {item.release_year ?? "Sin año"}
                </p>

                <div className="history-card-actions">
                  <button
                    className="history-card-button"
                    type="button"
                    onClick={() => setDetailMovie(item)}
                  >
                    Ver detalles
                  </button>
                  <button
                    className="history-card-button history-card-button-secondary"
                    disabled={removingId === item.tmdb_id}
                    type="button"
                    onClick={() => {
                      void handleRemove(item);
                    }}
                  >
                    {removingId === item.tmdb_id ? "Quitando..." : "Quitar del historial"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="history-empty-card">
          <div className="history-empty-icon" aria-hidden="true">🕘</div>
          <h2>Aún no hay recorrido guardado</h2>
          <p>
            Cuando marques una peli como <strong>Ya la he visto</strong> o <strong>¡Quiero esta!</strong>,
            aparecerá aquí.
          </p>
          <div className="history-empty-actions">
            <Link className="primary-button" to="/sesion">
              Encontrar película
            </Link>
          </div>
        </section>
      )}

      {detailMovie ? (
        <HistoryDetailModal movie={detailMovie} onClose={() => setDetailMovie(null)} />
      ) : null}
    </section>
  );
}
