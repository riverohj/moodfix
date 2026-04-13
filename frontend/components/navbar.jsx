import { Link } from "react-router-dom";
import moodfixLogo from "../src/assets/platform/MoodFix_logo1.png";


export default function Navbar({
  isAuthenticated = false,
  onLogin,
  onLogout,
}) {
  return (
    <header className="site-navbar">
      <div className="site-shell site-navbar-inner">
        <Link aria-label="Ir a MoodFix" className="site-logo-placeholder site-logo-link" to={isAuthenticated ? "/inicio" : "/"}>
          <img src={moodfixLogo} alt="MoodFix" className="site-logo-img" />
        </Link>

        <nav aria-label="Principal" className="site-nav">
          {isAuthenticated ? (
            <>
              <Link to="/inicio">Inicio</Link>
              <Link to="/sesion">Encuentra película</Link>
              <Link to="/favoritos">Ver luego</Link>
              <Link to="/historial">Historial</Link>
              <Link to="/mis-gustos">Mis gustos</Link>
              <Link to="/mi-cuenta">Mi cuenta</Link>
            </>
          ) : null}
        </nav>

        <div className="site-auth-actions">
          {isAuthenticated ? (
            <button className="site-auth-button site-auth-button-primary" onClick={onLogout} type="button">
              Cerrar sesión
            </button>
          ) : (
            <button className="site-auth-button site-auth-button-primary" onClick={onLogin} type="button">
              Entrar
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
