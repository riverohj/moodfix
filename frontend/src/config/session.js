// Constantes y datos para la pantalla de sesión (EPIC 3)
// Contratos de referencia: epic-0-session-signals.md, epic-0-moods.md

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
