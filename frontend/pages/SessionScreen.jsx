import { useState } from "react";

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

function ResultCard({ movie }) {
  const providers = movie.providers
    .filter((provider) => provider.provider_type === "flatrate")
    .map((provider) => provider.provider_name)
    .join(" · ");

  return (
    <article className="session-result-card">
      <div className="session-result-poster">
        <span>{movie.title.slice(0, 1)}</span>
      </div>

      <div className="session-result-content">
        <div className="session-result-heading">
          <h3>{movie.title}</h3>
          <p>
            {movie.release_year} · {movie.runtime} min
          </p>
        </div>

        <p className="session-result-overview">{movie.overview}</p>

        {providers ? <p className="session-result-provider">{providers}</p> : null}
      </div>
    </article>
  );
}

function ResultsView({ mode, results, onBack, onGoHome, onRestart }) {
  return (
    <ViewShell>
      <div className="session-results-header">
        <div>
          <p className="session-mode-tag">
            {mode === "preguntame" ? "Pregúntame" : "Sorpréndeme"}
          </p>
          <h1 className="session-detail-title">Tus 3 para hoy</h1>
          <p className="session-detail-copy session-detail-copy-wide">
            Tres ideas para arrancar. Si no te encajan, ajustamos y seguimos buscando.
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

      <div className="session-results-grid">
        {results.map((movie) => (
          <ResultCard key={movie.id} movie={movie} />
        ))}
      </div>
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
