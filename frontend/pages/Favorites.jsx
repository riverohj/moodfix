import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/Favorites.css";

// MOCK DATA — Juan: sustituye este array por tu llamada a la API
// Campos esperados por card: id, titulo, poster, año, genero
const MOCK_FAVORITOS = [
  {
    id: 1,
    titulo: "Interstellar",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    año: 2014,
    genero: "Ciencia ficción",
  },
  {
    id: 2,
    titulo: "El club de la lucha",
    poster: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    año: 1999,
    genero: "Drama",
  },
  {
    id: 3,
    titulo: "Parásitos",
    poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    año: 2019,
    genero: "Thriller",
  },
  {
    id: 4,
    titulo: "El padrino",
    poster: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    año: 1972,
    genero: "Crimen",
  },
  {
    id: 5,
    titulo: "Whiplash",
    poster: "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
    año: 2014,
    genero: "Drama",
  },
  {
    id: 6,
    titulo: "Origen",
    poster: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    año: 2010,
    genero: "Acción",
  },
];

function Favoritos() {
  const [favoritos, setFavoritos] = useState(MOCK_FAVORITOS);
  const favoritosCountLabel = `${favoritos.length} película${favoritos.length !== 1 ? "s" : ""} guardada${favoritos.length !== 1 ? "s" : ""}`;

  const handleEliminar = (id) => {
    setFavoritos((prev) => prev.filter((pelicula) => pelicula.id !== id));
  };

  const handleVerDetalles = (id) => {
    console.log("Ver detalles de película:", id);
    // TODO: navegación al single de película
  };

  return (
    <section className="favorites-screen">
      <header className="favorites-screen-header">
        <div>
          <div className="favoritos-title-row">
            <h1 className="favoritos-titulo">Tu Colección MoodFix</h1>
            <span className="favoritos-title-heart" aria-hidden="true">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </span>
          </div>
          {favoritos.length > 0 ? (
            <p className="favoritos-subtitulo">{favoritosCountLabel}</p>
          ) : (
            <p className="favoritos-subtitulo">
              Aquí reuniremos las películas que quieras volver a tener a mano.
            </p>
          )}
        </div>

        <Link className="ghost-button" to="/inicio">
          Volver a inicio
        </Link>
      </header>

      {favoritos.length === 0 ? (
        <section className="favorites-empty-card">
          <div className="favorites-empty-icon" aria-hidden="true">🎬</div>
          <h2>Aquí reinará el silencio...</h2>
          <p>
            Todavía no tienes ninguna película guardada. Cuando encuentres algo que te robe el mood,
            dale al ❤️ y aparecerá aquí.
          </p>
        </section>
      ) : (
        <section className="favorites-grid" aria-label="Películas favoritas">
          {favoritos.map((pelicula) => (
            <article key={pelicula.id} className="favorito-card">
              <div className="favorito-poster-wrapper">
                {pelicula.poster ? (
                  <img
                    src={pelicula.poster}
                    alt={pelicula.titulo}
                    className="favorito-poster"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = "none";
                      e.target.parentNode.classList.add("favorito-poster-has-fallback");
                    }}
                  />
                ) : (
                  <div className="favorito-poster-fallback" aria-hidden="true" />
                )}
                <button
                  className="favorito-card-badge"
                  type="button"
                  aria-label="Eliminar de favoritos"
                  onClick={() => handleEliminar(pelicula.id)}
                >
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </button>
              </div>

              <div className="favorito-card-body">
                <h2 className="favorito-nombre">{pelicula.titulo}</h2>
                <p className="favorito-genero">{pelicula.genero}</p>
                <p className="favorito-año">
                  <span className="favorito-año-icon" aria-hidden="true">📅</span>
                  {pelicula.año}
                </p>

                <div className="favorito-acciones">
                  <button className="btn-ver" onClick={() => handleVerDetalles(pelicula.id)}>
                    Ver Detalles
                  </button>
                  <button className="btn-eliminar" onClick={() => handleEliminar(pelicula.id)}>
                    Eliminar de favoritos
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </section>
  );
}

export default Favoritos;
