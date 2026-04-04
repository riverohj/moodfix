import "../css/home.css";

export default function Home() {
  return (
    <main className="home-page">
      <section className="home-card">
        <div className="home-copy">
          <h1>Demasiadas opciones?</h1>
          <p className="home-subtitle">No sabes que ver?</p>
          <p className="home-highlight">deja de hacer scroll</p>
          <p className="home-description">
            recibe una pelicula que realmente valga la pena.
          </p>
        </div>

        <button type="button" className="home-cta">
          Encuentra tu Pelicula
        </button>
      </section>
    </main>
  );
}
