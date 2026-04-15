import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-shell site-footer-inner">
        <p className="site-footer-copy">© 2026 MoodFix</p>
        <span aria-hidden="true" className="site-footer-divider">·</span>
        <p className="site-footer-copy site-footer-tagline">Encuentra tu película para hoy</p>
        <span aria-hidden="true" className="site-footer-divider">·</span>
        <Link className="site-footer-link" to="/sobre-nosotros">Sobre nosotros</Link>
        <span aria-hidden="true" className="site-footer-divider">·</span>
        <a className="site-footer-link" href="https://4geeksacademy.com/" rel="noopener noreferrer" target="_blank">Contacto</a>
      </div>
    </footer>
  );
}
