import { Link } from "react-router-dom";

import "../css/Favorites.css";
import "../css/HistoryScreen.css";

const MOCK_HISTORY = [
  {
    id: "history-1",
    title: "Dune: Parte Dos",
    genre: "Ciencia ficción",
    viewedAt: "Visto el 15/10/2023",
    poster:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "history-2",
    title: "Perfect Days",
    genre: "Drama",
    viewedAt: "Visto el 03/02/2024",
    poster:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "history-3",
    title: "Spider-Man: Across the Spider-Verse",
    genre: "Animación",
    viewedAt: "Visto el 27/02/2024",
    poster:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "history-4",
    title: "Past Lives",
    genre: "Romance",
    viewedAt: "Visto el 10/03/2024",
    poster:
      "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "history-5",
    title: "The Batman",
    genre: "Acción",
    viewedAt: "Visto el 21/03/2024",
    poster:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "history-6",
    title: "Aftersun",
    genre: "Drama",
    viewedAt: "Visto el 05/04/2024",
    poster:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "history-7",
    title: "Everything Everywhere All at Once",
    genre: "Aventura",
    viewedAt: "Visto el 19/04/2024",
    poster:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "history-8",
    title: "La sociedad de la nieve",
    genre: "Supervivencia",
    viewedAt: "Visto el 01/05/2024",
    poster:
      "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=800&q=80",
  },
];

export default function HistoryScreen() {
  const historyItems = MOCK_HISTORY;

  return (
    <section className="history-screen favoritos-wrapper">
      <header className="history-screen-header">
        <div>
          <h1 className="history-section-title">
            Tu historial de visualización
          </h1>
          <p className="history-screen-description">
            Aquí podrás revisar lo último que viste en MoodFix y retomar recomendaciones cuando te
            apetezca volver sobre ellas.
          </p>
        </div>

        <Link className="ghost-button" to="/inicio">
          Volver a inicio
        </Link>
      </header>

      {historyItems.length > 0 ? (
        <section className="history-grid" aria-label="Historial de visualización">
          {historyItems.map((item) => (
            <article className="history-card" key={item.id}>
              <div className="history-poster-wrapper">
                {item.poster ? (
                  <img alt={item.title} className="history-poster" src={item.poster} />
                ) : (
                  <div className="history-poster-fallback" aria-hidden="true" />
                )}
                <div className="history-card-badge" aria-hidden="true">
                  🎬
                </div>
              </div>

              <div className="history-card-body">
                <h2 className="history-card-title">{item.title}</h2>
                <p className="history-card-genre">{item.genre}</p>
                <p className="history-card-date">
                  <span className="history-date-icon" aria-hidden="true">
                    📅
                  </span>
                  {item.viewedAt}
                </p>

                <button className="history-card-button" type="button">
                  Ver detalles
                </button>
              </div>
            </article>
          ))}
        </section>
      ) : (
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
      )}
    </section>
  );
}
