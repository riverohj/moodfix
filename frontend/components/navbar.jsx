import { useState } from "react";
import { NavLink } from "react-router-dom";
import moodfixLogo from "../src/assets/platform/MoodFix_logo1.png";

function navLinkClass({ isActive }) {
  return isActive ? "site-nav-link site-nav-link-active" : "site-nav-link";
}

export default function Navbar({
  isAuthenticated = false,
  onLogin,
  onLogout,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-navbar">
      <div className="site-shell site-navbar-inner">
        <NavLink aria-label="Ir a MoodFix" className="site-logo-placeholder site-logo-link" to={isAuthenticated ? "/inicio" : "/"}>
          <img src={moodfixLogo} alt="MoodFix" className="site-logo-img" />
        </NavLink>

        {/* Nav escritorio */}
        <nav aria-label="Principal" className="site-nav site-nav-desktop">
          {isAuthenticated ? (
            <>
              <NavLink className={navLinkClass} to="/inicio">Inicio</NavLink>
              <NavLink className={navLinkClass} to="/sesion">Encuentra película</NavLink>
              <NavLink className={navLinkClass} to="/favoritos">Ver luego</NavLink>
              <NavLink className={navLinkClass} to="/historial">Historial</NavLink>
              <span className="site-nav-divider" aria-hidden="true" />
              <NavLink className={navLinkClass} to="/mis-gustos">Mis gustos</NavLink>
              <NavLink className={navLinkClass} to="/mi-cuenta">Mi cuenta</NavLink>
            </>
          ) : null}
        </nav>

        {/* Acciones escritorio */}
        <div className="site-auth-actions site-auth-desktop">
          {isAuthenticated ? (
            <button className="site-auth-button site-auth-button-logout" onClick={onLogout} type="button">
              Cerrar sesión
            </button>
          ) : (
            <button className="site-auth-button site-auth-button-primary" onClick={onLogin} type="button">
              Entrar
            </button>
          )}
        </div>

        {/* Hamburguesa móvil */}
        <div className="site-nav-mobile-actions">
          {!isAuthenticated ? (
            <button className="site-auth-button site-auth-button-primary" onClick={onLogin} type="button">
              Entrar
            </button>
          ) : (
            <button
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              className="site-hamburger"
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? (
                <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 24 24" width="20">
                  <line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" />
                </svg>
              ) : (
                <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 24 24" width="20">
                  <line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="12" y2="12" /><line x1="3" x2="21" y1="18" y2="18" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Menú desplegable móvil */}
      {isAuthenticated && menuOpen ? (
        <nav aria-label="Menú móvil" className="site-nav-drawer">
          <NavLink className={navLinkClass} to="/inicio" onClick={closeMenu}>Inicio</NavLink>
          <NavLink className={navLinkClass} to="/sesion" onClick={closeMenu}>Encuentra película</NavLink>
          <NavLink className={navLinkClass} to="/favoritos" onClick={closeMenu}>Ver luego</NavLink>
          <NavLink className={navLinkClass} to="/historial" onClick={closeMenu}>Historial</NavLink>
          <NavLink className={navLinkClass} to="/mis-gustos" onClick={closeMenu}>Mis gustos</NavLink>
          <NavLink className={navLinkClass} to="/mi-cuenta" onClick={closeMenu}>Mi cuenta</NavLink>
          <div className="site-nav-drawer-footer">
            <button className="site-auth-button site-auth-button-logout" type="button" onClick={() => { closeMenu(); onLogout(); }}>
              Cerrar sesión
            </button>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
