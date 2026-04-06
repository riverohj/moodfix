import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";

import AuthScreen from "../pages/AuthScreen";
import Favorites from "../pages/Favorites";
import Home from "../pages/home";
import LoadingScreen from "../pages/LoadingScreen";
import Layout from "../pages/layout";
import Onboarding from "../pages/Onboarding";
import ProfileScreen from "../pages/ProfileScreen";
import { ONBOARDING_STEPS } from "./config/onboarding";

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

function ProtectedRoute({ allow, children, redirectTo }) {
  if (!allow) {
    return <Navigate replace to={redirectTo} />;
  }

  return children;
}

export default function AppRoutes({
  authFeedback,
  draft,
  editing,
  error,
  formatSelection,
  isAuthenticated = false,
  isLastStep,
  loadingSession = false,
  message,
  onboardingDone = false,
  onAdvance,
  onCloseProfilePanel,
  onFieldChange,
  onLogin,
  onLogout,
  onOpenProfilePanel,
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
  user,
}) {
  if (loadingSession) {
    return <LoadingScreen />;
  }

  const shouldShowOnboarding = isAuthenticated && (!onboardingDone || editing);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutRoute isAuthenticated={isAuthenticated} onLogout={onLogout} />}>
          <Route element={<Home />} path="/" />
        </Route>

        <Route
          element={
            isAuthenticated ? (
              <Navigate replace to={shouldShowOnboarding ? "/onboarding" : "/perfil"} />
            ) : (
              <AuthScreen
                loginError={authFeedback.login.error}
                loginMessage={authFeedback.login.message}
                signupError={authFeedback.signup.error}
                signupMessage={authFeedback.signup.message}
                onLogin={onLogin}
                onRegister={onRegister}
                submitting={submitting}
              />
            )
          }
          path="/auth"
        />
        <Route
          element={
            <ProtectedRoute allow={shouldShowOnboarding} redirectTo={isAuthenticated ? "/perfil" : "/auth"}>
              <Onboarding
                draft={draft}
                error={error}
                isLastStep={isLastStep}
                message={message}
                onAdvance={onAdvance}
                onFieldChange={onFieldChange}
                onPrevious={onPrevious}
                onSkip={onSkip}
                savingStep={savingStep}
                stepIndex={stepIndex}
              />
            </ProtectedRoute>
          }
          path="/onboarding"
        />
        <Route
          element={
            <ProtectedRoute
              allow={isAuthenticated && !shouldShowOnboarding}
              redirectTo={isAuthenticated ? "/onboarding" : "/auth"}
            >
              <ProfileScreen
                error={error}
                formatSelection={formatSelection}
                message={message}
                onCloseProfilePanel={onCloseProfilePanel}
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
          path="/perfil"
        />
        <Route
          element={
            <ProtectedRoute
              allow={isAuthenticated && !shouldShowOnboarding}
              redirectTo={isAuthenticated ? "/onboarding" : "/auth"}
            >
              <Favorites />
            </ProtectedRoute>
          }
          path="/favoritos"
        />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </BrowserRouter>
  );
}
