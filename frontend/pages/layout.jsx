import { Outlet } from "react-router-dom";

import Footer from "../components/footer";
import Navbar from "../components/navbar";
import "../css/layout.css";

export default function Layout({
  children,
  isAuthenticated = false,
  onLogin,
  onLogout,
}) {
  return (
    <div className="site-layout">
      <Navbar
        isAuthenticated={isAuthenticated}
        onLogin={onLogin}
        onLogout={onLogout}
      />

      <main className="site-main">
        <div className="site-shell">{children ?? <Outlet />}</div>
      </main>

      <Footer />
    </div>
  );
}
