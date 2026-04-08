// Constantes y datos para la pantalla de sesión (EPIC 3)
// Contratos de referencia: epic-0-session-signals.md, epic-0-moods.md
// TODO (EPIC 3 backend): conectar al endpoint POST /api/session/recommend cuando esté disponible

// ── Sorpréndeme ────────────────────────────────────────────────────────────────
// El modo "sorprendeme" no recoge señales adicionales.
// Se apoya íntegramente en el perfil estable del usuario.
// Si falta perfil estable, el motor usa los defaults definidos en epic-0-session-signals.md.

// ── Pregúntame — señales de sesión ────────────────────────────────────────────
// Nombres técnicos y valores según epic-0-session-signals.md

export const MOOD_OPTIONS = [
  { id: "acelerar_corazon",    label: "Acelerar el corazón" },
  { id: "resuelve_un_crimen",  label: "Resolver un crimen" },
  { id: "peliculas_emocionales", label: "Películas emocionales" },
  { id: "pasar_un_buen_rato",  label: "Pasar un buen rato" },
  { id: "historias_que_inspiran", label: "Historias que inspiran" },
  { id: "descubre_el_mundo",   label: "Descubrir el mundo" },
];

export const TIME_OPTIONS = [
  { id: "algo_rapido", label: "Algo rápido — menos de 90 min" },
  { id: "tengo_tiempo", label: "Tengo tiempo — sin límite" },
];

export const ENERGY_OPTIONS = [
  { id: "facil",  label: "Pónmelo fácil" },
  { id: "reto",   label: "Acepto el reto" },
];

export const DISCOVERY_OPTIONS = [
  { id: "seguro",    label: "Ir a lo seguro" },
  { id: "descubrir", label: "Descubrir algo nuevo" },
];

export const ERA_OPTIONS = [
  { id: "actual",  label: "Actual — desde 2015" },
  { id: "moderna", label: "Moderna — 1990–2014" },
  { id: "clasica", label: "Clásica — antes de 1990" },
];

// ── Mock results ───────────────────────────────────────────────────────────────
// TODO (EPIC 3 backend): sustituir por la respuesta real de POST /api/session/recommend
//
// Shape alineado con el esquema de BD (epic-1-esquema-bd-catalogo.md):
//   movies: id, tmdb_id, title, poster_path, runtime, release_year,
//           original_language, overview
//   providers[]: provider_id, provider_name, provider_type
//
// El campo "release_year" (no "year") replica la columna exacta de la tabla movies.
// El campo "providers" es un array de objetos, no de strings.

export const MOCK_RESULTS = [
  {
    id: 1,
    tmdb_id: 545611,
    title: "Everything Everywhere All at Once",
    release_year: 2022,
    runtime: 139,
    original_language: "en",
    overview:
      "Una lavandera de mediana edad se ve envuelta en una alucinante aventura multiversal en la que solo ella puede salvar el mundo.",
    poster_path: "/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    providers: [
      { provider_id: 8, provider_name: "Netflix", provider_type: "flatrate" },
    ],
  },
  {
    id: 2,
    tmdb_id: 813758,
    title: "Past Lives",
    release_year: 2023,
    runtime: 105,
    original_language: "en",
    overview:
      "Dos amigos de infancia se reencuentran décadas después en Nueva York, enfrentándose a lo que pudo haber sido.",
    poster_path: "/spELEiSuUaUzTyub2xL29ZdSFbv.jpg",
    providers: [
      { provider_id: 63, provider_name: "Filmin", provider_type: "flatrate" },
    ],
  },
  {
    id: 3,
    tmdb_id: 674324,
    title: "The Banshees of Inisherin",
    release_year: 2022,
    runtime: 114,
    original_language: "en",
    overview:
      "En una isla irlandesa, una amistad de toda la vida se rompe sin motivo aparente, con consecuencias impredecibles.",
    poster_path: "/24zHdUTv3dHOB9VLsPPvx0WGntA.jpg",
    providers: [
      { provider_id: 1899, provider_name: "HBO Max", provider_type: "flatrate" },
    ],
  },
  {
    id: 4,
    tmdb_id: 361743,
    title: "Top Gun: Maverick",
    release_year: 2022,
    runtime: 131,
    original_language: "en",
    overview:
      "Maverick vuelve a la academia para entrenar a una nueva generación de pilotos de élite en una misión casi imposible.",
    poster_path: "/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
    providers: [
      { provider_id: 119, provider_name: "Prime Video", provider_type: "flatrate" },
    ],
  },
];
