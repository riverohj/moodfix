import { useState } from "react";

import "./AuthScreen.css";

function LockIcon({ accent = false }) {
  return (
    <svg
      aria-hidden="true"
      className={`auth-svg-icon ${accent ? "auth-svg-icon-accent" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M8 10V7.5C8 5.57 9.57 4 11.5 4H12.5C14.43 4 16 5.57 16 7.5V10"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path d="M12 14V16.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      aria-hidden="true"
      className="auth-svg-icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M5 19C6.46 16.61 9 15.2 12 15.2C15 15.2 17.54 16.61 19 19"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      aria-hidden="true"
      className="auth-svg-icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4" y="6" width="16" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M5.5 7.5L12 12.5L18.5 7.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AuthScreen() {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [signupForm, setSignupForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });

  function handleLoginChange(event) {
    const { name, value } = event.target;
    setLoginForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSignupChange(event) {
    const { name, value, type, checked } = event.target;
    setSignupForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleLoginSubmit(event) {
    event.preventDefault();
    console.log("Login form:", loginForm);
  }

  function handleSignupSubmit(event) {
    event.preventDefault();
    console.log("Signup form:", signupForm);
  }

  return (
    <main className="auth-screen">
      <div className="auth-noise" />

      <div className="auth-layout">
        <section className="auth-card">
          <h2 className="auth-title">Inicia sesion</h2>

          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <label className="auth-field">
              <span>Email</span>
              <div className="auth-input-shell">
                <span className="auth-input-icon" aria-hidden="true">
                  <MailIcon />
                </span>
                <input
                  autoComplete="email"
                  name="email"
                  required
                  type="email"
                  placeholder="palomitas_fans@cinematch.es"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                />
              </div>
            </label>

            <label className="auth-field">
              <span>Contrasena</span>
              <div className="auth-input-shell">
                <span className="auth-input-icon" aria-hidden="true">
                  <LockIcon />
                </span>
                <input
                  autoComplete="current-password"
                  name="password"
                  required
                  type="password"
                  placeholder="●●●●●●"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                />
              </div>
            </label>

            <button className="auth-button" type="submit">
              Iniciar Sesion
            </button>
          </form>
        </section>

        <section className="auth-card">
          <h2 className="auth-title">Crea tu cuenta</h2>

          <form className="auth-form" onSubmit={handleSignupSubmit}>
            <div className="auth-form-grid">
              <label className="auth-field">
                <span>Nombre de Usuario</span>
                <div className="auth-input-shell">
                  <span className="auth-input-icon" aria-hidden="true">
                    <UserIcon />
                  </span>
                  <input
                    autoComplete="username"
                    name="username"
                    required
                    type="text"
                    placeholder="Nombre_Cinefilo"
                    value={signupForm.username}
                    onChange={handleSignupChange}
                  />
                </div>
              </label>

              <label className="auth-field">
                <span>Email</span>
                <div className="auth-input-shell">
                  <span className="auth-input-icon" aria-hidden="true">
                    <MailIcon />
                  </span>
                  <input
                    autoComplete="email"
                    name="email"
                    required
                    type="email"
                    placeholder="mi_correo@cinematch.es"
                    value={signupForm.email}
                    onChange={handleSignupChange}
                  />
                </div>
              </label>

              <label className="auth-field">
                <span>Contrasena</span>
                <div className="auth-input-shell">
                  <span className="auth-input-icon auth-input-icon-green" aria-hidden="true">
                    <LockIcon accent />
                  </span>
                  <input
                    autoComplete="new-password"
                    name="password"
                    required
                    type="password"
                    placeholder="●●●●●●"
                    value={signupForm.password}
                    onChange={handleSignupChange}
                  />
                </div>
              </label>

              <label className="auth-field">
                <span>Confirma Contrasena</span>
                <div className="auth-input-shell">
                  <span className="auth-input-icon auth-input-icon-green" aria-hidden="true">
                    <LockIcon accent />
                  </span>
                  <input
                    autoComplete="new-password"
                    name="confirmPassword"
                    required
                    type="password"
                    placeholder="●●●●●●"
                    value={signupForm.confirmPassword}
                    onChange={handleSignupChange}
                  />
                </div>
              </label>
            </div>

            <label className="auth-checkbox">
              <input
                name="acceptedTerms"
                type="checkbox"
                required
                checked={signupForm.acceptedTerms}
                onChange={handleSignupChange}
              />
              <span>
                Acepto los{" "}
                <button className="auth-link-button" type="button">
                  Terminos y Condiciones
                </button>
              </span>
            </label>

            <button className="auth-button" type="submit">
              Registrarme
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
