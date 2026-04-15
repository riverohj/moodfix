const POSTER_BASE_URL = "https://image.tmdb.org/t/p";

const GENRE_LABELS = {
  12: "Aventura",
  14: "Fantasía",
  16: "Animación",
  18: "Drama",
  27: "Terror",
  28: "Acción",
  35: "Comedia",
  36: "Historia",
  37: "Western",
  53: "Thriller",
  80: "Crimen",
  99: "Documental",
  878: "Ciencia ficción",
  9648: "Misterio",
  10402: "Música",
  10749: "Romance",
  10751: "Familia",
  10752: "Bélica",
};

function normalizeGenreIds(movie) {
  if (Array.isArray(movie?.genre_ids)) {
    return movie.genre_ids;
  }

  if (Array.isArray(movie?.genres)) {
    return movie.genres
      .map((genre) => {
        if (typeof genre === "number") {
          return genre;
        }
        return genre?.id;
      })
      .filter((genreId) => Number.isInteger(genreId));
  }

  return [];
}

export function getPosterUrl(movie, size = "w500") {
  if (!movie?.poster_path) {
    return "";
  }

  return `${POSTER_BASE_URL}/${size}${movie.poster_path}`;
}

export function getGenreLabels(movie) {
  const genreIds = normalizeGenreIds(movie);
  const labels = genreIds
    .map((genreId) => GENRE_LABELS[genreId])
    .filter(Boolean);

  if (labels.length > 0) {
    return labels;
  }

  return ["Sin género"];
}

export function getPrimaryGenreLabel(movie) {
  return getGenreLabels(movie)[0];
}

export function getFlatrateProviders(movie) {
  if (!Array.isArray(movie?.providers)) {
    return [];
  }

  return movie.providers.filter((provider) => provider?.provider_type === "flatrate");
}

export function formatPopularity(value) {
  if (!Number.isFinite(value)) {
    return "Sin dato";
  }

  return Intl.NumberFormat("es-ES", {
    maximumFractionDigits: value >= 100 ? 0 : 1,
  }).format(value);
}

export function formatVoteCount(value) {
  if (!Number.isFinite(value)) {
    return "Sin dato";
  }

  return Intl.NumberFormat("es-ES").format(value);
}

export function formatLanguageLabel(languageCode) {
  if (!languageCode || typeof languageCode !== "string") {
    return "Sin dato";
  }

  try {
    const displayNames = new Intl.DisplayNames(["es"], { type: "language" });
    const label = displayNames.of(languageCode.toLowerCase());
    if (label) {
      return label.charAt(0).toUpperCase() + label.slice(1);
    }
  } catch {
    // Fallback a código ISO si el runtime no soporta DisplayNames.
  }

  return languageCode.toUpperCase();
}
