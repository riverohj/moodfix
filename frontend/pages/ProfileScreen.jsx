import "../css/ProfileScreen.css";

function IncompleteNudge({ count }) {
  return (
    <p className="taste-nudge">
      {count === 1
        ? "Tienes 1 preferencia sin completar."
        : `Tienes ${count} preferencias sin completar.`}{" "}
      Cuanto más sepamos, mejores serán las recomendaciones.
    </p>
  );
}

export default function ProfileScreen({
  error,
  formatSelection,
  message,
  onEditStep,
  onStartEditing,
  profile,
  profileFieldLabels,
  steps,
  // Props de compatibilidad con routes — no se renderizan en la vista limpia
  forceDetails,
  onCloseProfilePanel,
  onLogout,
  onOpenAccount,
  onOpenProfilePanel,
  showProfilePanel,
  user,
}) {
  const emptyFields = steps.filter((step) => {
    const val = profile?.[step.id];
    if (Array.isArray(val)) return val.length === 0;
    return val === null || val === "" || val === undefined;
  });

  return (
    <section className="taste-page">
      {error ? <div className="taste-feedback taste-feedback-error">{error}</div> : null}
      {message ? <div className="taste-feedback taste-feedback-success">{message}</div> : null}

      <header className="taste-header">
        <div className="taste-header-copy">
          <h1 className="taste-title">Mis gustos</h1>
          <p className="taste-sub">
            Tus respuestas del onboarding. Cuanto más precisas, mejor te conocemos.
          </p>
          {emptyFields.length > 0 ? <IncompleteNudge count={emptyFields.length} /> : null}
        </div>
        <button className="taste-edit-all-btn" type="button" onClick={onStartEditing}>
          Editar todo
        </button>
      </header>

      <ul className="taste-list">
        {steps.map((step) => {
          const raw = profile?.[step.id];
          const isEmpty = Array.isArray(raw) ? raw.length === 0 : !raw;
          const display = formatSelection(step, raw);

          return (
            <li className={`taste-row ${isEmpty ? "taste-row-empty" : ""}`} key={step.id}>
              <div className="taste-row-body">
                <span className="taste-row-label">{profileFieldLabels[step.id]}</span>
                <span className="taste-row-value">
                  {isEmpty ? <span className="taste-row-pending">Sin completar</span> : display}
                </span>
              </div>
              <button
                aria-label={`Editar ${profileFieldLabels[step.id]}`}
                className="taste-row-edit"
                type="button"
                onClick={() => onEditStep?.(step.id)}
              >
                ✎
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
