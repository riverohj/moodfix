import { Link } from "react-router-dom";

import "../css/UserHome.css";

function SecondaryLink({ description, pending = false, title, to }) {
  return (
    <Link className="user-home-nav-item" to={to}>
      <span className="user-home-nav-title-row">
        <span className="user-home-nav-title">{title}</span>
        {pending ? <span className="user-home-nav-badge">Pendiente</span> : null}
      </span>
      <span className="user-home-nav-desc">{description}</span>
    </Link>
  );
}

export default function UserHome({ profile }) {
  const onboardingDone = Boolean(profile?.onboarding_completed);

  return (
    <section className="user-home-page">
      <div className="user-home-intro">
        <h1 className="user-home-heading">Hola</h1>
        <p className="user-home-sub">¿Qué te apetece ver hoy?</p>
      </div>

      <Link className="user-home-cta" to="/sesion">
        <div className="user-home-cta-body">
          <span className="user-home-cta-label">Encuentra película</span>
          <span className="user-home-cta-hint">Sorpréndeme · Pregúntame</span>
        </div>
        <span className="user-home-cta-arrow" aria-hidden>→</span>
      </Link>

      <nav aria-label="Secciones" className="user-home-nav">
        <SecondaryLink
          description="Las que has guardado"
          title="Ver luego"
          to="/favoritos"
        />
        <SecondaryLink
          description="Lo que ya te has visto"
          title="Historial"
          to="/historial"
        />
        <SecondaryLink
          description={
            onboardingDone
              ? "Tus preferencias"
              : "Aún no has rellenado tus gustos. Complétalos para poder afinar mejor tus recomendaciones."
          }
          pending={!onboardingDone}
          title="Mis gustos"
          to={onboardingDone ? "/mis-gustos" : "/onboarding"}
        />
        <SecondaryLink
          description="Email y acceso"
          title="Mi cuenta"
          to="/mi-cuenta"
        />
      </nav>
    </section>
  );
}
