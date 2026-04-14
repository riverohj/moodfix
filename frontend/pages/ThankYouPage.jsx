import { Link } from "react-router-dom";

import "../css/ThankYou.css";

export default function ThankYouPage() {
  return (
    <section className="thank-you-page">
      <div className="thank-you-card">
        <p className="thank-you-badge">CUENTA CREADA</p>

        <div className="thank-you-icon-shell" aria-hidden="true">
          <div className="icon-ring-circle">
            <svg width="50" height="50" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="14" stroke="#e50914" strokeWidth="1.5" />
              <path
                d="M11 18l5 5 9-10"
                stroke="#e50914"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
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

        <h1 className="thank-you-title">¡Ya eres parte de MoodFix!</h1>

        <p className="thank-you-copy">
          Tu cuenta está lista. Ahora cuéntanos tus gustos para que podamos afinar tus recomendaciones.
        </p>

        <div className="thank-you-actions">
          <Link className="thank-you-primary" to="/onboarding">
            Empezar →
          </Link>
        </div>
      </div>
    </section>
  );
}
