import { useState } from "react";

import "./SessionScreen.css";
import {
  DISCOVERY_OPTIONS,
  ENERGY_OPTIONS,
  ERA_OPTIONS,
  MOCK_RESULTS,
  MOOD_OPTIONS,
  TIME_OPTIONS,
} from "../config/session";

// ── Componentes de selección reutilizables ────────────────────────────────────

function ChipGroup({ options, selected, multi, onToggle }) {
  return (
    <div className="session-chips">
      {options.map((option) => {
        const isSelected = multi ? selected.includes(option.id) : selected === option.id;
        return (
          <button
            className={`session-chip ${isSelected ? "selected" : ""}`}
            key={option.id}
            type="button"
            onClick={() => onToggle(option.id)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function OptionCardGroup({ options, selected, onSelect }) {
  return (
    <div className="session-option-cards">
      {options.map((option) => (
        <button
          className={`session-option-card ${selected === option.id ? "selected" : ""}`}
          key={option.id}
          type="button"
          onClick={() => onSelect(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function SectionBlock({ label, title, children }) {
  return (
    <div className="session-block">
      <p className="session-block-label">{label}</p>
      <p className="session-block-title">{title}</p>
      {children}
    </div>
  );
}

// ── Tarjeta de película ───────────────────────────────────────────────────────

function MovieCard({ movie }) {
  const providerNames = movie.providers
    .filter((p) => p.provider_type === "flatrate")
    .map((p) => p.provider_name);

  return (
    <div className="session-movie-card">
      <div className="session-movie-header">
        <h4 className="session-movie-title">{movie.title}</h4>
        <span className="session-movie-meta">
          {movie.release_year} · {movie.runtime} min
        </span>
      </div>
      <p className="session-movie-overview">{movie.overview}</p>
      {providerNames.length > 0 && (
        <div className="session-movie-providers">
          {providerNames.map((name) => (
            <span className="session-provider-pill" key={name}>
              {name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Sección de resultados ─────────────────────────────────────────────────────

function ResultsSection({ results, onReset }) {
  if (results.length === 0) {
    return (
      <div className="session-empty-results">
        <p className="session-empty-title">Sin resultados por ahora</p>
        <p className="session-empty-copy">
          No encontramos nada que encaje del todo. Prueba con otras opciones.
        </p>
        <button className="session-reset-btn" type="button" onClick={onReset}>
          Volver a intentar
        </button>
      </div>
    );
  }

  return (
    <div className="session-results-section">
      <div className="session-results-header">
        <p className="eyebrow">Esto te puede gustar</p>
        <button className="session-reset-link" type="button" onClick={onReset}>
          Nueva búsqueda
        </button>
      </div>
      <div className="session-results">
        {results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

// ── Tab: Sorpréndeme ──────────────────────────────────────────────────────────
// Según el contrato (epic-0-session-signals.md), este modo solo captura `modo_entrada`.
// No recoge señales adicionales — se apoya en el perfil estable del usuario.

function SorprendemView({ onResults }) {
  const [searching, setSearching] = useState(false);

  function handleSearch() {
    setSearching(true);
    // TODO (EPIC 3 backend): reemplazar setTimeout con:
    //   const data = await postSessionRecommend(token, { modo_entrada: "sorprendeme" });
    //   onResults(data.items);
    setTimeout(() => {
      onResults(MOCK_RESULTS);
      setSearching(false);
    }, 900);
  }

  return (
    <div className="session-tab-content">
      <div className="session-copy session-copy--center">
        <h2 className="session-heading">Confía en MoodFix</h2>
        <p className="session-subheading">
          Usamos tu perfil para elegir algo pensado para ti ahora mismo. Sin preguntas.
        </p>
      </div>

      <div className="session-surprise-cta">
        <button
          className="session-cta-btn session-cta-btn--large"
          disabled={searching}
          type="button"
          onClick={handleSearch}
        >
          {searching ? "Buscando…" : "Sorpréndeme"}
        </button>
        <p className="session-cta-hint">
          Nos basamos en tu perfil estable. Si no lo tienes completo, usamos criterios generales.
        </p>
      </div>
    </div>
  );
}

// ── Tab: Pregúntame ───────────────────────────────────────────────────────────
// Recoge: mood, preferencia_tiempo, preferencia_energia, seguro_o_descubrir, preferencia_epoca
// Nombres técnicos según epic-0-session-signals.md

function PreguntameView({ onResults }) {
  const [draft, setDraft] = useState({
    mood: null,
    preferencia_tiempo: null,
    preferencia_energia: null,
    seguro_o_descubrir: null,
    preferencia_epoca: null,
  });
  const [searching, setSearching] = useState(false);

  const canSearch = draft.mood !== null;

  function handleSearch() {
    setSearching(true);
    // TODO (EPIC 3 backend): reemplazar setTimeout con:
    //   const data = await postSessionRecommend(token, { modo_entrada: "preguntame", ...draft });
    //   onResults(data.items);
    setTimeout(() => {
      onResults(MOCK_RESULTS);
      setSearching(false);
    }, 900);
  }

  return (
    <div className="session-tab-content">
      <div className="session-copy">
        <h2 className="session-heading">Cuéntanos qué te apetece</h2>
        <p className="session-subheading">
          Responde lo que quieras. Con el mood ya tenemos suficiente para empezar.
        </p>
      </div>

      <div className="session-blocks">
        <SectionBlock label="Mood" title="¿Qué tipo de experiencia buscas?">
          <ChipGroup
            multi={false}
            options={MOOD_OPTIONS}
            selected={draft.mood}
            onToggle={(id) => setDraft((d) => ({ ...d, mood: id }))}
          />
        </SectionBlock>

        <SectionBlock label="Tiempo" title="¿Cuánto rato tienes?">
          <OptionCardGroup
            options={TIME_OPTIONS}
            selected={draft.preferencia_tiempo}
            onSelect={(id) => setDraft((d) => ({ ...d, preferencia_tiempo: id }))}
          />
        </SectionBlock>

        <SectionBlock label="Energía" title="¿Con qué actitud llegas?">
          <OptionCardGroup
            options={ENERGY_OPTIONS}
            selected={draft.preferencia_energia}
            onSelect={(id) => setDraft((d) => ({ ...d, preferencia_energia: id }))}
          />
        </SectionBlock>

        <SectionBlock label="Descubrimiento" title="¿Qué prefieres, seguridad o sorpresa?">
          <ChipGroup
            multi={false}
            options={DISCOVERY_OPTIONS}
            selected={draft.seguro_o_descubrir}
            onToggle={(id) => setDraft((d) => ({ ...d, seguro_o_descubrir: id }))}
          />
        </SectionBlock>

        <SectionBlock label="Época" title="¿De qué época te apetece algo?">
          <ChipGroup
            multi={false}
            options={ERA_OPTIONS}
            selected={draft.preferencia_epoca}
            onToggle={(id) => setDraft((d) => ({ ...d, preferencia_epoca: id }))}
          />
        </SectionBlock>
      </div>

      <div className="session-cta">
        {!canSearch && (
          <p className="session-cta-hint">
            Elige al menos un mood para continuar. El resto es opcional.
          </p>
        )}
        <button
          className="session-cta-btn"
          disabled={!canSearch || searching}
          type="button"
          onClick={handleSearch}
        >
          {searching ? "Buscando…" : "Buscar películas"}
        </button>
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function SessionScreen() {
  const [activeTab, setActiveTab] = useState("sorprendeme");
  const [results, setResults] = useState(null);

  function handleReset() {
    setResults(null);
  }

  return (
    <div className="session-shell">
      {results !== null ? (
        <ResultsSection results={results} onReset={handleReset} />
      ) : (
        <>
          <div className="session-tabs">
            <button
              className={`session-tab-btn ${activeTab === "sorprendeme" ? "active" : ""}`}
              type="button"
              onClick={() => setActiveTab("sorprendeme")}
            >
              Sorpréndeme
            </button>
            <button
              className={`session-tab-btn ${activeTab === "preguntame" ? "active" : ""}`}
              type="button"
              onClick={() => setActiveTab("preguntame")}
            >
              Pregúntame
            </button>
          </div>

          {activeTab === "sorprendeme" ? (
            <SorprendemView onResults={setResults} />
          ) : (
            <PreguntameView onResults={setResults} />
          )}
        </>
      )}
    </div>
  );
}
