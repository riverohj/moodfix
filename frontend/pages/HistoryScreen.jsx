import { Link } from "react-router-dom";

import "../css/AppShell.css";
import "../css/HistoryScreen.css";

export default function HistoryScreen() {
  return (
    <section className="history-screen">
      <header className="history-screen-header">
        <div>
          <p className="eyebrow">Historial</p>
          <h1>Tus últimas recomendaciones</h1>
          <p className="history-screen-description">
            Esta pantalla será el punto de entrada para revisar lo que ya te ha sugerido MoodFix.
          </p>
        </div>

        <Link className="ghost-button" to="/inicio">
          Volver a inicio
        </Link>
      </header>

      <section className="history-empty-card">
        <div className="history-empty-icon">🕘</div>
        <h2>Aún no hay recorrido guardado</h2>
        <p>
          En cuanto empecemos a persistir las sesiones, aquí verás tus búsquedas recientes y las
          recomendaciones que te hemos ido dando.
        </p>
        <div className="history-empty-actions">
          <Link className="primary-button" to="/sesion">
            Encontrar película
          </Link>
        </div>
      </section>
    </section>
  );
}
