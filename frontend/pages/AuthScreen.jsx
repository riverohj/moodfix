import { useMemo, useState } from "react";

import "../css/AuthScreen.css";

function LockIcon({ accent = false }) {
  return (
    <svg
      aria-hidden="true"
      className={`auth-svg-icon ${accent ? "auth-svg-icon-accent" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        height="10"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.7"
        width="14"
        x="5"
        y="10"
      />
      <path
        d="M8 10V7.5C8 5.57 9.57 4 11.5 4H12.5C14.43 4 16 5.57 16 7.5V10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
      <path d="M12 14V16.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      aria-hidden="true"
      className="auth-svg-icon"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect height="12" rx="2.5" stroke="currentColor" strokeWidth="1.7" width="16" x="4" y="6" />
      <path
        d="M5.5 7.5L12 12.5L18.5 7.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export default function AuthScreen({
  loginError,
  loginMessage,
  signupError,
  signupMessage,
  onLogin,
  onRegister,
  submitting,
}) {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });
  const [localError, setLocalError] = useState("");

  const visibleSignupError = localError || signupError;
  const signupPasswordsMatch = useMemo(
    () =>
      signupForm.confirmPassword.length === 0 || signupForm.password === signupForm.confirmPassword,
    [signupForm.confirmPassword, signupForm.password],
  );

  function handleLoginChange(event) {
    const { name, value } = event.target;
    setLocalError("");
    setLoginForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSignupChange(event) {
    const { checked, name, type, value } = event.target;
    setLocalError("");
    setSignupForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    setLocalError("");
    await onLogin(loginForm.email, loginForm.password);
  }

  async function handleSignupSubmit(event) {
    event.preventDefault();

    if (signupForm.password !== signupForm.confirmPassword) {
      setLocalError("Las contraseñas no coinciden.");
      return;
    }

    setLocalError("");
    await onRegister(signupForm.email, signupForm.password);
  }

  return (
    <section className="auth-screen">
      <div className="auth-noise" />

      <div className="auth-layout">
        <section className="auth-card">
          <h2 className="auth-title">Inicia sesión</h2>

          {loginMessage ? <div className="auth-feedback auth-feedback-success">{loginMessage}</div> : null}
          {loginError ? <div className="auth-feedback auth-feedback-error">{loginError}</div> : null}

          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <label className="auth-field">
              <span>Email</span>
              <div className="auth-input-shell">
                <span aria-hidden="true" className="auth-input-icon">
                  <MailIcon />
                </span>
                <input
                  autoComplete="email"
                  name="email"
                  onChange={handleLoginChange}
                  placeholder="superman@moodfix.com"
                  required
                  type="email"
                  value={loginForm.email}
                />
              </div>
            </label>

            <label className="auth-field">
              <span>Contraseña</span>
              <div className="auth-input-shell">
                <span aria-hidden="true" className="auth-input-icon">
                  <LockIcon />
                </span>
                <input
                  autoComplete="current-password"
                  name="password"
                  onChange={handleLoginChange}
                  placeholder="●●●●●●"
                  required
                  type="password"
                  value={loginForm.password}
                />
              </div>
            </label>

            <button className="auth-button" disabled={submitting} type="submit">
              {submitting ? "Cargando..." : "Iniciar sesión"}
            </button>
          </form>
        </section>

        <section className="auth-card">
          <h2 className="auth-title">Crea tu cuenta</h2>

          {signupMessage ? <div className="auth-feedback auth-feedback-success">{signupMessage}</div> : null}
          {visibleSignupError ? <div className="auth-feedback auth-feedback-error">{visibleSignupError}</div> : null}

          <form className="auth-form" onSubmit={handleSignupSubmit}>
            <label className="auth-field">
              <span>Email</span>
              <div className="auth-input-shell">
                <span aria-hidden="true" className="auth-input-icon">
                  <MailIcon />
                </span>
                <input
                  autoComplete="email"
                  name="email"
                  onChange={handleSignupChange}
                  placeholder="mi_correo@moodfix.com"
                  required
                  type="email"
                  value={signupForm.email}
                />
              </div>
            </label>

            <div className="auth-form-grid">
              <label className="auth-field">
                <span>Contraseña</span>
                <div className="auth-input-shell">
                  <span aria-hidden="true" className="auth-input-icon auth-input-icon-green">
                    <LockIcon accent />
                  </span>
                  <input
                    autoComplete="new-password"
                    minLength={8}
                    name="password"
                    onChange={handleSignupChange}
                    placeholder="●●●●●●"
                    required
                    type="password"
                    value={signupForm.password}
                  />
                </div>
              </label>

              <label className="auth-field">
                <span>Confirma contraseña</span>
                <div className="auth-input-shell">
                  <span aria-hidden="true" className="auth-input-icon auth-input-icon-green">
                    <LockIcon accent />
                  </span>
                  <input
                    autoComplete="new-password"
                    minLength={8}
                    name="confirmPassword"
                    onChange={handleSignupChange}
                    placeholder="●●●●●●"
                    required
                    type="password"
                    value={signupForm.confirmPassword}
                  />
                </div>
              </label>
            </div>

            {!signupPasswordsMatch ? (
              <div className="auth-inline-error">Las contraseñas no coinciden.</div>
            ) : null}

            <label className="auth-checkbox">
              <input
                checked={signupForm.acceptedTerms}
                name="acceptedTerms"
                onChange={handleSignupChange}
                required
                type="checkbox"
              />
              <span>
                Acepto los{" "}
                <button className="auth-link-button" type="button">
                  Términos y Condiciones
                </button>
              </span>
            </label>

            <button className="auth-button" disabled={submitting || !signupPasswordsMatch} type="submit">
              {submitting ? "Cargando..." : "Registrarme"}
            </button>
          </form>
        </section>
      </div>
    </section>
  );
}
