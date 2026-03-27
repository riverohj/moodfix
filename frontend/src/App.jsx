const sections = [
  "Flask API lista para evolucionar a endpoints de producto",
  "React listo para onboarding, sesiones y resultados",
  "docs/ preparada para decisiones y seguimiento del equipo",
];

export default function App() {
  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">MoodFix</p>
        <h1>Boilerplate full stack listo para el equipo</h1>
        <p className="lead">
          Esta base prepara el proyecto para empezar con orden. Todavia no
          implementa logica de producto.
        </p>
      </section>

      <section className="card">
        <h2>Estado actual</h2>
        <ul>
          {sections.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

