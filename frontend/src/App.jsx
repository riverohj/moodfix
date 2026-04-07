import { useEffect, useState } from "react";

import {
  ONBOARDING_STEPS,
  PROFILE_FIELD_LABELS,
  emptyProfileDraft,
  firstIncompleteStepIndex,
  optionLabelByValue,
} from "./config/onboarding";
import AppRoutes from "./routes";
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
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [draft, setDraft] = useState(emptyProfileDraft);
  const [stepIndex, setStepIndex] = useState(0);
  const [loadingSession, setLoadingSession] = useState(true);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [savingStep, setSavingStep] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingSingleStep, setEditingSingleStep] = useState(false);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [authFeedback, setAuthFeedback] = useState({
    login: { error: "", message: "" },
    signup: { error: "", message: "" },
  });

  const currentStep = ONBOARDING_STEPS[stepIndex];
  const isLastStep = stepIndex === ONBOARDING_STEPS.length - 1;
  const onboardingDone = profileLooksCompleted(profile);
  const isAuthenticated = Boolean(token);

  function resetAuthFeedback() {
    setAuthFeedback({
      login: { error: "", message: "" },
      signup: { error: "", message: "" },
    });
  }

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
      setEditing(false);
      setEditingSingleStep(false);
      setShowProfilePanel(false);
      window.localStorage.setItem(AUTH_TOKEN_KEY, nextToken);
    } catch (sessionError) {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
      setToken(null);
      setUser(null);
      setProfile(null);
      setDraft(emptyProfileDraft());
      setEditingSingleStep(false);
      setError(sessionError.message);
    } finally {
      setLoadingSession(false);
    }
  }

  async function handleLoginSubmit(email, password) {
    try {
      setAuthSubmitting(true);
      resetAuthFeedback();
      setError("");
      setMessage("");
      const payload = await loginUser(email, password);
      setAuthFeedback({
        login: { error: "", message: "Sesión iniciada." },
        signup: { error: "", message: "" },
      });
      await bootstrapSession(payload.auth.access_token);
    } catch (authError) {
      setAuthFeedback({
        login: { error: authError.message, message: "" },
        signup: { error: "", message: "" },
      });
    } finally {
      setAuthSubmitting(false);
    }
  }

  async function handleRegisterSubmit(email, password) {
    try {
      setAuthSubmitting(true);
      resetAuthFeedback();
      setError("");
      setMessage("");
      const payload = await registerUser(email, password);
      setAuthFeedback({
        login: { error: "", message: "" },
        signup: { error: "", message: "Cuenta creada. Vamos al onboarding." },
      });
      await bootstrapSession(payload.auth.access_token);
    } catch (authError) {
      setAuthFeedback({
        login: { error: "", message: "" },
        signup: { error: authError.message, message: "" },
      });
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
      setEditing(false);
      setShowProfilePanel(false);
      setAuthFeedback({
        login: { error: "", message: "Sesión cerrada." },
        signup: { error: "", message: "" },
      });
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

      if (editingSingleStep) {
        setMessage("Respuesta guardada.");
        setEditing(false);
        setEditingSingleStep(false);
        setShowProfilePanel(false);
        window.setTimeout(() => {
          window.location.assign("/mis-gustos");
        }, 0);
        return;
      }

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
      setEditingSingleStep(false);
      setShowProfilePanel(false);
      setMessage("Has saltado este paso por ahora. Podrás completarlo más tarde.");
    } catch (skipError) {
      setError(skipError.message);
    } finally {
      setSavingStep(false);
    }
  }

  function startEditing(targetStepId = null) {
    setEditing(true);
    setEditingSingleStep(Boolean(targetStepId));
    setShowProfilePanel(false);
    if (targetStepId) {
      const matchingIndex = ONBOARDING_STEPS.findIndex((step) => step.id === targetStepId);
      setStepIndex(matchingIndex >= 0 ? matchingIndex : firstIncompleteStepIndex(draft));
    } else {
      setStepIndex(firstIncompleteStepIndex(draft));
    }
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

  return (
    <AppRoutes
      authFeedback={authFeedback}
      currentStep={currentStep}
      draft={draft}
      error={error}
      formatSelection={formatSelection}
      isAuthenticated={isAuthenticated}
      isLastStep={isLastStep}
      loadingSession={loadingSession}
      message={message}
      onboardingDone={onboardingDone}
      onAdvance={() => saveCurrentStep(isLastStep)}
      onCloseProfilePanel={closeProfilePanel}
      onEditStep={startEditing}
      onFieldChange={updateDraft}
      onLogin={handleLoginSubmit}
      onLogout={handleLogout}
      onOpenProfilePanel={openProfilePanel}
      onPrevious={() => setStepIndex((currentValue) => Math.max(currentValue - 1, 0))}
      onRegister={handleRegisterSubmit}
      onSkip={handleSkip}
      onStartEditing={startEditing}
      profile={profile}
      savingStep={savingStep}
      showProfilePanel={showProfilePanel}
      stepIndex={stepIndex}
      submitting={authSubmitting}
      user={user}
      editing={editing}
      editingSingleStep={editingSingleStep}
      profileFieldLabels={PROFILE_FIELD_LABELS}
    />
  );
}
