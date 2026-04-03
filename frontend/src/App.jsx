import { useEffect, useState } from "react";

import {
  ONBOARDING_STEPS,
  PROFILE_FIELD_LABELS,
  emptyProfileDraft,
  firstIncompleteStepIndex,
  optionLabelByValue,
} from "./config/onboarding";
import Onboarding from "./components/Onboarding";
import {
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
  const [showProfilePanel, setShowProfilePanel] = useState(false);
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
      setShowProfilePanel(false);
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
      setMessage(authMode === "register" ? "Cuenta creada. Vamos al onboarding." : "Sesión iniciada.");
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
      // Si el token ya no es válido, limpiamos el estado igualmente.
    } finally {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
      setToken(null);
      setUser(null);
      setProfile(null);
      setDraft(emptyProfileDraft());
      setEmail("");
      setPassword("");
      setEditing(false);
      setShowProfilePanel(false);
      setMessage("Sesión cerrada.");
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
      onboarding_skipped: false,
    };

    if (markCompleted) {
      payload.onboarding_completed = true;
    }

    setSavingStep(true);
    setError("");

    try {
      const response = await patchProfile(token, payload);
      setProfile(response.item);
      setDraft(mergeProfileIntoDraft(response.item));
      setMessage(markCompleted ? "Perfil guardado. Ya puedes seguir." : "Paso guardado.");
      if (!markCompleted) {
        setStepIndex((currentValue) => Math.min(currentValue + 1, ONBOARDING_STEPS.length - 1));
      } else {
        setEditing(false);
        setShowProfilePanel(false);
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
      setShowProfilePanel(false);
      setMessage("Has saltado este paso por ahora. Podrás completarlo más tarde.");
    } catch (skipError) {
      setError(skipError.message);
    } finally {
      setSavingStep(false);
    }
  }

  function startEditing() {
    setEditing(true);
    setShowProfilePanel(false);
    setStepIndex(firstIncompleteStepIndex(draft));
    setMessage("");
    setError("");
  }

  function openProfilePanel() {
    setShowProfilePanel(true);
    setMessage("");
    setError("");
  }

  function closeProfilePanel() {
    setShowProfilePanel(false);
    setMessage("");
    setError("");
  }

  if (loadingSession) {
    return (
      <main className="app-shell">
        <section className="panel panel-centered">
          <p className="eyebrow">MoodFix</p>
          <h1>Cargando sesión y perfil...</h1>
          <p className="lead">Estamos preparando tu experiencia.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      {error ? <div className="feedback feedback-error">{error}</div> : null}
      {message ? <div className="feedback feedback-success">{message}</div> : null}

      {!token ? (
        <section className="panel auth-layout">
          <div className="auth-copy">
            <p className="eyebrow">MoodFix</p>
            <h2>Antes de empezar, entra en tu cuenta</h2>
            <p>
              Queremos guardar tus preferencias para que las recomendaciones tengan continuidad
              cada vez que vuelvas.
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
        <section className="onboarding-flow-shell">
          {!editing && onboardingDone ? (
            <section className="panel onboarding-layout">
              <header className="profile-header profile-header-plain">
                <div>
                  <p className="eyebrow">MoodFix</p>
                  <h2>{user?.email}</h2>
                </div>
                <div className="header-actions">
                  {showProfilePanel ? (
                    <button className="ghost-button" type="button" onClick={closeProfilePanel}>
                      Volver
                    </button>
                  ) : (
                    <button className="ghost-button" type="button" onClick={openProfilePanel}>
                      Ver perfil
                    </button>
                  )}
                  <button className="ghost-button" type="button" onClick={handleLogout}>
                    Cerrar sesión
                  </button>
                </div>
              </header>
              {showProfilePanel ? (
                <section className="summary-card">
                  <h3>Tu perfil estable</h3>
                  <p>
                    Aquí puedes revisar lo que has guardado y volver a editarlo cuando quieras.
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
                <section className="summary-card post-onboarding-card">
                  <h3>{profile?.onboarding_skipped ? "Seguimos cuando quieras" : "Ya está listo"}</h3>
                  <p>
                    {profile?.onboarding_skipped
                      ? "Has decidido saltarte este paso por ahora. Más adelante podrás completar tu perfil desde “Ver perfil”."
                      : "Ya hemos guardado tus preferencias básicas. Si quieres revisarlas o cambiarlas, las tienes en “Ver perfil”."}
                  </p>
                  <div className="post-onboarding-actions">
                    <button className="primary-button" type="button" onClick={openProfilePanel}>
                      Ver perfil
                    </button>
                  </div>
                </section>
              )}
            </section>
          ) : (
            <Onboarding
              draft={draft}
              isLastStep={isLastStep}
              onAdvance={() => saveCurrentStep(isLastStep)}
              onFieldChange={updateDraft}
              onPrevious={() => setStepIndex((currentValue) => Math.max(currentValue - 1, 0))}
              onSkip={handleSkip}
              profile={profile}
              savingStep={savingStep}
              stepIndex={stepIndex}
            />
          )}
        </section>
      )}
    </main>
  );
}
