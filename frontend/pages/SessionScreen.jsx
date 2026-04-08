import { useEffect, useState } from "react";

import "../css/SessionScreen.css";
import {
  DISCOVERY_OPTIONS,
  ENERGY_OPTIONS,
  ERA_OPTIONS,
  MOCK_RESULTS,
  MOOD_OPTIONS,
  TIME_OPTIONS,
} from "../src/config/session";

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

function MoodChip({ active, children, onClick }) {
  return (
    <button
      className={`session-pill ${active ? "session-pill-active" : ""}`}
      type="button"
      onClick={onClick}
    >
      {children}
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
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const allProviders = movie.providers.filter((p) => p.provider_type === "flatrate");

  return (
    <div className="rc-modal-backdrop" onClick={onClose}>
      <div
        className="rc-modal"
        role="dialog"
        aria-modal
        aria-label={movie.title}
        onClick={(e) => e.stopPropagation()}
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
            <span className="rc-year">{movie.release_year}</span>
            <span className="rc-dot" aria-hidden>·</span>
            <span className="rc-runtime">{movie.runtime} min</span>
            {movie.original_language && movie.original_language !== "es" ? (
              <>
                <span className="rc-dot" aria-hidden>·</span>
                <span className="rc-lang">{movie.original_language.toUpperCase()}</span>
              </>
            ) : null}
            {allProviders.length > 0 ? (
              <>
                <span className="rc-dot" aria-hidden>·</span>
                <span className="rc-provider">
                  {allProviders.map((p) => p.provider_name).join(", ")}
                </span>
              </>
            ) : null}
          </div>

          <h2 className="rc-modal-title">{movie.title}</h2>

          <p className="rc-modal-overview">{movie.overview}</p>

          {movie.reason ? (
            <p className="rc-reason">
              <span className="rc-reason-label">Por qué te la proponemos</span>
              {movie.reason}
            </p>
          ) : null}
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

// ── Card de resultado ─────────────────────────────────────────────────────────

function ResultCard({ movie, onOpenDetail }) {
  // action: null | "saved" | "seen" | "dismissed"
  const [action, setAction] = useState(null);
  // showRating: true mientras se pide la valoración (tras pulsar "Ya la he visto")
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(null);
  // ratingDone: true una vez confirmada, para mostrar el mensaje de agradecimiento
  const [ratingDone, setRatingDone] = useState(false);

  const flatrateProviders = movie.providers
    .filter((p) => p.provider_type === "flatrate")
    .map((p) => p.provider_name);

  function handleSeen() {
    setAction("seen");
    setShowRating(true);
  }

  function handleRate(n) {
    setRating(n);
    setRatingDone(true);
    // TODO (EPIC 3 backend): enviar { tmdb_id: movie.tmdb_id, rating: n } a POST /api/history
  }

  function handleSave() {
    setAction("saved");
    // TODO (EPIC 3 backend): enviar { tmdb_id: movie.tmdb_id } a POST /api/watchlist
  }

  function handleDismiss() {
    setAction("dismissed");
    // TODO (EPIC 3 backend): enviar { tmdb_id: movie.tmdb_id } a POST /api/discard
  }

  // Estado descartado: card colapsada con opción de deshacer
  if (action === "dismissed") {
    return (
      <article className="rc-card rc-card-dismissed">
        <span className="rc-dismissed-title">{movie.title}</span>
        <button
          className="rc-dismissed-undo"
          type="button"
          onClick={() => setAction(null)}
        >
          Deshacer
        </button>
      </article>
    );
  }

  return (
    <article className={`rc-card ${action === "seen" ? "rc-card-seen" : ""} ${action === "saved" ? "rc-card-saved" : ""}`}>

      {/* Póster */}
      <div className="rc-poster" aria-hidden>
        {movie.poster_path ? (
          <img
            alt={movie.title}
            className="rc-poster-img"
            loading="lazy"
            src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
          />
        ) : (
          <span className="rc-poster-initial">{movie.title.slice(0, 1)}</span>
        )}
        {action === "saved" ? <span className="rc-poster-badge rc-poster-badge-saved">Ver luego</span> : null}
        {action === "seen" && !showRating ? <span className="rc-poster-badge rc-poster-badge-seen">Vista {rating ? `· ${"★".repeat(rating)}` : ""}</span> : null}
      </div>

      {/* Contenido */}
      <div className="rc-body">
        <div className="rc-meta">
          <span className="rc-year">{movie.release_year}</span>
          <span className="rc-dot" aria-hidden>·</span>
          <span className="rc-runtime">{movie.runtime} min</span>
          {movie.original_language && movie.original_language !== "es" ? (
            <>
              <span className="rc-dot" aria-hidden>·</span>
              <span className="rc-lang">{movie.original_language.toUpperCase()}</span>
            </>
          ) : null}
          {flatrateProviders.length > 0 ? (
            <>
              <span className="rc-dot" aria-hidden>·</span>
              <span className="rc-provider">{flatrateProviders[0]}</span>
            </>
          ) : null}
        </div>

        <h3 className="rc-title">{movie.title}</h3>

        <p className="rc-overview">{movie.overview}</p>
        <button className="rc-more-btn" type="button" onClick={onOpenDetail}>
          Ver sinopsis completa
        </button>

        {/* Zona "Por qué te la proponemos" — preparada, se activa cuando el backend la devuelva */}
        {movie.reason ? (
          <p className="rc-reason">
            <span className="rc-reason-label">Por qué te la proponemos</span>
            {movie.reason}
          </p>
        ) : null}

        {/* Zona de valoración (al pulsar "Ya la he visto") */}
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
                  onClick={() => { setShowRating(false); }}
                >
                  Saltar valoración
                </button>
              </>
            )}
          </div>
        ) : null}

        {/* Acciones */}
        {!showRating ? (
          <div className="rc-actions">
            <div className="rc-actions-primary">
              <button
                className={`rc-btn-save ${action === "saved" ? "rc-btn-save-active" : ""}`}
                type="button"
                onClick={action === "saved" ? () => setAction(null) : handleSave}
              >
                {action === "saved" ? "Guardada" : "Ver luego"}
              </button>
              <button
                className={`rc-btn-seen ${action === "seen" ? "rc-btn-seen-active" : ""}`}
                type="button"
                onClick={action === "seen" ? () => setAction(null) : handleSeen}
              >
                Ya la he visto
              </button>
            </div>
            <button className="rc-btn-dismiss" type="button" onClick={handleDismiss}>
              No me interesa
            </button>
          </div>
        ) : null}
      </div>

    </article>
  );
}

function ResultsView({ mode, results, onBack, onGoHome, onRestart }) {
  const [detailMovie, setDetailMovie] = useState(null);

  return (
    <ViewShell>
      <div className="session-results-header">
        <div>
          <p className="session-mode-tag">
            {mode === "preguntame" ? "Pregúntame" : "Sorpréndeme"}
          </p>
          <h1 className="session-detail-title">Tus 3 para hoy</h1>
          <p className="session-detail-copy session-detail-copy-wide">
            Guarda, descarta o marca las que ya viste.
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

      <div className="rc-grid">
        {results.map((movie) => (
          <ResultCard
            key={movie.id}
            movie={movie}
            onOpenDetail={() => setDetailMovie(movie)}
          />
        ))}
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
  onGoToOnboarding,
  // onLogout y userEmail siguen en props para compatibilidad con routes, ya no se renderizan
  onLogout,
  onOpenProfile,
  userEmail,
}) {
  const [view, setView] = useState("landing");
  const [results, setResults] = useState([]);
  const [lastMode, setLastMode] = useState("preguntame");
  const [searching, setSearching] = useState(false);
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

  function updateDraft(field, value) {
    setDraft((current) => ({
      ...current,
      [field]: current[field] === value ? null : value,
    }));
  }

  function resetSession() {
    setResults([]);
    setView("landing");
    setSearching(false);
    setAskStepIndex(0);
    setPendingMode(null);
    setShowInlineNudge(false);
  }

  function runMockSearch(mode) {
    setSearching(true);
    setLastMode(mode);
    setShowInlineNudge(false);

    // TODO (EPIC 3 backend): sustituir este mock por postSessionRecommend(token, payload)
    window.setTimeout(() => {
      setResults(MOCK_RESULTS.slice(0, 3));
      setView("results");
      setSearching(false);
    }, 900);
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
        runMockSearch("sorprendeme");
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
      runMockSearch("preguntame");
      return;
    }

    setAskStepIndex((current) => current + 1);
  }

  return (
    <section className="session-screen">
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
          onSearch={() => runMockSearch("sorprendeme")}
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
          results={results}
          onBack={() => setView(lastMode)}
          onGoHome={onGoHome}
          onRestart={resetSession}
        />
      ) : null}
    </section>
  );
}
