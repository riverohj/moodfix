import { useEffect, useState } from "react";

import "../css/SessionScreen.css";
import {
  DISCOVERY_OPTIONS,
  ENERGY_OPTIONS,
  ERA_OPTIONS,
  MOOD_OPTIONS,
  TIME_OPTIONS,
} from "../src/config/session";
import {
  deleteWatchlistMovie,
  postDiscardMovie,
  postHistoryMovie,
  postSessionRecommend,
  postWatchlistMovie,
} from "../src/lib/api";
import {
  formatLanguageLabel,
  formatPopularity,
  formatVoteCount,
  getFlatrateProviders,
  getGenreLabels,
} from "../src/lib/movieMetadata";

const ASK_STEPS = [
  {
    id: "mood",
    title: "¿Qué te apetece hoy?",
    description: "¿Qué experiencia te apetece?",
    options: MOOD_OPTIONS,
    required: true,
  },
  {
    id: "preferencia_tiempo",
    title: "¿Cómo vas de tiempo?",
    description: "¿Algo rapidito o tenemos tiempo?",
    options: TIME_OPTIONS,
    required: false,
  },
  {
    id: "preferencia_energia",
    title: "¿Cuál es tu nivel de energía?",
    description: "¿Cuánto quieres estrujar el cerebro hoy?",
    options: ENERGY_OPTIONS,
    required: false,
  },
  {
    id: "seguro_o_descubrir",
    title: "¿Qué prefieres hoy?",
    description: "¿Cómo de mainstream eres hoy?",
    options: DISCOVERY_OPTIONS,
    required: false,
  },
  {
    id: "preferencia_epoca",
    title: "¿Cuál es tu época hoy?",
    description: "Súbete a nuestro DeLorean.",
    options: ERA_OPTIONS,
    required: false,
  },
];

// ── Banner de perfil incompleto (ligero, no bloquea) ──────────────────────────

function ProfileNudgeBanner({ onCompleteProfile, onContinue, pendingMode }) {
  const selectedModeLabel = pendingMode === "sorprendeme" ? "Sorpréndeme" : "Pregúntame";

  return (
    <div className="session-inline-nudge">
      <p className="session-inline-nudge-copy">
        Si no has completado{" "}
        <button className="session-inline-link" type="button" onClick={onCompleteProfile}>
          tus gustos
        </button>
        , las recomendaciones serán más genéricas.
      </p>
      <div className="session-inline-nudge-actions">
        <button className="session-choice-button session-choice-button-secondary" type="button" onClick={onContinue}>
          Continuar igualmente
        </button>
        <button className="session-choice-button" type="button" onClick={onCompleteProfile}>
          Completar tus gustos
        </button>
      </div>
      <p className="session-inline-nudge-hint">
        {selectedModeLabel === "Sorpréndeme"
          ? "Si continúas, lanzaremos directamente una recomendación rápida."
          : "Si continúas, entrarás directamente en las preguntas."}
      </p>
    </div>
  );
}

function ViewShell({ children, compact = false }) {
  return (
    <section className={`session-view-shell ${compact ? "session-view-shell-compact" : ""}`}>
      {children}
    </section>
  );
}

function ChoiceButton({ children, onClick }) {
  return (
    <button className="session-choice-button" type="button" onClick={onClick}>
      {children}
    </button>
  );
}

function SessionFeedback({ message }) {
  if (!message) {
    return null;
  }

  return <p className="session-feedback session-feedback-error">{message}</p>;
}

function MoodChip({ active, children, sublabel, onClick }) {
  return (
    <button
      className={`session-pill ${active ? "session-pill-active" : ""} ${sublabel ? "session-pill-has-sub" : ""}`}
      type="button"
      onClick={onClick}
    >
      <span className="session-pill-label">{children}</span>
      {sublabel ? <span className="session-pill-sublabel">{sublabel}</span> : null}
    </button>
  );
}

function StepArrow({ children, hidden = false, onClick, disabled = false }) {
  return (
    <button
      className={`session-nav-arrow ${hidden ? "session-nav-arrow-hidden" : ""}`}
      disabled={disabled}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function LandingView({
  onAsk,
  onSurprise,
  onContinueWithoutProfile,
  onCompleteProfile,
  pendingMode,
  searching,
  showNudge,
}) {
  return (
    <ViewShell compact>
      <div className="session-home-card">
        <h1 className="session-home-title">
          <span className="session-home-line">"No sé qué ver hoy"</span>
          <span className="session-home-line">¡Rompe el bucle!</span>
        </h1>
        <p className="session-home-copy">A veces la peli te elige a ti.</p>

        {showNudge ? (
          <ProfileNudgeBanner
            pendingMode={pendingMode}
            onCompleteProfile={onCompleteProfile}
            onContinue={onContinueWithoutProfile}
          />
        ) : searching ? (
          <div className="session-home-loading">
            <p className="session-home-loading-title">Estamos buscando tus 3 para hoy...</p>
            <p className="session-home-loading-copy">
              Un momento y te enseñamos una selección rápida.
            </p>
          </div>
        ) : (
          <div className="session-home-actions">
            <ChoiceButton onClick={onAsk}>Pregúntame</ChoiceButton>
            <ChoiceButton onClick={onSurprise}>Sorpréndeme</ChoiceButton>
          </div>
        )}
      </div>
    </ViewShell>
  );
}

function SurpriseView({ onBack, onSearch, searching }) {
  return (
    <ViewShell compact>
      <div className="session-detail-card">
        <div>
          <p className="session-mode-tag">Modo rápido</p>
          <h1 className="session-detail-title">Déjalo en nuestras manos</h1>
          <p className="session-detail-copy">
            Teniendo en cuenta tu perfil, te proponemos algo sin preguntas extra. Una
            recomendación directa, con personalidad.
          </p>
        </div>

        <div className="session-detail-actions">
          <button className="ghost-button" type="button" onClick={onBack}>
            Volver
          </button>
          <button className="session-primary-button" disabled={searching} type="button" onClick={onSearch}>
            {searching ? "Buscando..." : "Sorpréndeme"}
          </button>
        </div>
      </div>
    </ViewShell>
  );
}

function QuestionStep({
  step,
  stepIndex,
  stepValue,
  onSelect,
  onBack,
  onNext,
  searching,
  isFirstStep,
  isLastStep,
}) {
  const canAdvance = !step.required || Boolean(stepValue);

  return (
    <ViewShell compact>
      <div className="session-question-shell">
        <StepArrow onClick={onBack}>
          <span className="session-nav-icon">&lt;</span>
          <span className="session-nav-copy">{isFirstStep ? "VOLVER" : "ANTERIOR"}</span>
        </StepArrow>

        <div className="session-question-card">
          <div className="session-question-header">
            <p className="session-mode-tag">
              Pregúntame · Paso {stepIndex + 1} de {ASK_STEPS.length}
            </p>
            <h1 className="session-question-title">{step.title}</h1>
            <p className="session-question-copy">{step.description}</p>
          </div>

          <div className="session-question-options">
            <div className="session-pill-grid session-pill-grid-centered">
              {step.options.map((option) => (
                <MoodChip
                  active={stepValue === option.id}
                  key={option.id}
                  sublabel={option.sublabel}
                  onClick={() => onSelect(step.id, option.id)}
                >
                  {option.label}
                </MoodChip>
              ))}
            </div>
          </div>

          {!step.required ? (
            <p className="session-step-hint">Esta pregunta es opcional. Puedes seguir sin elegir.</p>
          ) : null}
        </div>

        <StepArrow
          disabled={!canAdvance || searching}
          onClick={onNext}
        >
          <span className="session-nav-copy">
            {searching ? "BUSCANDO" : isLastStep ? "BUSCAR" : "SIGUIENTE"}
          </span>
          <span className="session-nav-icon">{isLastStep ? "✓" : ">"}</span>
        </StepArrow>
      </div>
    </ViewShell>
  );
}

// ── Modal de detalle de película ─────────────────────────────────────────────

function MovieDetailModal({ movie, onClose }) {
  useEffect(() => {
    function handleKey(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const allProviders = getFlatrateProviders(movie);
  const genreLabels = getGenreLabels(movie);

  return (
    <div className="rc-modal-backdrop" onClick={onClose}>
      <div
        className="rc-modal"
        role="dialog"
        aria-modal="true"
        aria-label={movie.title}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          aria-label="Cerrar"
          className="rc-modal-close"
          type="button"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="rc-modal-media">
          {movie.poster_path ? (
            <img
              alt={movie.title}
              className="rc-modal-poster"
              src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
            />
          ) : (
            <div className="rc-modal-poster-fallback" aria-hidden="true">
              {movie.title.slice(0, 1)}
            </div>
          )}
        </div>

        <div className="rc-modal-body">
          <div className="rc-meta">
            <span className="rc-year">{movie.release_year ?? "Sin año"}</span>
            <span className="rc-dot" aria-hidden="true">·</span>
            <span className="rc-runtime">
              {movie.runtime ? `${movie.runtime} min` : "Duración sin dato"}
            </span>
            {movie.original_language ? (
              <>
                <span className="rc-dot" aria-hidden="true">·</span>
                <span className="rc-lang">{formatLanguageLabel(movie.original_language)}</span>
              </>
            ) : null}
            {allProviders.length > 0 ? (
              <>
                <span className="rc-dot" aria-hidden="true">·</span>
                <span className="rc-provider">
                  {allProviders.map((provider) => provider.provider_name).join(", ")}
                </span>
              </>
            ) : null}
          </div>

          <h2 className="rc-modal-title">{movie.title}</h2>

          <div className="rc-modal-facts">
            <div className="rc-modal-fact">
              <span className="rc-modal-fact-label">Año</span>
              <span className="rc-modal-fact-value">{movie.release_year ?? "Sin dato"}</span>
            </div>
            <div className="rc-modal-fact">
              <span className="rc-modal-fact-label">Duración</span>
              <span className="rc-modal-fact-value">
                {movie.runtime ? `${movie.runtime} min` : "Sin dato"}
              </span>
            </div>
            <div className="rc-modal-fact">
              <span className="rc-modal-fact-label">Idioma original</span>
              <span className="rc-modal-fact-value">
                {formatLanguageLabel(movie.original_language)}
              </span>
            </div>
            <div className="rc-modal-fact">
              <span className="rc-modal-fact-label">Popularidad</span>
              <span className="rc-modal-fact-value">{formatPopularity(movie.popularity)}</span>
            </div>
            <div className="rc-modal-fact">
              <span className="rc-modal-fact-label">Votos</span>
              <span className="rc-modal-fact-value">{formatVoteCount(movie.vote_count)}</span>
            </div>
            <div className="rc-modal-fact">
              <span className="rc-modal-fact-label">TMDB</span>
              <span className="rc-modal-fact-value">#{movie.tmdb_id ?? "Sin dato"}</span>
            </div>
          </div>

          <div className="rc-modal-genre-block">
            <p className="rc-modal-section-title">Géneros</p>
            <div className="rc-modal-genre-list">
              {genreLabels.map((genreLabel) => (
                <span key={`${movie.tmdb_id}-${genreLabel}`} className="rc-modal-genre-pill">
                  {genreLabel}
                </span>
              ))}
            </div>
          </div>

          {allProviders.length > 0 ? (
            <div className="rc-platform-block">
              <p className="rc-platform-title">Disponible en</p>
              <ProviderLinks movie={movie} />
            </div>
          ) : null}

          <p className="rc-modal-overview">{movie.overview}</p>

        </div>
      </div>
    </div>
  );
}

// ── Estrellitas de valoración ─────────────────────────────────────────────────

function StarRating({ value, onRate }) {
  const [hovered, setHovered] = useState(null);
  const active = hovered ?? value;

  return (
    <div className="rc-stars" onMouseLeave={() => setHovered(null)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          aria-label={`${n} estrella${n > 1 ? "s" : ""}`}
          className={`rc-star ${n <= active ? "rc-star-on" : ""}`}
          key={n}
          type="button"
          onClick={() => onRate(n)}
          onMouseEnter={() => setHovered(n)}
        >
          {n <= active ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
}

function ProviderLinks({ movie, compact = false }) {
  const flatrateProviders = getFlatrateProviders(movie);

  if (flatrateProviders.length === 0) {
    return null;
  }

  return (
    <div className={`rc-provider-links ${compact ? "rc-provider-links-compact" : ""}`}>
      {flatrateProviders.map((provider) => (
        <span
          key={`${movie.tmdb_id}-${provider.provider_id}`}
          className="rc-provider-link"
        >
          {provider.provider_name}
        </span>
      ))}
    </div>
  );
}

function PopcornBurst() {
  return (
    <div className="popcorn-burst" aria-hidden="true">
      {Array.from({ length: 18 }, (_, index) => (
        <span
          key={index}
          className="popcorn-piece"
          style={{
            "--angle": `${index * 20}deg`,
            "--distance": `${58 + (index % 3) * 18}px`,
            "--delay": `${index * 0.025}s`,
          }}
        >
          🍿
        </span>
      ))}
    </div>
  );
}

function SuccessCelebration({ movie, onReset }) {
  return (
    <div className="session-success-card">
      <PopcornBurst />
      <p className="session-mode-tag">Noche resuelta</p>
      <h2 className="session-success-title">¡Hamburguesa salvada!</h2>
      <p className="session-success-copy">
        Has elegido <strong>{movie.title}</strong>. La guardamos en tu historial para que luego
        puedas puntuarla.
      </p>
      <ProviderLinks compact movie={movie} />
      <div className="session-success-actions">
        <button className="ghost-button" type="button" onClick={onReset}>
          Volver a películas sugeridas
        </button>
      </div>
    </div>
  );
}

// ── Resultado de una sola película ───────────────────────────────────────────

function ResultCard({
  movie,
  index,
  total,
  state,
  onOpenDetail,
  onPersistAction,
  onUpdateMovieState,
}) {
  const {
    action = null,
    showRating = false,
    rating = null,
    ratingDone = false,
    actionNotice = "",
    showCelebration = false,
  } = state ?? {};
  const [savingAction, setSavingAction] = useState(false);
  const [actionError, setActionError] = useState("");

  const flatrateProviders = getFlatrateProviders(movie).map((provider) => provider.provider_name);

  async function persistAction(nextAction) {
    setSavingAction(true);
    setActionError("");

    try {
      const nextState = await onPersistAction(nextAction, movie, state);
      onUpdateMovieState(movie.tmdb_id, nextState);
      return true;
    } catch (error) {
      setActionError(error.message || "No pudimos guardar esta acción.");
      return false;
    } finally {
      setSavingAction(false);
    }
  }

  async function handleWatchNow() {
    await persistAction("watch_now");
  }

  async function handleSeen() {
    await persistAction("seen");
  }

  function handleRate(n) {
    onUpdateMovieState(movie.tmdb_id, {
      ...state,
      action: "seen",
      rating: n,
      ratingDone: true,
      showRating: true,
      actionNotice: "Vista guardada. Tus estrellas se quedan anotadas en esta sesión.",
    });
  }

  async function handleSave() {
    await persistAction("saved");
  }

  async function handleDismiss() {
    await persistAction("dismissed");
  }

  if (showCelebration) {
    return (
      <SuccessCelebration
        movie={movie}
        onReset={() =>
          onUpdateMovieState(movie.tmdb_id, {
            ...state,
            action: "seen",
            showCelebration: false,
            showRating: true,
            actionNotice: "Añadida al historial. Si quieres, déjale tus estrellas.",
          })
        }
      />
    );
  }

  if (action === "dismissed") {
    return (
      <div className="session-success-card session-success-card-muted">
        <p className="session-mode-tag">Película {index + 1} de {total}</p>
        <h2 className="session-success-title">Anotado</h2>
        <p className="session-success-copy">
          <strong>{movie.title}</strong> queda fuera de tus próximas recomendaciones.
        </p>
        {actionNotice ? <p className="session-success-hint">{actionNotice}</p> : null}
      </div>
    );
  }

  return (
    <article className={`rc-feature ${action === "seen" ? "rc-feature-seen" : ""} ${action === "saved" ? "rc-feature-saved" : ""}`}>
      <div className="rc-feature-media">
        <div className="rc-poster rc-poster-feature" aria-hidden="true">
          {movie.poster_path ? (
            <img
              alt={movie.title}
              className="rc-poster-img"
              loading="lazy"
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            />
          ) : (
            <span className="rc-poster-initial">{movie.title.slice(0, 1)}</span>
          )}
          <span className="rc-feature-counter">Película {index + 1} de {total}</span>
          {action === "saved" ? <span className="rc-poster-badge rc-poster-badge-saved">Ver luego</span> : null}
          {action === "seen" && !showRating ? <span className="rc-poster-badge rc-poster-badge-seen">Vista {rating ? `· ${"★".repeat(rating)}` : ""}</span> : null}
        </div>
      </div>

      <div className="rc-feature-body">
        <div className="rc-meta">
          <span className="rc-year">{movie.release_year ?? "Sin año"}</span>
          <span className="rc-dot" aria-hidden="true">·</span>
          <span className="rc-runtime">
            {movie.runtime ? `${movie.runtime} min` : "Duración sin dato"}
          </span>
          {movie.original_language ? (
            <>
              <span className="rc-dot" aria-hidden="true">·</span>
              <span className="rc-lang">{formatLanguageLabel(movie.original_language)}</span>
            </>
          ) : null}
          {flatrateProviders.length > 0 ? (
            <>
              <span className="rc-dot" aria-hidden="true">·</span>
              <span className="rc-provider">{flatrateProviders.join(", ")}</span>
            </>
          ) : null}
        </div>

        <h3 className="rc-title rc-title-feature">{movie.title}</h3>

        {movie.razon_ia ? (
          <p className="rc-razon-ia">{movie.razon_ia}</p>
        ) : null}

        <p className="rc-overview rc-overview-feature">{movie.overview}</p>

        {flatrateProviders.length > 0 ? (
          <div className="rc-platform-block">
            <p className="rc-platform-title">Disponible en</p>
            <ProviderLinks movie={movie} />
          </div>
        ) : null}

        <button className="rc-more-btn" type="button" onClick={onOpenDetail}>
          Ver ficha completa
        </button>

        {showRating ? (
          <div className="rc-rating-zone">
            {ratingDone ? (
              <p className="rc-rating-thanks">
                Anotado{rating ? ` · ${"★".repeat(rating)}` : ""}. Gracias.
              </p>
            ) : (
              <>
                <p className="rc-rating-prompt">¿Qué te pareció?</p>
                <StarRating value={rating} onRate={handleRate} />
                <button
                  className="rc-rating-skip"
                  type="button"
                  onClick={() =>
                    onUpdateMovieState(movie.tmdb_id, {
                      ...state,
                      showRating: false,
                    })
                  }
                >
                  Saltar valoración
                </button>
              </>
            )}
          </div>
        ) : null}

        {actionNotice ? <p className="session-feedback session-feedback-success rc-inline-notice">{actionNotice}</p> : null}
        {actionError ? <p className="session-feedback session-feedback-error rc-inline-error">{actionError}</p> : null}

        {!showRating ? (
          <div className="rc-action-grid">
            <button
              className="rc-btn-watch"
              disabled={savingAction || action === "seen" || action === "dismissed"}
              type="button"
              onClick={() => { void handleWatchNow(); }}
            >
              {savingAction ? "Guardando..." : "¡Quiero esta!"}
            </button>
            <button
              className={`rc-btn-save ${action === "saved" ? "rc-btn-save-active" : ""}`}
              disabled={savingAction || action === "seen" || action === "dismissed"}
              type="button"
              onClick={() => { void handleSave(); }}
            >
              {action === "saved" ? "Quitar de Ver luego" : "Ver luego"}
            </button>
            <button
              className={`rc-btn-seen ${action === "seen" ? "rc-btn-seen-active" : ""}`}
              disabled={savingAction || action === "seen" || action === "dismissed"}
              type="button"
              onClick={() => { void handleSeen(); }}
            >
              Ya la he visto
            </button>
            <button
              className="rc-btn-dismiss"
              disabled={savingAction || action === "seen" || action === "dismissed"}
              type="button"
              onClick={() => { void handleDismiss(); }}
            >
              No me interesa
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function ResultsView({
  mode,
  results,
  movieStates,
  onBack,
  onGoHome,
  onRestart,
  onPersistAction,
  onUpdateMovieState,
}) {
  const [detailMovie, setDetailMovie] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [results]);

  if (results.length === 0) {
    return (
      <ViewShell>
        <div className="session-results-empty">
          <div>
            <p className="session-mode-tag">
              {mode === "preguntame" ? "Pregúntame" : "Sorpréndeme"}
            </p>
            <h1 className="session-detail-title">No hemos encontrado 3 para hoy</h1>
            <p className="session-detail-copy session-detail-copy-wide">
              Prueba otra búsqueda o ajusta tus señales para ampliar el catálogo disponible.
            </p>
          </div>

          <div className="session-results-actions">
            {mode === "preguntame" ? (
              <button className="ghost-button" type="button" onClick={onBack}>
                Ajustar
              </button>
            ) : null}
            <button className="ghost-button" type="button" onClick={onGoHome}>
              Ir al inicio
            </button>
            <button className="session-primary-button" type="button" onClick={onRestart}>
              Nueva búsqueda
            </button>
          </div>
        </div>
      </ViewShell>
    );
  }

  const movie = results[activeIndex];

  return (
    <ViewShell>
      <div className="session-results-header">
        <div>
          <p className="session-mode-tag">
            {mode === "preguntame" ? "Pregúntame" : "Sorpréndeme"}
          </p>
          <h1 className="session-detail-title">Tus 3 para hoy</h1>
          <p className="session-detail-copy session-detail-copy-wide">
            Revisa una a una, decide rápido y ve directo a la que te encaje hoy.
          </p>
        </div>

        <div className="session-results-actions">
          {mode === "preguntame" ? (
            <button className="ghost-button" type="button" onClick={onBack}>
              Ajustar
            </button>
          ) : null}
          <button className="ghost-button" type="button" onClick={onGoHome}>
            Ir al inicio
          </button>
          <button className="session-primary-button" type="button" onClick={onRestart}>
            Nueva búsqueda
          </button>
        </div>
      </div>

      <div className="session-carousel-shell">
        <ResultCard
          key={movie.tmdb_id}
          index={activeIndex}
          movie={movie}
          onOpenDetail={() => setDetailMovie(movie)}
          onPersistAction={onPersistAction}
          onUpdateMovieState={onUpdateMovieState}
          state={movieStates[movie.tmdb_id]}
          total={results.length}
        />
      </div>

      <div className="session-carousel-nav">
        <button
          className="session-carousel-arrow"
          disabled={activeIndex === 0}
          type="button"
          onClick={() => setActiveIndex((current) => Math.max(0, current - 1))}
        >
          <span aria-hidden="true">‹</span>
          <span>Anterior</span>
        </button>

        <button
          className="session-carousel-arrow"
          disabled={activeIndex === results.length - 1}
          type="button"
          onClick={() => setActiveIndex((current) => Math.min(results.length - 1, current + 1))}
        >
          <span>Siguiente</span>
          <span aria-hidden="true">›</span>
        </button>
      </div>

      {detailMovie ? (
        <MovieDetailModal movie={detailMovie} onClose={() => setDetailMovie(null)} />
      ) : null}
    </ViewShell>
  );
}

export default function SessionScreen({
  hasCompletedOnboarding = false,
  onGoHome,
  onProfileChange,
  onGoToOnboarding,
  // onLogout y userEmail siguen en props para compatibilidad con routes, ya no se renderizan
  onLogout,
  onOpenProfile,
  token,
  userEmail,
}) {
  const [view, setView] = useState("landing");
  const [results, setResults] = useState([]);
  const [lastMode, setLastMode] = useState("preguntame");
  const [searching, setSearching] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [askStepIndex, setAskStepIndex] = useState(0);
  const [pendingMode, setPendingMode] = useState(null);
  const [showInlineNudge, setShowInlineNudge] = useState(false);
  const [draft, setDraft] = useState({
    mood: null,
    preferencia_tiempo: null,
    preferencia_energia: null,
    seguro_o_descubrir: null,
    preferencia_epoca: null,
  });
  const [movieStates, setMovieStates] = useState({});

  function updateMovieState(tmdbId, nextState) {
    setMovieStates((current) => ({
      ...current,
      [tmdbId]: nextState,
    }));
  }

  function updateDraft(field, value) {
    setDraft((current) => ({
      ...current,
      [field]: current[field] === value ? null : value,
    }));
  }

  function resetSession() {
    setResults([]);
    setMovieStates({});
    setView("landing");
    setSearching(false);
    setRequestError("");
    setAskStepIndex(0);
    setPendingMode(null);
    setShowInlineNudge(false);
  }

  function buildRequestPayload(mode) {
    if (mode === "sorprendeme") {
      return { mode };
    }

    return {
      mode,
      ...draft,
    };
  }

  async function runSearch(mode) {
    setSearching(true);
    setLastMode(mode);
    setShowInlineNudge(false);
    setRequestError("");

    try {
      const response = await postSessionRecommend(token, buildRequestPayload(mode));
      const items = Array.isArray(response.items) ? response.items : [];
      setResults(items);
      setMovieStates(
        Object.fromEntries(
          items
            .filter((movie) => Boolean(movie?.tmdb_id))
            .map((movie) => [
              movie.tmdb_id,
              {
                action: null,
                showRating: false,
                rating: null,
                ratingDone: false,
                actionNotice: "",
                showCelebration: false,
              },
            ]),
        ),
      );
      setView("results");
    } catch (searchError) {
      setRequestError(searchError.message);
    } finally {
      setSearching(false);
    }
  }

  async function handlePersistAction(action, movie, currentState = {}) {
    if (!token) {
      throw new Error("Necesitas iniciar sesión para guardar acciones.");
    }

    if (!movie?.tmdb_id) {
      throw new Error("Esta película no tiene un tmdb_id válido.");
    }

    if (action === "saved") {
      if (currentState?.action === "saved") {
        const response = await deleteWatchlistMovie(token, movie.tmdb_id);
        onProfileChange?.(response.item);
        return {
          ...currentState,
          action: null,
          actionNotice: "Quitada de Ver luego.",
        };
      }

      const response = await postWatchlistMovie(token, movie.tmdb_id);
      onProfileChange?.(response.item);
      return {
        ...currentState,
        action: "saved",
        actionNotice: "Añadida a Ver luego.",
      };
    }

    if (action === "seen" || action === "watch_now") {
      const response = await postHistoryMovie(token, movie.tmdb_id);
      onProfileChange?.(response.item);
      return {
        ...currentState,
        action: "seen",
        showRating: action === "seen",
        rating: currentState?.rating ?? null,
        ratingDone: currentState?.ratingDone ?? false,
        showCelebration: action === "watch_now",
        actionNotice:
          action === "watch_now"
            ? "¡Añadida al historial! Que la disfrutes."
            : "Añadida al historial. Si quieres, ponle estrellas ahora.",
      };
    }

    if (action === "dismissed") {
      const response = await postDiscardMovie(token, movie.tmdb_id);
      onProfileChange?.(response.item);
      return {
        ...currentState,
        action: "dismissed",
        actionNotice: "No volverá a salirte en esta sesión.",
      };
    }

    throw new Error("Acción no soportada.");
  }

  function goToAsk() {
    setAskStepIndex(0);
    setView("preguntame");
  }

  function openMode(mode) {
    if (!hasCompletedOnboarding) {
      setPendingMode(mode);
      setShowInlineNudge(true);
      return;
    }

    enterMode(mode);
  }

  function enterMode(mode) {
    if (mode === "preguntame") {
      goToAsk();
    } else {
      setView("sorprendeme");
    }
  }

  function handleNudgeContinue() {
    setShowInlineNudge(false);
    if (pendingMode) {
      if (pendingMode === "sorprendeme") {
        void runSearch("sorprendeme");
      } else {
        enterMode(pendingMode);
      }
      setPendingMode(null);
    }
  }

  function handleAskBack() {
    if (askStepIndex === 0) {
      setView("landing");
      return;
    }

    setAskStepIndex((current) => current - 1);
  }

  function handleAskNext() {
    const currentStep = ASK_STEPS[askStepIndex];

    if (currentStep.required && !draft[currentStep.id]) {
      return;
    }

    if (askStepIndex === ASK_STEPS.length - 1) {
      void runSearch("preguntame");
      return;
    }

    setAskStepIndex((current) => current + 1);
  }

  return (
    <section className="session-screen">
      <SessionFeedback message={requestError} />

      {view === "landing" ? (
        <LandingView
          onCompleteProfile={onGoToOnboarding}
          onContinueWithoutProfile={handleNudgeContinue}
          onAsk={() => openMode("preguntame")}
          onSurprise={() => openMode("sorprendeme")}
          pendingMode={pendingMode}
          searching={searching}
          showNudge={showInlineNudge}
        />
      ) : null}

      {view === "sorprendeme" ? (
        <SurpriseView
          searching={searching}
          onBack={() => setView("landing")}
          onSearch={() => {
            void runSearch("sorprendeme");
          }}
        />
      ) : null}

      {view === "preguntame" ? (
        <QuestionStep
          isFirstStep={askStepIndex === 0}
          isLastStep={askStepIndex === ASK_STEPS.length - 1}
          searching={searching}
          step={ASK_STEPS[askStepIndex]}
          stepIndex={askStepIndex}
          stepValue={draft[ASK_STEPS[askStepIndex].id]}
          onBack={handleAskBack}
          onNext={handleAskNext}
          onSelect={updateDraft}
        />
      ) : null}

      {view === "results" ? (
        <ResultsView
          mode={lastMode}
          movieStates={movieStates}
          onPersistAction={handlePersistAction}
          onUpdateMovieState={updateMovieState}
          results={results}
          onBack={() => setView(lastMode)}
          onGoHome={onGoHome}
          onRestart={resetSession}
        />
      ) : null}
    </section>
  );
}
