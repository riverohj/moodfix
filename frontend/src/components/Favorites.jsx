import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Favorites.css';

// ─────────────────────────────────────────────────────────────
// MOCK DATA — Juan: sustituye este array por tu llamada a la API
// Campos esperados por card: id, titulo, poster, año, genero
// ─────────────────────────────────────────────────────────────
const MOCK_FAVORITOS = [
  {
    id: 1,
    titulo: 'Interstellar',
    poster: 'https://image.tmdb.org/t/p/w300/gEU2QniE6E77NI6lCU6MxlNBvIe.jpg',
    año: 2014,
    genero: 'Ciencia ficción',
  },
  {
    id: 2,
    titulo: 'El club de la lucha',
    poster: 'https://image.tmdb.org/t/p/w300/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    año: 1999,
    genero: 'Drama',
  },
  {
    id: 3,
    titulo: 'Parásitos',
    poster: 'https://image.tmdb.org/t/p/w300/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    año: 2019,
    genero: 'Thriller',
  },
  {
    id: 4,
    titulo: 'El padrino',
    poster: 'https://image.tmdb.org/t/p/w300/3bhkrj58Vtu7enYsLLeWorkthat.jpg',
    año: 1972,
    genero: 'Crimen',
  },
  {
    id: 5,
    titulo: 'Whiplash',
    poster: 'https://image.tmdb.org/t/p/w300/lIv1QinFqz4dlp5U4lQ6HaiskOZ.jpg',
    año: 2014,
    genero: 'Drama',
  },
  {
    id: 6,
    titulo: 'Origen',
    poster: 'https://image.tmdb.org/t/p/w300/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
    año: 2010,
    genero: 'Acción',
  },
];

function Favoritos() {
  const [favoritos, setFavoritos] = useState(MOCK_FAVORITOS);

  const handleEliminar = (id) => {
    setFavoritos((prev) => prev.filter((pelicula) => pelicula.id !== id));
  };

  const handleVerDetalles = (id) => {
    console.log('Ver detalles de película:', id);
    // TODO: navegación al single de película
  };

  return (
    <div className="favoritos-wrapper">
      <div className="favoritos-header">
        <h1 className="favoritos-titulo">
          Tu Colección MoodFix <span className="favoritos-corazon">❤️</span>
        </h1>
        <p className="favoritos-subtitulo">
          {favoritos.length > 0
            ? `${favoritos.length} película${favoritos.length !== 1 ? 's' : ''} guardada${favoritos.length !== 1 ? 's' : ''}`
            : ''}
        </p>
      </div>

      {favoritos.length === 0 ? (
        <div className="favoritos-empty">
          <div className="empty-icon">🎬</div>
          <h2 className="empty-titulo">Aquí reinará el silencio...</h2>
          <p className="empty-texto">
            Todavía no tienes ninguna película guardada. Cuando encuentres algo que te robe el mood,
            dale al ❤️ y aparecerá aquí.
          </p>
        </div>
      ) : (
        <div className="container-fluid px-0">
          <div className="row g-3">
            {favoritos.map((pelicula) => (
              <div key={pelicula.id} className="col-6 col-sm-4 col-md-3 col-lg-2">
                <div className="favorito-card card">
                  <div className="favorito-poster-wrapper">
                    <img
                      src={pelicula.poster}
                      alt={pelicula.titulo}
                      className="favorito-poster card-img-top"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '';
                        e.target.parentNode.classList.add('poster-fallback');
                      }}
                    />
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="favorito-nombre card-title">{pelicula.titulo}</h5>
                    <div className="favorito-meta">
                      <span className="favorito-genero">{pelicula.genero}</span>
                      <span className="favorito-año">{pelicula.año}</span>
                    </div>
                    <div className="favorito-acciones">
                      <button
                        className="btn btn-ver w-100"
                        onClick={() => handleVerDetalles(pelicula.id)}
                      >
                        Ver Detalles
                      </button>
                      <button
                        className="btn btn-eliminar w-100"
                        onClick={() => handleEliminar(pelicula.id)}
                      >
                        Eliminar de favoritos
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Favoritos;