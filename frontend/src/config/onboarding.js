export const COUNTRIES = [
  { value: "ES", label: "Espana" },
  { value: "MX", label: "Mexico" },
  { value: "AR", label: "Argentina" },
  { value: "CO", label: "Colombia" },
  { value: "CL", label: "Chile" },
  { value: "PE", label: "Peru" },
  { value: "UY", label: "Uruguay" },
  { value: "VE", label: "Venezuela" },
  { value: "EC", label: "Ecuador" },
  { value: "BO", label: "Bolivia" },
  { value: "PY", label: "Paraguay" },
  { value: "CR", label: "Costa Rica" },
  { value: "PA", label: "Panama" },
  { value: "DO", label: "Republica Dominicana" },
  { value: "GT", label: "Guatemala" },
  { value: "HN", label: "Honduras" },
  { value: "NI", label: "Nicaragua" },
  { value: "SV", label: "El Salvador" },
  { value: "PR", label: "Puerto Rico" },
  { value: "CU", label: "Cuba" },
];

export const PLATFORM_OPTIONS = [
  { value: 8, label: "Netflix" },
  { value: 2241, label: "Movistar Plus+" },
  { value: 1899, label: "HBO Max" },
  { value: 337, label: "Disney Plus" },
  { value: 119, label: "Amazon Prime Video" },
  { value: 63, label: "Filmin" },
  { value: 350, label: "Apple TV" },
  { value: 1773, label: "SkyShowtime" },
  { value: 35, label: "Rakuten TV" },
];

export const LANGUAGE_OPTIONS = [
  { value: "es", label: "Espanol" },
  { value: "en", label: "Ingles" },
  { value: "fr", label: "Frances" },
  { value: "pt", label: "Portugues" },
  { value: "de", label: "Aleman" },
  { value: "it", label: "Italiano" },
  { value: "ja", label: "Japones" },
  { value: "ko", label: "Coreano" },
  { value: "zh", label: "Chino" },
];

export const HARD_NO_OPTIONS = [
  { value: 27, label: "Terror" },
  { value: 99, label: "Documentales" },
  { value: 10402, label: "Musicales" },
  { value: 10752, label: "Belicas" },
  { value: 10749, label: "Romanticas" },
  { value: 16, label: "Animacion" },
  { value: 878, label: "Ciencia ficcion" },
  { value: 9648, label: "Misterio" },
];

export const ONBOARDING_STEPS = [
  {
    id: "pais",
    title: "Primero lo primero, desde donde nos ves?",
    description: "Guardamos el pais como codigo ISO para ajustar disponibilidad y catalogo.",
    type: "single-search",
    options: COUNTRIES,
  },
  {
    id: "plataformas",
    title: "A que plataformas tienes acceso ahora mismo?",
    description: "Estas opciones se guardan como provider_id de TMDb, no como texto libre.",
    type: "multi-grid",
    options: PLATFORM_OPTIONS,
  },
  {
    id: "idiomas_comodos",
    title: "En que idiomas ves cine sin esfuerzo?",
    description: "El backend espera codigos de idioma como es o en.",
    type: "multi-search",
    options: LANGUAGE_OPTIONS,
  },
  {
    id: "tolerancia_subtitulos",
    title: "Que tal llevas los subtitulos?",
    description: "Esta respuesta se guarda con valores tecnicos si o no.",
    type: "single-choice",
    options: [
      { value: "si", label: "Me llevo bien" },
      { value: "no", label: "No me llevo bien" },
    ],
  },
  {
    id: "no_rotundos",
    title: "Hay algo que sea un no rotundo para ti?",
    description: "Para MVP se guarda como lista de genre_id de TMDb.",
    type: "multi-grid",
    options: HARD_NO_OPTIONS,
  },
];

export const PROFILE_FIELD_LABELS = {
  pais: "Pais",
  plataformas: "Plataformas",
  idiomas_comodos: "Idiomas comodos",
  tolerancia_subtitulos: "Tolerancia a subtitulos",
  no_rotundos: "No rotundos",
};

export function emptyProfileDraft() {
  return {
    pais: null,
    plataformas: [],
    idiomas_comodos: [],
    tolerancia_subtitulos: null,
    no_rotundos: [],
    onboarding_completed: false,
    onboarding_skipped: false,
  };
}

export function firstIncompleteStepIndex(profile) {
  if (!profile) {
    return 0;
  }

  for (const [index, step] of ONBOARDING_STEPS.entries()) {
    const value = profile[step.id];
    if (Array.isArray(value) && value.length === 0) {
      return index;
    }
    if (!Array.isArray(value) && (value === null || value === "" || typeof value === "undefined")) {
      return index;
    }
  }

  return 0;
}

export function optionLabelByValue(options, value) {
  return options.find((option) => option.value === value)?.label ?? String(value);
}
