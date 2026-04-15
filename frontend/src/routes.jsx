import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";

import AccountScreen from "../pages/AccountScreen";
import AuthScreen from "../pages/AuthScreen";
import Favorites from "../pages/Favorites";
import HistoryScreen from "../pages/HistoryScreen";
import Home from "../pages/home";
import LoadingScreen from "../pages/LoadingScreen";
import Layout from "../pages/layout";
import Onboarding from "../pages/Onboarding";
import ProfileScreen from "../pages/ProfileScreen";
import SessionScreen from "../pages/SessionScreen";
import ThankYouPage from "../pages/ThankYouPage";
import UserHome from "../pages/UserHome";
import { ONBOARDING_STEPS } from "./config/onboarding";

// Redirige a /thank-you tras registro exitoso
function AuthRoute({ authFeedback, isAuthenticated, onLogin, onRegister, submitting }) {
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate replace to="/inicio" />;
  }

  return (
    <AuthScreen
      loginError={authFeedback.login.error}
      loginMessage={authFeedback.login.message}
      signupError={authFeedback.signup.error}
      signupMessage={authFeedback.signup.message}
      onLogin={onLogin}
      onRegister={async (email, password) => {
        await onRegister(email, password);
        navigate("/thank-you");
      }}
      submitting={submitting}
    />
  );
}

// Redirige a /inicio tras pulsar Skip en el onboarding
function OnboardingRoute({ draft, error, isLastStep, message, onAdvance, onFieldChange, onPrevious, onSkip, savingStep, singleStepMode, stepIndex }) {
  const navigate = useNavigate();

  return (
    <Onboarding
      draft={draft}
      error={error}
      isLastStep={isLastStep}
      message={message}
      onAdvance={onAdvance}
      onFieldChange={onFieldChange}
      onPrevious={onPrevious}
      onSkip={async () => {
        await onSkip();
        navigate("/inicio");
      }}
      savingStep={savingStep}
      singleStepMode={singleStepMode}
      stepIndex={stepIndex}
    />
  );
}

function LayoutRoute({ isAuthenticated, onLogout }) {
  const navigate = useNavigate();

  return (
    <Layout
      isAuthenticated={isAuthenticated}
      onLogin={() => navigate("/auth")}
      onLogout={async () => {
        await onLogout();
        navigate("/");
      }}
    />
  );
}

function LandingRoute({ isAuthenticated }) {
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate replace to="/inicio" />;
  }

  return (
    <Home
      ctaLabel="Empieza ahora"
      onPrimaryAction={() => navigate("/auth")}
    />
  );
}

function ProtectedRoute({ allow, children, redirectTo }) {
  if (!allow) {
    return <Navigate replace to={redirectTo} />;
  }

  return children;
}

function SessionPreviewRoute({
  hasCompletedOnboarding = false,
  onGoHome,
  onGoToOnboarding,
  onLogout,
  onProfileChange,
  sessionToken,
  userEmail,
}) {
  const navigate = useNavigate();

  return (
    <SessionScreen
      hasCompletedOnboarding={hasCompletedOnboarding}
      onGoHome={() => navigate("/inicio")}
      onGoToOnboarding={() => {
        onGoToOnboarding?.();
        navigate("/onboarding");
      }}
      onLogout={onLogout}
      onOpenProfile={() => navigate("/mis-gustos")}
      onProfileChange={onProfileChange}
      token={sessionToken}
      userEmail={userEmail}
    />
  );
}

function UserHomeRoute({ profile, user }) {
  return <UserHome profile={profile} user={user} />;
}

function TasteProfileRoute({
  error,
  formatSelection,
  message,
  onCloseProfilePanel,
  onEditStep,
  onLogout,
  onOpenProfilePanel,
  onStartEditing,
  profile,
  profileFieldLabels,
  showProfilePanel,
  user,
}) {
  const navigate = useNavigate();

  return (
    <ProfileScreen
      error={error}
      formatSelection={formatSelection}
      forceDetails
      message={message}
      onCloseProfilePanel={onCloseProfilePanel}
      onEditStep={(stepId) => {
        onEditStep(stepId);
        navigate("/onboarding");
      }}
      onLogout={onLogout}
      onOpenAccount={() => navigate("/mi-cuenta")}
      onOpenProfilePanel={onOpenProfilePanel}
      onStartEditing={() => {
        onStartEditing();
        navigate("/onboarding");
      }}
      profile={profile}
      profileFieldLabels={profileFieldLabels}
      showProfilePanel={showProfilePanel}
      steps={ONBOARDING_STEPS}
      user={user}
    />
  );
}

function AccountRoute({ onLogout, onOpenTasteProfile, profile, user }) {
  return (
    <AccountScreen
      onLogout={onLogout}
      profile={profile}
      user={user}
    />
  );
}

export default function AppRoutes({
  authFeedback,
  draft,
  editing,
  editingSingleStep,
  error,
  formatSelection,
  isAuthenticated = false,
  isLastStep,
  loadingSession = false,
  message,
  onboardingDone = false,
  onAdvance,
  onCloseProfilePanel,
  onEditStep,
  onFieldChange,
  onLogin,
  onLogout,
  onOpenProfilePanel,
  onProfileChange,
  onPrevious,
  onRegister,
  onSkip,
  onStartEditing,
  profile,
  profileFieldLabels,
  savingStep,
  showProfilePanel,
  stepIndex,
  submitting,
  token,
  user,
}) {
  if (loadingSession) {
    return <LoadingScreen />;
  }

  const hasCompletedOnboarding = Boolean(profile?.onboarding_completed);
  const canAccessOnboarding = isAuthenticated && (!hasCompletedOnboarding || editing);

  function renderSessionScreen() {
    return (
      <SessionPreviewRoute
        hasCompletedOnboarding={hasCompletedOnboarding}
        onGoHome={() => undefined}
        onGoToOnboarding={() => undefined}
        onLogout={onLogout}
        onProfileChange={onProfileChange}
        sessionToken={token}
        userEmail={user?.email}
      />
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutRoute isAuthenticated={isAuthenticated} onLogout={onLogout} />}>
          <Route element={<LandingRoute isAuthenticated={isAuthenticated} />} path="/" />
          <Route
            element={
              <ProtectedRoute allow={isAuthenticated} redirectTo="/auth">
                <ThankYouPage />
              </ProtectedRoute>
            }
            path="/thank-you"
          />
          <Route
            element={
              <ProtectedRoute allow={isAuthenticated} redirectTo="/auth">
                <UserHomeRoute profile={profile} user={user} />
              </ProtectedRoute>
            }
            path="/inicio"
          />
          <Route
            element={
              <ProtectedRoute
                allow={isAuthenticated}
                redirectTo="/auth"
              >
                <TasteProfileRoute
                  error={error}
                  formatSelection={formatSelection}
                  message={message}
                  onCloseProfilePanel={onCloseProfilePanel}
                  onEditStep={onEditStep}
                  onLogout={onLogout}
                  onOpenProfilePanel={onOpenProfilePanel}
                  onStartEditing={onStartEditing}
                  profile={profile}
                  profileFieldLabels={profileFieldLabels}
                  showProfilePanel={showProfilePanel}
                  steps={ONBOARDING_STEPS}
                  user={user}
                />
              </ProtectedRoute>
            }
            path="/mis-gustos"
          />
          <Route
            element={
              <ProtectedRoute
                allow={isAuthenticated}
                redirectTo="/auth"
              >
                <AccountRoute
                  onLogout={onLogout}
                  profile={profile}
                  user={user}
                />
              </ProtectedRoute>
            }
            path="/mi-cuenta"
          />
          <Route
            element={
              <ProtectedRoute
                allow={isAuthenticated}
                redirectTo="/auth"
              >
                <Favorites onProfileChange={onProfileChange} token={token} />
              </ProtectedRoute>
            }
            path="/favoritos"
          />
          <Route
            element={
              <ProtectedRoute
                allow={isAuthenticated}
                redirectTo="/auth"
              >
                <HistoryScreen onProfileChange={onProfileChange} token={token} />
              </ProtectedRoute>
            }
            path="/historial"
          />
          <Route
            element={<ProtectedRoute allow={isAuthenticated} redirectTo="/auth">{renderSessionScreen()}</ProtectedRoute>}
            path="/sesion"
          />
          <Route element={<Navigate replace to="/sesion" />} path="/sesion-preview" />
          <Route element={<Navigate replace to="/mis-gustos" />} path="/perfil" />
        </Route>

        <Route
          element={
            <AuthRoute
              authFeedback={authFeedback}
              isAuthenticated={isAuthenticated}
              onLogin={onLogin}
              onRegister={onRegister}
              submitting={submitting}
            />
          }
          path="/auth"
        />
        <Route
          element={
            <ProtectedRoute
              allow={canAccessOnboarding}
              redirectTo={isAuthenticated ? "/inicio" : "/auth"}
            >
              <OnboardingRoute
                draft={draft}
                error={error}
                isLastStep={isLastStep}
                message={message}
                onAdvance={onAdvance}
                onFieldChange={onFieldChange}
                onPrevious={onPrevious}
                onSkip={onSkip}
                savingStep={savingStep}
                singleStepMode={editingSingleStep}
                stepIndex={stepIndex}
              />
            </ProtectedRoute>
          }
          path="/onboarding"
        />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </BrowserRouter>
  );
}
