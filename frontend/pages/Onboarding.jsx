import { useEffect, useMemo, useState } from "react";

import "../css/AppShell.css";
import "../css/OnboardingScreen.css";
import {
  LANGUAGE_OPTIONS,
  ONBOARDING_STEPS,
  PLATFORM_OPTIONS,
  optionLabelByValue,
} from "../src/config/onboarding";
import netflixLogo from "../src/assets/platform/logo_netflix.jpg";
import movistarLogo from "../src/assets/platform/logotipo_movistarplus.jpg";
import hbomaxLogo from "../src/assets/platform/hbo_max_logo.jpg";
import disneyLogo from "../src/assets/platform/logo_disney.png";
import primevideoLogo from "../src/assets/platform/prime_video_logo.png";
import filminLogo from "../src/assets/platform/logo_filmin.jpg";
import appleLogo from "../src/assets/platform/Apple_TV_Plus_29.png";
import skyLogo from "../src/assets/platform/sky_logo.png";
import rakutenLogo from "../src/assets/platform/logo_rakuten.jpg";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const selectedValues = Array.isArray(draftValue) ? draftValue : [];

  useEffect(() => {
    if (step.type === "single-search") {
      setSearchTerm(draftValue ? optionLabelByValue(step.options, draftValue) : "");
    } else {
      setSearchTerm("");
    }
    setShowOptions(false);
    setHighlightedIndex(0);
  }, [draftValue, step.options, step.type]);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();
    if (!normalizedQuery) {
      return step.options;
    }

    return step.options.filter((option) => option.label.toLowerCase().includes(normalizedQuery));
  }, [searchTerm, step.options]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredOptions]);

  function handleSelect(option) {
    if (step.type === "multi-search") {
      const nextValues = selectedValues.includes(option.value)
        ? selectedValues.filter((value) => value !== option.value)
        : [...selectedValues, option.value];
      onSelect(step.id, nextValues);
      setSearchTerm("");
      return;
    }

    onSelect(step.id, option.value);
    setSearchTerm(option.label);
    setShowOptions(false);
  }

  return (
    <div className="autocomplete-wrapper">
      <input
        className="onboarding-input"
        onChange={(event) => {
          setSearchTerm(event.target.value);
          setShowOptions(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setShowOptions(true);
            setHighlightedIndex((currentValue) =>
              Math.min(currentValue + 1, Math.max(filteredOptions.length - 1, 0)),
            );
          }

          if (event.key === "ArrowUp") {
            event.preventDefault();
            setShowOptions(true);
            setHighlightedIndex((currentValue) => Math.max(currentValue - 1, 0));
          }

          if (event.key === "Enter" && filteredOptions[highlightedIndex]) {
            event.preventDefault();
            handleSelect(filteredOptions[highlightedIndex]);
          }

          if (event.key === "Escape") {
            setShowOptions(false);
          }
        }}
        onFocus={() => setShowOptions(true)}
        placeholder={step.placeholder}
        value={searchTerm}
      />

      {step.type === "multi-search" && selectedValues.length > 0 ? (
        <div className="options-grid onboarding-selected-options">
          {selectedValues.map((value) => (
            <button
              className="option-btn selected"
              key={value}
              type="button"
              onClick={() =>
                onSelect(
                  step.id,
                  selectedValues.filter((currentValue) => currentValue !== value),
                )
              }
            >
              {optionLabelByValue(LANGUAGE_OPTIONS, value)}
            </button>
          ))}
        </div>
      ) : null}

      {showOptions && filteredOptions.length > 0 ? (
        <div className="autocomplete-dropdown">
          {filteredOptions.map((option, index) => (
            <div
              className={`autocomplete-item ${index === highlightedIndex ? "autocomplete-item-active" : ""}`}
              key={option.value}
              onClick={() => handleSelect(option)}
              onMouseEnter={() => setHighlightedIndex(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleSelect(option);
                }
              }}
              role="button"
              tabIndex={0}
            >
              {option.label}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function PlatformsField({ draftValue, onSelect }) {
  const selectedValues = Array.isArray(draftValue) ? draftValue : [];

  return (
    <div className="platforms-container">
      {PLATFORM_OPTIONS.map((platform) => {
        const selected = selectedValues.includes(platform.value);
        return (
          <button
            className={`platform-card ${selected ? "selected" : ""}`}
            key={platform.value}
            type="button"
            onClick={() => {
              const nextValues = selected
                ? selectedValues.filter((value) => value !== platform.value)
                : [...selectedValues, platform.value];
              onSelect("plataformas", nextValues);
            }}
          >
            <div className="platform-img-wrapper">
              <img
                alt={platform.label}
                className="platform-logo-img"
                src={platformLogos[platform.value]}
              />
            </div>
            <span className="platform-name">{platform.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function SingleChoiceField({ step, draftValue, onSelect }) {
  return (
    <div className="vertical-options">
      {step.options.map((option) => (
        <button
          className={`option-btn-long ${draftValue === option.value ? "selected" : ""}`}
          key={option.value}
          type="button"
          onClick={() => onSelect(step.id, option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function HardNoField({ step, draftValue, onSelect }) {
  const selectedValues = Array.isArray(draftValue) ? draftValue : [];

  return (
    <div className="no-rotundos-layout">
      <div className="no-rotundos-grid">
        {step.options.map((option) => (
          <button
            className={`option-btn ${selectedValues.includes(option.value) ? "selected" : ""}`}
            key={option.value}
            type="button"
            onClick={() => {
              const nextValues = selectedValues.includes(option.value)
                ? selectedValues.filter((value) => value !== option.value)
                : [...selectedValues, option.value];
              onSelect(step.id, nextValues);
            }}
          >
            {option.label}
          </button>
        ))}
      </div>

      <button
        className={`option-btn btn-valiente ${selectedValues.length === 0 ? "selected" : ""}`}
        type="button"
        onClick={() => onSelect(step.id, [])}
      >
        Ninguno, soy valiente
      </button>
    </div>
  );
}

function OnboardingIntro({ onStart, onSkip, savingStep }) {
  return (
    <div className="onboarding-wrapper">
      <div className="onboarding-container">
        <div className="onboarding-card onboarding-card-intro">
          <div className="card-header">
            <h1 className="onboarding-title">Vamos a conocernos...</h1>
            <p className="complice-box">
              Te haremos unas pocas preguntas para afinar tus recomendaciones.
            </p>
          </div>

          <div className="responses-zone">
            <p className="onboarding-intro-detail">
              Son cinco preguntas rápidas. Y ya está.
            </p>
          </div>

          <div className="skip-footer" style={{ flexDirection: "column", gap: "12px" }}>
            <button className="onboarding-start-btn" type="button" onClick={onStart}>
              Empezar
            </button>
            <button className="skip-btn" disabled={savingStep} type="button" onClick={onSkip}>
              Saltar por ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OnboardingStepTitle({ step }) {
  if (step.id === "pais") {
    return (
      <h1 className="onboarding-title onboarding-title-split">
        <span>Lo primero,</span>
        <span>¿desde dónde nos ves? 🌍</span>
      </h1>
    );
  }

  return <h1 className="onboarding-title">{step.title}</h1>;
}

export default function Onboarding({
  draft,
  isLastStep,
  onAdvance,
  onFieldChange,
  onPrevious,
  onSkip,
  savingStep,
  singleStepMode = false,
  stepIndex,
  error,
  message,
}) {
  const currentStep = ONBOARDING_STEPS[stepIndex];
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [introSeen, setIntroSeen] = useState(false);

  // Muestra la intro solo si estamos en el paso 0 y aún no se ha visto
  if (!singleStepMode && !introSeen && stepIndex === 0) {
    return (
      <OnboardingIntro
        savingStep={savingStep}
        onSkip={onSkip}
        onStart={() => setIntroSeen(true)}
      />
    );
  }

  return (
    <main className="app-shell">
      {error ? <div className="feedback feedback-error">{error}</div> : null}
      {message ? <div className="feedback feedback-success">{message}</div> : null}

      <div className="onboarding-wrapper">
        {showSkipModal ? (
          <div className="modal-overlay-fixed">
            <div className="modal-content-custom">
              <h2>¿Seguro que quieres saltar? 🛑</h2>
              <p>
                Si no completas el perfil ahora, tus recomendaciones serán más genéricas. Pero no
                te preocupes, siempre podrás completarlo más tarde.
              </p>
              <div className="modal-actions-custom">
                <button
                  className="modal-btn-back"
                  type="button"
                  onClick={() => setShowSkipModal(false)}
                >
                  Volver al test
                </button>
                <button
                  className="modal-btn-skip-anyway"
                  disabled={savingStep}
                  type="button"
                  onClick={async () => {
                    await onSkip();
                    setShowSkipModal(false);
                  }}
                >
                  Saltar por ahora
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="onboarding-container">
          <button
            className={`nav-arrow left ${stepIndex === 0 || singleStepMode ? "hidden" : ""}`}
            disabled={stepIndex === 0 || singleStepMode}
            type="button"
            onClick={onPrevious}
          >
            <span className="arrow-icon">&lt;</span>
            <span className="arrow-text">ANTERIOR</span>
          </button>

          <div className="onboarding-card">
            <div className="card-header">
              <OnboardingStepTitle step={currentStep} />
              <p className="complice-box">{currentStep.description}</p>
            </div>

            <div className="responses-zone">
              {currentStep.type === "single-search" || currentStep.type === "multi-search" ? (
                <AutocompleteField
                  draftValue={draft[currentStep.id]}
                  onSelect={onFieldChange}
                  step={currentStep}
                />
              ) : null}

              {currentStep.id === "plataformas" ? (
                <PlatformsField draftValue={draft[currentStep.id]} onSelect={onFieldChange} />
              ) : null}

              {currentStep.type === "single-choice" ? (
                <SingleChoiceField
                  draftValue={draft[currentStep.id]}
                  onSelect={onFieldChange}
                  step={currentStep}
                />
              ) : null}

              {currentStep.id === "no_rotundos" ? (
                <HardNoField
                  draftValue={draft[currentStep.id]}
                  onSelect={onFieldChange}
                  step={currentStep}
                />
              ) : null}
            </div>

            {!singleStepMode ? (
              <div className="skip-footer">
                <button className="skip-btn" type="button" onClick={() => setShowSkipModal(true)}>
                  Saltar por ahora
                </button>
              </div>
            ) : null}
          </div>

          <button
            className={`nav-arrow right ${isLastStep || singleStepMode ? "btn-finish" : ""}`}
            disabled={savingStep}
            type="button"
            onClick={onAdvance}
          >
            <span className="arrow-text">
              {savingStep ? "GUARDANDO" : singleStepMode ? "GUARDAR" : isLastStep ? "FINALIZAR" : "SIGUIENTE"}
            </span>
            <span className="arrow-icon">{isLastStep || singleStepMode ? "✓" : ">"}</span>
          </button>
        </div>
      </div>
    </main>
  );
}
