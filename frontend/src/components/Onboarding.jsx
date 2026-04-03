import { useEffect, useMemo, useState } from "react";

import "./Onboarding.css";
import {
  LANGUAGE_OPTIONS,
  ONBOARDING_STEPS,
  PLATFORM_OPTIONS,
  optionLabelByValue,
} from "../config/onboarding";
import netflixLogo from "../assets/platform/logo_netflix.jpg";
import movistarLogo from "../assets/platform/logotipo_movistarplus.jpg";
import hbomaxLogo from "../assets/platform/hbo_max_logo.jpg";
import disneyLogo from "../assets/platform/logo_disney.png";
import primevideoLogo from "../assets/platform/prime_video_logo.png";
import filminLogo from "../assets/platform/logo_filmin.jpg";
import appleLogo from "../assets/platform/Apple_TV_Plus_29.png";
import skyLogo from "../assets/platform/sky_logo.png";
import rakutenLogo from "../assets/platform/logo_rakuten.jpg";

const platformLogos = {
  8: netflixLogo,
  35: rakutenLogo,
  63: filminLogo,
  119: primevideoLogo,
  337: disneyLogo,
  350: appleLogo,
  1773: skyLogo,
  1899: hbomaxLogo,
  2241: movistarLogo,
};

function AutocompleteField({ step, draftValue, onSelect }) {
  const [query, setQuery] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (step.type === "single-search") {
      setQuery(draftValue ? optionLabelByValue(step.options, draftValue) : "");
    } else {
      setQuery("");
    }
    setShowOptions(false);
  }, [draftValue, step.id, step.options, step.type]);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return step.options;
    }

    return step.options.filter((option) =>
      option.label.toLowerCase().includes(normalizedQuery),
    );
  }, [query, step.options]);

  if (step.type === "single-search") {
    return (
      <div className="lourdes-autocomplete-wrapper">
        <input
          className="lourdes-onboarding-input"
          onChange={(event) => {
            setQuery(event.target.value);
            setShowOptions(true);
          }}
          onFocus={() => setShowOptions(true)}
          placeholder="Escribe aqui..."
          value={query}
        />
        {showOptions && query.trim() ? (
          <div className="lourdes-autocomplete-dropdown">
            {filteredOptions.map((option) => (
              <button
                key={option.value}
                className="lourdes-autocomplete-item"
                type="button"
                onClick={() => {
                  onSelect(step.id, option.value);
                  setQuery(option.label);
                  setShowOptions(false);
                }}
              >
                <span>{option.label}</span>
                <small>{option.value}</small>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  const selectedValues = Array.isArray(draftValue) ? draftValue : [];

  return (
    <div className="lourdes-autocomplete-wrapper">
      <input
        className="lourdes-onboarding-input"
        onChange={(event) => {
          setQuery(event.target.value);
          setShowOptions(true);
        }}
        onFocus={() => setShowOptions(true)}
        placeholder="Busca uno o varios idiomas..."
        value={query}
      />
      <div className="lourdes-chip-list">
        {selectedValues.length > 0 ? (
          selectedValues.map((value) => (
            <span className="lourdes-chip" key={value}>
              {optionLabelByValue(LANGUAGE_OPTIONS, value)}
            </span>
          ))
        ) : (
          <span className="lourdes-chip-placeholder">Sin idiomas seleccionados todavia</span>
        )}
      </div>
      {showOptions ? (
        <div className="lourdes-autocomplete-dropdown">
          {filteredOptions.map((option) => {
            const selected = selectedValues.includes(option.value);
            return (
              <button
                key={option.value}
                className={`lourdes-autocomplete-item ${selected ? "selected" : ""}`}
                type="button"
                onClick={() => {
                  onSelect(
                    step.id,
                    selected
                      ? selectedValues.filter((value) => value !== option.value)
                      : [...selectedValues, option.value],
                  );
                  setQuery("");
                }}
              >
                <span>{option.label}</span>
                <small>{option.value}</small>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function PlatformsField({ draftValue, onSelect }) {
  const selectedValues = Array.isArray(draftValue) ? draftValue : [];
  return (
    <div className="lourdes-platforms-container">
      {PLATFORM_OPTIONS.map((platform) => {
        const selected = selectedValues.includes(platform.value);
        return (
          <button
            key={platform.value}
            className={`lourdes-platform-card ${selected ? "selected" : ""}`}
            type="button"
            onClick={() =>
              onSelect(
                "plataformas",
                selected
                  ? selectedValues.filter((value) => value !== platform.value)
                  : [...selectedValues, platform.value],
              )
            }
          >
            <div className="lourdes-platform-img-wrapper">
              <img
                alt={platform.label}
                className="lourdes-platform-logo-img"
                src={platformLogos[platform.value]}
              />
            </div>
            <span className="lourdes-platform-name">{platform.label}</span>
            <small className="lourdes-option-meta">{platform.value}</small>
          </button>
        );
      })}
    </div>
  );
}

function SingleChoiceField({ step, draftValue, onSelect }) {
  return (
    <div className="lourdes-vertical-options">
      {step.options.map((option) => (
        <button
          key={option.value}
          className={`lourdes-option-btn-long ${draftValue === option.value ? "selected" : ""}`}
          type="button"
          onClick={() => onSelect(step.id, option.value)}
        >
          <span>{option.label}</span>
          <small className="lourdes-option-meta">{option.value}</small>
        </button>
      ))}
    </div>
  );
}

function HardNoField({ step, draftValue, onSelect }) {
  const selectedValues = Array.isArray(draftValue) ? draftValue : [];
  return (
    <div className="lourdes-no-rotundos-layout">
      <div className="lourdes-no-rotundos-grid">
        {step.options.map((option) => {
          const selected = selectedValues.includes(option.value);
          return (
            <button
              key={option.value}
              className={`lourdes-option-btn ${selected ? "selected" : ""}`}
              type="button"
              onClick={() =>
                onSelect(
                  step.id,
                  selected
                    ? selectedValues.filter((value) => value !== option.value)
                    : [...selectedValues, option.value],
                )
              }
            >
              <span>{option.label}</span>
              <small className="lourdes-option-meta">{option.value}</small>
            </button>
          );
        })}
      </div>
      <button
        className={`lourdes-option-btn lourdes-btn-clear ${selectedValues.length === 0 ? "selected" : ""}`}
        type="button"
        onClick={() => onSelect(step.id, [])}
      >
        Ninguno, por ahora
      </button>
    </div>
  );
}

export default function Onboarding({
  draft,
  isLastStep,
  onAdvance,
  onFieldChange,
  onPrevious,
  onSkip,
  profile,
  savingStep,
  stepIndex,
}) {
  const currentStep = ONBOARDING_STEPS[stepIndex];
  const currentValue = draft[currentStep.id];
  const [showSkipModal, setShowSkipModal] = useState(false);

  return (
    <div className="lourdes-onboarding-wrapper">
      {showSkipModal ? (
        <div className="lourdes-modal-overlay-fixed">
          <div className="lourdes-modal-content-custom">
            <h2>Seguro que quieres saltar?</h2>
            <p>
              Si no completas el perfil ahora, las recomendaciones saldran con menos
              precision. Podras volver mas tarde y editarlo sin perder la cuenta.
            </p>
            <div className="lourdes-modal-actions-custom">
              <button
                className="lourdes-modal-btn-back"
                type="button"
                onClick={() => setShowSkipModal(false)}
              >
                Volver al test
              </button>
              <button
                className="lourdes-modal-btn-skip-anyway"
                disabled={savingStep}
                type="button"
                onClick={async () => {
                  await onSkip();
                  setShowSkipModal(false);
                }}
              >
                Saltar de todos modos
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="lourdes-onboarding-container">
        <button
          className={`lourdes-nav-arrow left ${stepIndex === 0 ? "hidden" : ""}`}
          type="button"
          onClick={onPrevious}
        >
          <span className="lourdes-arrow-icon">&lt;</span>
          <span className="lourdes-arrow-text">Anterior</span>
        </button>

        <div className="lourdes-onboarding-card">
          <div className="lourdes-card-header">
            <div className="lourdes-step-eyebrow">
              Paso {stepIndex + 1} de {ONBOARDING_STEPS.length}
              {profile?.onboarding_skipped ? " · perfil reabierto" : ""}
            </div>
            <h1 className="lourdes-onboarding-title">{currentStep.title}</h1>
            <p className="lourdes-complice-box">{currentStep.description}</p>
          </div>

          <div className="lourdes-responses-zone">
            {currentStep.type === "single-search" || currentStep.type === "multi-search" ? (
              <AutocompleteField
                draftValue={currentValue}
                onSelect={onFieldChange}
                step={currentStep}
              />
            ) : null}

            {currentStep.id === "plataformas" ? (
              <PlatformsField draftValue={currentValue} onSelect={onFieldChange} />
            ) : null}

            {currentStep.type === "single-choice" ? (
              <SingleChoiceField
                draftValue={currentValue}
                onSelect={onFieldChange}
                step={currentStep}
              />
            ) : null}

            {currentStep.id === "no_rotundos" ? (
              <HardNoField draftValue={currentValue} onSelect={onFieldChange} step={currentStep} />
            ) : null}
          </div>

          <div className="lourdes-selection-note">
            <span>Valor tecnico actual:</span>
            <code>{JSON.stringify(currentValue)}</code>
          </div>

          <div className="lourdes-skip-footer">
            <button
              className="lourdes-skip-btn"
              type="button"
              onClick={() => setShowSkipModal(true)}
            >
              Skip
            </button>
          </div>
        </div>

        <button
          className={`lourdes-nav-arrow right ${isLastStep ? "btn-finish" : ""}`}
          disabled={savingStep}
          type="button"
          onClick={onAdvance}
        >
          <span className="lourdes-arrow-text">
            {savingStep ? "Guardando..." : isLastStep ? "Finalizar" : "Siguiente"}
          </span>
          <span className="lourdes-arrow-icon">{isLastStep ? "✓" : ">"}</span>
        </button>
      </div>
    </div>
  );
}
