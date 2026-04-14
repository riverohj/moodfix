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

const PREVIEW_HISTORY_ITEMS = [
  {
    tmdb_id: 603,
    title: "The Matrix",
    poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    runtime: 136,
    release_year: 1999,
    original_language: "en",
    overview: "Un programador descubre la verdadera naturaleza de su realidad y su papel en la guerra contra sus controladores.",
    popularity: 88.4,
    vote_count: 26000,
    genre_ids: [28, 878],
    providers: [],
  },
  {
    tmdb_id: 680,
    title: "Pulp Fiction",
    poster_path: "/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg",
    runtime: 154,
    release_year: 1994,
    original_language: "en",
    overview: "Historias cruzadas de crimen, redencion y caos en Los Angeles contadas con el sello de Tarantino.",
    popularity: 74.2,
    vote_count: 29500,
    genre_ids: [53, 80],
    providers: [],
  },
  {
    tmdb_id: 13,
    title: "Forrest Gump",
    poster_path: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    runtime: 142,
    release_year: 1994,
    original_language: "en",
    overview: "La vida de Forrest atraviesa varias decadas de la historia reciente de Estados Unidos de forma inesperada.",
    popularity: 69.1,
    vote_count: 28000,
    genre_ids: [35, 18, 10749],
    providers: [],
  },
  {
    tmdb_id: 155,
    title: "The Dark Knight",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    runtime: 152,
    release_year: 2008,
    original_language: "en",
    overview: "Batman se enfrenta al Joker mientras Gotham cae en una espiral de caos moral y violencia.",
    popularity: 91.3,
    vote_count: 33000,
    genre_ids: [18, 28, 80],
    providers: [],
  },
  {
    tmdb_id: 27205,
    title: "Inception",
    poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    runtime: 148,
    release_year: 2010,
    original_language: "en",
    overview: "Un ladron especializado en extraer secretos de los suenos recibe el encargo opuesto: implantar una idea.",
    popularity: 83.9,
    vote_count: 36000,
    genre_ids: [28, 878, 12],
    providers: [],
  },
  {
    tmdb_id: 238,
    title: "The Godfather",
    poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    runtime: 175,
    release_year: 1972,
    original_language: "en",
    overview: "La saga de la familia Corleone retrata poder, lealtad y violencia dentro del crimen organizado.",
    popularity: 67.8,
    vote_count: 21000,
    genre_ids: [18, 80],
    providers: [],
  },
  {
    tmdb_id: 244786,
    title: "Whiplash",
    poster_path: "/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
    runtime: 107,
    release_year: 2014,
    original_language: "en",
    overview: "Un joven baterista entra en una dinamica extrema con su exigente profesor de conservatorio.",
    popularity: 58.1,
    vote_count: 16000,
    genre_ids: [18, 10402],
    providers: [],
  },
  {
    tmdb_id: 496243,
    title: "Parasite",
    poster_path: "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    runtime: 133,
    release_year: 2019,
    original_language: "ko",
    overview: "La relacion entre dos familias de clases opuestas deriva en una cadena de tensiones y giros oscuros.",
    popularity: 57.4,
    vote_count: 19000,
    genre_ids: [35, 53, 18],
    providers: [],
  },
];

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
        setHistoryItems(PREVIEW_HISTORY_ITEMS);
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
            <h1 className="history-section-title">Tu historial de visualización</h1>
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
                <button
                  className="history-card-badge"
                  type="button"
                  aria-label="Quitar del historial"
                  disabled={removingId === item.tmdb_id}
                  onClick={() => {
                    void handleRemove(item);
                  }}
                >
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M7 7l10 10" />
                    <path d="M17 7 7 17" />
                  </svg>
                </button>
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
