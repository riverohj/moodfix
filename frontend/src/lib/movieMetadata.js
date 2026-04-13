const GENRE_LABELS = {
  12: "Aventura",
  14: "Fantasía",
  16: "Animación",
  18: "Drama",
  27: "Terror",
  28: "Acción",
  35: "Comedia",
  36: "Historia",
  53: "Thriller",
  80: "Crimen",
  99: "Documental",
  878: "Ciencia ficción",
  9648: "Misterio",
  10402: "Musical",
  10749: "Romance",
  10751: "Familiar",
  10752: "Bélica",
};

const LANGUAGE_LABELS = {
  de: "Alemán",
  en: "Inglés",
  es: "Español",
  fr: "Francés",
  it: "Italiano",
  ja: "Japonés",
  ko: "Coreano",
  pt: "Portugués",
  zh: "Chino",
};

export function getPrimaryGenreLabel(movie) {
  const genreIds = Array.isArray(movie?.genre_ids) ? movie.genre_ids : [];
  for (const genreId of genreIds) {
    if (GENRE_LABELS[genreId]) {
      return GENRE_LABELS[genreId];
    }
  }
  return "Sin género";
}

export function getGenreLabels(movie) {
  const genreIds = Array.isArray(movie?.genre_ids) ? movie.genre_ids : [];
  const labels = genreIds
    .map((genreId) => GENRE_LABELS[genreId])
    .filter(Boolean);

  return labels.length > 0 ? labels : ["Sin género"];
}

export function getPosterUrl(movie, size = "w500") {
  return movie?.poster_path ? `https://image.tmdb.org/t/p/${size}${movie.poster_path}` : "";
}

export function getFlatrateProviders(movie) {
  return Array.isArray(movie?.providers)
    ? movie.providers.filter((provider) => provider.provider_type === "flatrate")
    : [];
}

export function formatLanguageLabel(code) {
  if (!code) {
    return "Sin dato";
  }

  const normalized = String(code).trim().toLowerCase();
  return LANGUAGE_LABELS[normalized] || normalized.toUpperCase();
}

export function formatPopularity(value) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "Sin dato";
  }
  return value.toFixed(1);
}

export function formatVoteCount(value) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "Sin dato";
  }
  return new Intl.NumberFormat("es-ES").format(value);
}
