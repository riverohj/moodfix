import { Link } from "react-router-dom";

import "../css/AccountScreen.css";

// Fila de funcionalidad futura — visible pero marcada como próximamente
function LockedRow({ label, description }) {
  return (
    <li className="account-locked-row">
      <div className="account-locked-body">
        <span className="account-locked-label">{label}</span>
        <span className="account-locked-desc">{description}</span>
      </div>
      <span className="account-locked-badge">Próximamente</span>
    </li>
  );
}

export default function AccountScreen({ onLogout, user }) {
  return (
    <section className="account-page">

      <header className="account-header">
        <h1 className="account-title">Mi cuenta</h1>
        <button className="account-logout-btn" type="button" onClick={onLogout}>
          Cerrar sesión
        </button>
      </header>

      {/* ── Sesión activa ── */}
      <section className="account-section">
        <p className="account-section-label">Sesión activa</p>
        <div className="account-email-row">
          <span className="account-status-dot" aria-hidden />
          <strong className="account-email">{user?.email}</strong>
        </div>
        <p className="account-section-hint">
          Conectado con esta dirección. Si necesitas cambiarla, estará disponible próximamente.
        </p>
      </section>

      <div className="account-divider" />

      {/* ── Funciones futuras ── */}
      <section className="account-section">
        <p className="account-section-label">Seguridad y acceso</p>
        <ul className="account-locked-list">
          <LockedRow
            label="Cambiar email"
            description="Actualiza la dirección de correo asociada a tu cuenta."
          />
          <LockedRow
            label="Cambiar contraseña"
            description="Establece una nueva contraseña de acceso."
          />

        </ul>
      </section>

      <div className="account-divider" />

      {/* ── Enlace a Mis gustos ── */}
      <section className="account-section account-section-taste">
        <div className="account-taste-copy">
          <p className="account-section-label">Tus preferencias</p>
          <p className="account-taste-desc">
            Las respuestas del onboarding que usamos para afinar tus recomendaciones están en{" "}
            <strong>Mis gustos</strong>, no aquí.
          </p>
        </div>
        <Link className="account-taste-link" to="/mis-gustos">
          Ir a Mis gustos →
        </Link>
      </section>

    </section>
  );
}
