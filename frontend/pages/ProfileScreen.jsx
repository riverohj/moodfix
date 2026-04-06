import "../css/AppShell.css";
import "../css/ProfileScreen.css";

export default function ProfileScreen({
  error,
  formatSelection,
  message,
  onCloseProfilePanel,
  onLogout,
  onOpenProfilePanel,
  onStartEditing,
  profile,
  profileFieldLabels,
  showProfilePanel,
  user,
  steps,
}) {
  return (
    <main className="app-shell">
      {error ? <div className="feedback feedback-error">{error}</div> : null}
      {message ? <div className="feedback feedback-success">{message}</div> : null}

      <section className="onboarding-flow-shell">
        <section className="panel onboarding-layout">
          <header className="profile-header profile-header-plain">
            <div>
              <p className="eyebrow">MoodFix</p>
              <h2>{user?.email}</h2>
            </div>

            <div className="header-actions">
              {showProfilePanel ? (
                <button className="ghost-button" type="button" onClick={onCloseProfilePanel}>
                  Volver
                </button>
              ) : (
                <button className="ghost-button" type="button" onClick={onOpenProfilePanel}>
                  Ver perfil
                </button>
              )}

              <button className="ghost-button" type="button" onClick={onLogout}>
                Cerrar sesión
              </button>
            </div>
          </header>

          {showProfilePanel ? (
            <section className="summary-card">
              <h3>Tu perfil estable</h3>
              <p>Aquí puedes revisar lo que has guardado y volver a editarlo cuando quieras.</p>

              <dl className="summary-grid">
                {steps.map((step) => (
                  <div key={step.id}>
                    <dt>{profileFieldLabels[step.id]}</dt>
                    <dd>{formatSelection(step, profile?.[step.id]) || "Sin definir"}</dd>
                  </div>
                ))}
              </dl>

              <div className="summary-actions">
                <button className="primary-button" type="button" onClick={onStartEditing}>
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
                <button className="primary-button" type="button" onClick={onOpenProfilePanel}>
                  Ver perfil
                </button>
              </div>
            </section>
          )}
        </section>
      </section>
    </main>
  );
}
