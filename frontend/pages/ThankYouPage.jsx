import { Link } from "react-router-dom";

import "../css/ThankYou.css";

export default function ThankYouPage() {
  return (
    <section className="thank-you-page">
      <div className="thank-you-card">
        <p className="thank-you-badge">VALIDA TU EMAIL</p>

        <div className="thank-you-icon-shell" aria-hidden="true">
          <div className="icon-ring-circle">
            <svg width="50" height="50" viewBox="0 0 36 36" fill="none">
              <rect
                x="2"
                y="8"
                width="32"
                height="20"
                rx="4"
                stroke="#e50914"
                strokeWidth="1.5"
              />
              <path
                d="M2 14l16 9 16-9"
                stroke="#e50914"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="icon-ring-badge">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3 7l3 3 5-6"
                stroke="#fff"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <h1 className="thank-you-title">¡Gracias por registrarte!</h1>

        <p className="thank-you-copy">
          Te hemos enviado un enlace de confirmación. Abre tu bandeja de entrada y sigue los pasos
          para activar tu cuenta.
        </p>

        <p className="thank-you-hint">
          Si no lo encuentras en unos minutos, revisa spam o promociones.
        </p>

        <div className="thank-you-actions">
          <Link className="thank-you-primary" to="/inicio">
            Volver al inicio
          </Link>

          <button className="thank-you-secondary" disabled type="button">
            No recibí el correo · Reenviar
          </button>
        </div>
      </div>
    </section>
  );
}
