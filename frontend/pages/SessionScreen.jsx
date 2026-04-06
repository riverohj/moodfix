import { useMemo, useState } from "react";

import "../css/SessionScreen.css";
import {
  DISCOVERY_OPTIONS,
  ENERGY_OPTIONS,
  ERA_OPTIONS,
  MOCK_RESULTS,
  MOOD_OPTIONS,
  TIME_OPTIONS,
} from "../config/session";

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

function Header({ userEmail, onLogout, onOpenProfile }) {
  return (
    <header className="session-topbar">
      <div className="session-brand-block">
        <p className="eyebrow">MoodFix</p>
        <h2 className="session-user-email">{userEmail}</h2>
      </div>

      <div className="header-actions">
        <button className="ghost-button" type="button" onClick={onOpenProfile}>
          Ver perfil
        </button>
        <button className="ghost-button" type="button" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </header>
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

function LandingView({ onAsk, onSurprise }) {
  return (
    <ViewShell compact>
      <div className="session-home-card">
        <h1 className="session-home-title">
          <span className="session-home-line">“No sé qué ver hoy”</span>
          <span className="session-home-line">¡Rompe el bucle!</span>
        </h1>
        <p className="session-home-copy">A veces la peli te elige a ti.</p>

        <div className="session-home-actions">
          <ChoiceButton onClick={onAsk}>Pregúntame</ChoiceButton>
          <ChoiceButton onClick={onSurprise}>Sorpréndeme</ChoiceButton>
        </div>
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

function ResultsView({ mode, results, onRestart, onBack }) {
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
          <button className="ghost-button" type="button" onClick={onBack}>
            Ajustar
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

export default function SessionScreen({ onLogout, onOpenProfile, userEmail }) {
  const [view, setView] = useState("landing");
  const [results, setResults] = useState([]);
  const [lastMode, setLastMode] = useState("preguntame");
  const [searching, setSearching] = useState(false);
  const [askStepIndex, setAskStepIndex] = useState(0);
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
  }

  function runMockSearch(mode) {
    setSearching(true);
    setLastMode(mode);

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
      <Header userEmail={userEmail} onLogout={onLogout} onOpenProfile={onOpenProfile} />

      {view === "landing" ? (
        <LandingView onAsk={goToAsk} onSurprise={() => setView("sorprendeme")} />
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
          onRestart={resetSession}
        />
      ) : null}
    </section>
  );
}
