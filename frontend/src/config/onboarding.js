export const COUNTRIES = [
  { value: "ES", label: "España" },
  { value: "MX", label: "México" },
  { value: "AR", label: "Argentina" },
  { value: "CO", label: "Colombia" },
  { value: "CL", label: "Chile" },
  { value: "PE", label: "Perú" },
  { value: "UY", label: "Uruguay" },
  { value: "VE", label: "Venezuela" },
  { value: "EC", label: "Ecuador" },
  { value: "BO", label: "Bolivia" },
  { value: "PY", label: "Paraguay" },
  { value: "CR", label: "Costa Rica" },
  { value: "PA", label: "Panamá" },
  { value: "DO", label: "República Dominicana" },
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
  { value: "es", label: "Español" },
  { value: "en", label: "Inglés" },
  { value: "fr", label: "Francés" },
  { value: "pt", label: "Portugués" },
  { value: "de", label: "Alemán" },
  { value: "it", label: "Italiano" },
  { value: "ja", label: "Japonés" },
  { value: "ko", label: "Coreano" },
  { value: "zh", label: "Chino" },
];

export const HARD_NO_OPTIONS = [
  { value: 27, label: "Terror" },
  { value: 99, label: "Documentales" },
  { value: 10402, label: "Musicales" },
  { value: 10752, label: "Bélicas" },
  { value: 10749, label: "Románticas" },
  { value: 18, label: "Drama" },
  { value: 16, label: "Animación" },
  { value: 878, label: "Ciencia ficción" },
  { value: 9648, label: "Misterio" },
];

export const ONBOARDING_STEPS = [
  {
    id: "pais",
    title: "Primero lo primero, ¿desde dónde nos ves? 🌍",
    description: "Configuraremos el catálogo según tu ubicación actual.",
    type: "single-search",
    placeholder: "Escribe tu país...",
    options: COUNTRIES,
  },
  {
    id: "plataformas",
    title: "¿A qué mandos tienes acceso hoy? 📺",
    description: "Marca tus plataformas para filtrar bien tu catálogo.",
    type: "multi-grid",
    options: PLATFORM_OPTIONS,
  },
  {
    id: "idiomas_comodos",
    title: "¿En qué idiomas te sientes como en casa? 🗣️",
    description: "Dime en qué idiomas ves cine sin esfuerzo.",
    type: "multi-search",
    placeholder: "Escribe un idioma...",
    options: LANGUAGE_OPTIONS,
  },
  {
    id: "tolerancia_subtitulos",
    title: "Hablemos de leer... ¿qué tal los subtítulos? ✍️",
    description: "¿Te llevas bien con ellos para ver cine internacional?",
    type: "single-choice",
    options: [
      { value: "si", label: "Me llevo bien" },
      { value: "no", label: "No me llevo bien" },
    ],
  },
  {
    id: "no_rotundos",
    title: "¿Hay algo que te haga decir 'por aquí no paso'? 🚫",
    description: "Tus líneas rojas. Estos géneros no asomarán por tu pantalla.",
    type: "multi-grid",
    options: HARD_NO_OPTIONS,
  },
];

export const PROFILE_FIELD_LABELS = {
  pais: "País",
  plataformas: "Plataformas",
  idiomas_comodos: "Idiomas cómodos",
  tolerancia_subtitulos: "Tolerancia a subtítulos",
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
