import { useEffect, useMemo, useState } from "react";

import {
  HARD_NO_OPTIONS,
  LANGUAGE_OPTIONS,
  ONBOARDING_STEPS,
  PLATFORM_OPTIONS,
  PROFILE_FIELD_LABELS,
  emptyProfileDraft,
  firstIncompleteStepIndex,
  optionLabelByValue,
} from "./config/onboarding";
import {
  getApiBaseUrl,
  getAuthenticatedUser,
  getProfile,
  loginUser,
  logoutUser,
  patchProfile,
  registerUser,
  skipProfile,
} from "./lib/api";

const AUTH_TOKEN_KEY = "moodfix_access_token";

function mergeProfileIntoDraft(profile) {
  return {
    ...emptyProfileDraft(),
    ...profile,
  };
}

function profileLooksCompleted(profile) {
  return Boolean(profile?.onboarding_completed || profile?.onboarding_skipped);
}

function formatSelection(step, value) {
  if (step.id === "pais") {
    return optionLabelByValue(step.options, value);
  }

  if (step.id === "tolerancia_subtitulos") {
    return optionLabelByValue(step.options, value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => optionLabelByValue(step.options, item)).join(", ");
  }

  return value ?? "Sin definir";
}

function StepSearchField({ step, draft, onSelect }) {
  const [query, setQuery] = useState("");
  const selectedValues = Array.isArray(draft[step.id]) ? draft[step.id] : [];

  useEffect(() => {
    setQuery("");
  }, [step.id]);

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
      <div className="search-step">
        <input
          className="search-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Busca una opcion"
        />
        <div className="search-results">
          {filteredOptions.map((option) => (
            <button
              key={option.value}
              className={`option-chip search-result ${
                draft[step.id] === option.value ? "selected" : ""
              }`}
              type="button"
              onClick={() => onSelect(step.id, option.value)}
            >
              <span>{option.label}</span>
              <span className="option-meta">{option.value}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="search-step">
      <input
        className="search-input"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Busca uno o varios idiomas"
      />
      <div className="search-results">
        {filteredOptions.map((option) => (
          <button
            key={option.value}
            className={`option-chip search-result ${
              selectedValues.includes(option.value) ? "selected" : ""
            }`}
            type="button"
            onClick={() =>
              onSelect(
                step.id,
                selectedValues.includes(option.value)
                  ? selectedValues.filter((value) => value !== option.value)
                  : [...selectedValues, option.value],
              )
            }
          >
            <span>{option.label}</span>
            <span className="option-meta">{option.value}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepGridField({ step, draft, onSelect }) {
  const selectedValues = Array.isArray(draft[step.id]) ? draft[step.id] : [];
  return (
    <div className="options-grid">
      {step.options.map((option) => {
        const selected = selectedValues.includes(option.value);
        return (
          <button
            key={option.value}
            className={`option-card ${selected ? "selected" : ""}`}
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
            <span className="option-meta">{option.value}</span>
          </button>
        );
      })}
      <button
        className={`option-card option-card-clear ${
          selectedValues.length === 0 ? "selected" : ""
        }`}
        type="button"
        onClick={() => onSelect(step.id, [])}
      >
        Sin restricciones
      </button>
    </div>
  );
}

function StepSingleChoiceField({ step, draft, onSelect }) {
  return (
    <div className="single-choice">
      {step.options.map((option) => (
        <button
          key={option.value}
          className={`option-row ${draft[step.id] === option.value ? "selected" : ""}`}
          type="button"
          onClick={() => onSelect(step.id, option.value)}
        >
          <span>{option.label}</span>
          <span className="option-meta">{option.value}</span>
        </button>
      ))}
    </div>
  );
}

function OnboardingStep({ step, draft, onSelect }) {
  if (step.type === "single-search" || step.type === "multi-search") {
    return <StepSearchField step={step} draft={draft} onSelect={onSelect} />;
  }

  if (step.type === "multi-grid") {
    return <StepGridField step={step} draft={draft} onSelect={onSelect} />;
  }

  return <StepSingleChoiceField step={step} draft={draft} onSelect={onSelect} />;
}

export default function App() {
  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [draft, setDraft] = useState(emptyProfileDraft);
  const [stepIndex, setStepIndex] = useState(0);
  const [loadingSession, setLoadingSession] = useState(true);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [savingStep, setSavingStep] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const currentStep = ONBOARDING_STEPS[stepIndex];
  const isLastStep = stepIndex === ONBOARDING_STEPS.length - 1;
  const onboardingDone = profileLooksCompleted(profile);

  useEffect(() => {
    const storedToken = window.localStorage.getItem(AUTH_TOKEN_KEY);
    if (!storedToken) {
      setLoadingSession(false);
      return;
    }

    void bootstrapSession(storedToken);
  }, []);

  async function bootstrapSession(nextToken) {
    try {
      setLoadingSession(true);
      setError("");
      const [mePayload, profilePayload] = await Promise.all([
        getAuthenticatedUser(nextToken),
        getProfile(nextToken),
      ]);
      setToken(nextToken);
      setUser(mePayload.user);
      setProfile(profilePayload.item);
      setDraft(mergeProfileIntoDraft(profilePayload.item));
      setStepIndex(firstIncompleteStepIndex(profilePayload.item));
      window.localStorage.setItem(AUTH_TOKEN_KEY, nextToken);
    } catch (sessionError) {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
      setToken(null);
      setUser(null);
      setProfile(null);
      setDraft(emptyProfileDraft());
      setError(sessionError.message);
    } finally {
      setLoadingSession(false);
    }
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();
    try {
      setAuthSubmitting(true);
      setError("");
      const payload =
        authMode === "register"
          ? await registerUser(email, password)
          : await loginUser(email, password);
      setMessage(authMode === "register" ? "Cuenta creada. Vamos al onboarding." : "Sesion iniciada.");
      await bootstrapSession(payload.auth.access_token);
    } catch (authError) {
      setError(authError.message);
    } finally {
      setAuthSubmitting(false);
    }
  }

  async function handleLogout() {
    try {
      if (token) {
        await logoutUser(token);
      }
    } catch {
      // Si el token ya no es valido, limpiamos el estado igualmente.
    } finally {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
      setToken(null);
      setUser(null);
      setProfile(null);
      setDraft(emptyProfileDraft());
      setEmail("");
      setPassword("");
      setEditing(false);
      setMessage("Sesion cerrada.");
      setError("");
    }
  }

  function updateDraft(field, value) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [field]: value,
      onboarding_skipped: false,
    }));
  }

  async function saveCurrentStep(markCompleted = false) {
    if (!token || !currentStep) {
      return;
    }

    const payload = {
      [currentStep.id]: draft[currentStep.id],
    };

    if (markCompleted) {
      payload.onboarding_completed = true;
      payload.onboarding_skipped = false;
    }

    setSavingStep(true);
    setError("");

    try {
      const response = await patchProfile(token, payload);
      setProfile(response.item);
      setDraft(mergeProfileIntoDraft(response.item));
      setMessage(markCompleted ? "Perfil guardado. Onboarding completado." : "Paso guardado.");
      if (!markCompleted) {
        setStepIndex((currentValue) => Math.min(currentValue + 1, ONBOARDING_STEPS.length - 1));
      } else {
        setEditing(false);
      }
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSavingStep(false);
    }
  }

  async function handleSkip() {
    if (!token) {
      return;
    }

    setSavingStep(true);
    setError("");
    try {
      const response = await skipProfile(token);
      setProfile(response.item);
      setDraft(mergeProfileIntoDraft(response.item));
      setEditing(false);
      setMessage("Onboarding omitido. Siempre podras completarlo mas tarde.");
    } catch (skipError) {
      setError(skipError.message);
    } finally {
      setSavingStep(false);
    }
  }

  function startEditing() {
    setEditing(true);
    setStepIndex(firstIncompleteStepIndex(draft));
    setMessage("");
    setError("");
  }

  if (loadingSession) {
    return (
      <main className="app-shell">
        <section className="panel panel-centered">
          <p className="eyebrow">MoodFix</p>
          <h1>Cargando sesion y perfil...</h1>
          <p className="lead">Conectando con {getApiBaseUrl()}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="panel hero-panel">
        <p className="eyebrow">MoodFix</p>
        <h1>Perfil estable y onboarding conectados al backend</h1>
        <p className="lead">
          Este flujo ya trabaja contra la API real de auth y profile. Los valores del
          formulario siguen el contrato tecnico del proyecto.
        </p>
        <div className="status-row">
          <span className="status-pill">API: {getApiBaseUrl()}</span>
          <span className="status-pill">Pais: ISO alpha-2</span>
          <span className="status-pill">Plataformas: provider_id</span>
          <span className="status-pill">No rotundos: genre_id</span>
        </div>
      </section>

      {error ? <div className="feedback feedback-error">{error}</div> : null}
      {message ? <div className="feedback feedback-success">{message}</div> : null}

      {!token ? (
        <section className="panel auth-layout">
          <div className="auth-copy">
            <h2>Entrar antes del onboarding</h2>
            <p>
              EPIC 2 deja el perfil estable detras de autenticacion. Primero
              registramos o iniciamos sesion y despues persistimos el onboarding.
            </p>
          </div>

          <form className="auth-card" onSubmit={handleAuthSubmit}>
            <div className="auth-tabs">
              <button
                className={authMode === "login" ? "active" : ""}
                type="button"
                onClick={() => setAuthMode("login")}
              >
                Login
              </button>
              <button
                className={authMode === "register" ? "active" : ""}
                type="button"
                onClick={() => setAuthMode("register")}
              >
                Registro
              </button>
            </div>

            <label className="field">
              <span>Email</span>
              <input
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                required
                type="email"
                value={email}
              />
            </label>

            <label className="field">
              <span>Password</span>
              <input
                autoComplete={authMode === "register" ? "new-password" : "current-password"}
                minLength={8}
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </label>

            <button className="primary-button" disabled={authSubmitting} type="submit">
              {authSubmitting
                ? "Enviando..."
                : authMode === "register"
                  ? "Crear cuenta y continuar"
                  : "Entrar y continuar"}
            </button>
          </form>
        </section>
      ) : (
        <section className="panel onboarding-layout">
          <header className="profile-header">
            <div>
              <p className="eyebrow">Usuario autenticado</p>
              <h2>{user?.email}</h2>
            </div>
            <button className="ghost-button" type="button" onClick={handleLogout}>
              Cerrar sesion
            </button>
          </header>

          {!editing && onboardingDone ? (
            <section className="summary-card">
              <h3>Perfil estable listo</h3>
              <p>
                El onboarding ya esta guardado. Puedes reabrirlo para editar cualquier
                campo o seguir usando este estado como base del motor.
              </p>

              <dl className="summary-grid">
                {ONBOARDING_STEPS.map((step) => (
                  <div key={step.id}>
                    <dt>{PROFILE_FIELD_LABELS[step.id]}</dt>
                    <dd>{formatSelection(step, profile?.[step.id]) || "Sin definir"}</dd>
                  </div>
                ))}
              </dl>

              <div className="summary-actions">
                <button className="primary-button" type="button" onClick={startEditing}>
                  Editar perfil
                </button>
              </div>
            </section>
          ) : (
            <section className="onboarding-card">
              <div className="step-meta">
                <span className="step-pill">
                  Paso {stepIndex + 1} de {ONBOARDING_STEPS.length}
                </span>
                {profile?.onboarding_skipped ? (
                  <span className="step-pill muted">Perfil reabierto tras skip</span>
                ) : null}
              </div>

              <h3>{currentStep.title}</h3>
              <p className="step-description">{currentStep.description}</p>

              <OnboardingStep step={currentStep} draft={draft} onSelect={updateDraft} />

              <div className="step-actions">
                <button
                  className="ghost-button"
                  disabled={savingStep || stepIndex === 0}
                  type="button"
                  onClick={() => setStepIndex((currentValue) => Math.max(currentValue - 1, 0))}
                >
                  Anterior
                </button>

                <div className="step-actions-right">
                  <button
                    className="ghost-button"
                    disabled={savingStep}
                    type="button"
                    onClick={handleSkip}
                  >
                    Skip
                  </button>
                  <button
                    className="primary-button"
                    disabled={savingStep}
                    type="button"
                    onClick={() => saveCurrentStep(isLastStep)}
                  >
                    {savingStep
                      ? "Guardando..."
                      : isLastStep
                        ? "Finalizar onboarding"
                        : "Guardar y seguir"}
                  </button>
                </div>
              </div>
            </section>
          )}
        </section>
      )}
    </main>
  );
}
