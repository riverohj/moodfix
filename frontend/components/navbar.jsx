export default function Navbar({
  isAuthenticated = false,
  onLogin,
  onLogout,
}) {
  return (
    <header className="site-navbar">
      <div className="site-shell site-navbar-inner">
        <div aria-label="Logo de la aplicacion" className="site-logo-placeholder">
          <span />
        </div>

        <nav aria-label="Principal" className="site-nav">
          {isAuthenticated ? <a href="/favoritos">Favoritos</a> : null}
        </nav>

        <div className="site-auth-actions">
          {isAuthenticated ? (
            <button className="site-auth-button site-auth-button-primary" onClick={onLogout} type="button">
              Logout
            </button>
          ) : (
            <button className="site-auth-button site-auth-button-primary" onClick={onLogin} type="button">
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
