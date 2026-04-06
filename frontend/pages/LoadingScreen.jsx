import "../css/AppShell.css";

export default function LoadingScreen() {
  return (
    <main className="app-shell">
      <section className="panel panel-centered">
        <p className="eyebrow">MoodFix</p>
        <h1>Cargando sesión y perfil...</h1>
        <p className="lead">Estamos preparando tu experiencia.</p>
      </section>
    </main>
  );
}
