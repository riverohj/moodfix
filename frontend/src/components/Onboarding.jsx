import React, { useState } from 'react';
import './Onboarding.css';

// Importación de logos locales
import netflixLogo from '../assets/platform/logo_netflix.jpg';
import movistarLogo from '../assets/platform/logotipo_movistarplus.jpg';
import hbomaxLogo from '../assets/platform/hbo_max_logo.jpg';
import disneyLogo from '../assets/platform/logo_disney.png';
import primevideoLogo from '../assets/platform/prime_video_logo.png';
import filminLogo from '../assets/platform/logo_filmin.jpg';
import appleLogo from '../assets/platform/Apple_TV_Plus_29.png';
import skyLogo from '../assets/platform/sky_logo.png';
import rakutenLogo from '../assets/platform/logo_rakuten.jpg';


const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);

  const platforms = [
    { id: 'netflix', name: 'Netflix', img: netflixLogo },
    { id: 'movistarplus', name: 'Movistar Plus+', img: movistarLogo },
    { id: 'max', name: 'HBO Max', img: hbomaxLogo },
    { id: 'disneyplus', name: 'Disney Plus', img: disneyLogo },
    { id: 'primevideo', name: 'Prime Video', img: primevideoLogo },
    { id: 'filmin', name: 'Filmin', img: filminLogo },
    { id: 'appletv', name: 'Apple TV+', img: appleLogo },
    { id: 'skyshowtime', name: 'SkyShowtime', img: skyLogo },
    { id: 'rakutentv', name: 'Rakuten TV', img: rakutenLogo }
  ];

  const steps = [
    {
      id: "pais",
      pregunta: "Primero lo primero, ¿desde dónde nos ves? 🌍",
      complice: "Configuraremos el catálogo según tu ubicación actual.",
      tipo: "autocomplete",
      placeholder: "Escribe tu país...",
      opciones: ["Argentina", "Bolivia", "Chile", "Colombia", "Costa Rica", "Cuba", "Ecuador", "El Salvador", "España", "Guatemala", "Honduras", "México", "Nicaragua", "Panamá", "Paraguay", "Perú", "Puerto Rico", "República Dominicana", "Uruguay", "Venezuela"]
    },
    {
      id: "plataformas",
      pregunta: "¿A qué mandos tienes acceso hoy? 📺",
      complice: "Marca tus plataformas para filtrar bien tu catálogo.",
      tipo: "platforms"
    },
    {
      id: "idiomas_comodos",
      pregunta: "¿En qué idiomas te sientes como en casa? 🗣️",
      complice: "Dime en qué idiomas ves cine sin esfuerzo.",
      tipo: "autocomplete",
      placeholder: "Escribe un idioma...",
      opciones: ["Español", "Inglés", "Francés", "Portugués", "Alemán", "Italiano", "Japonés", "Coreano", "Chino", "Ruso", "Cualquiera (VOS)"]
    },
    {
      id: "tolerancia_subtitulos",
      pregunta: "Hablemos de leer... ¿qué tal los subtítulos? ✍️",
      complice: "¿Te llevas bien con ellos para ver cine internacional?",
      tipo: "vertical",
      opciones: ["Me llevo bien", "No me llevo bien"]
    },
    {
      id: "no_rotundos",
      pregunta: "¿Hay algo que te haga decir 'por aquí no paso'? 🚫",
      complice: "Tus líneas rojas. Estos géneros no asomarán por tu pantalla.",
      tipo: "pills_grid",
      opciones: [
        "Terror extremo", 
        "Gore", 
        "Musicales", 
        "Cine Bélico", 
        "Drama lacrimógeno", 
        "Reality Shows", 
        "Cine de Autor", 
        "Documentales",
        "Cine Clásico", 
        "Ninguno, soy valiente"
      ]
    }
  ];

  const handleSelect = (val) => {
    const stepId = steps[step].id;
    if (stepId === "no_rotundos") {
      let current = selections[stepId] || [];
      if (val === "Ninguno, soy valiente") {
        setSelections({ ...selections, [stepId]: [val] });
      } else {
        let next = current.filter(item => item !== "Ninguno, soy valiente");
        next = next.includes(val) ? next.filter(x => x !== val) : [...next, val];
        setSelections({ ...selections, [stepId]: next.length > 0 ? next : ["Ninguno, soy valiente"] });
      }
    } else {
      setSelections({ ...selections, [stepId]: val });
      if (steps[step].tipo === "autocomplete") {
        setSearchTerm(val);
        setShowOptions(false);
      }
    }
  };

  const filteredOptions = steps[step].opciones ? steps[step].opciones.filter(opt => 
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const changeStep = (newStep) => {
    setStep(newStep);
    setSearchTerm(selections[steps[newStep].id] || "");
    setShowOptions(false);
  };

  const handleFinish = () => {
    console.log("Guardando preferencias:", selections);
    window.location.href = "/home"; 
  };

  const isLastStep = step === steps.length - 1;

  return (
    <div className="onboarding-wrapper">
      {showSkipModal && (
        <div className="modal-overlay-fixed">
          <div className="modal-content-custom">
            <h2>¿Seguro que quieres saltar? 🛑</h2>
            <p>
              Si no completas el perfil ahora, tus recomendaciones serán genéricas. 
              Pero no te preocupes, siempre podrás completarlo más tarde.
            </p>
            <div className="modal-actions-custom">
              <button className="modal-btn-back" onClick={() => setShowSkipModal(false)}>VOLVER AL TEST</button>
              <button className="modal-btn-skip-anyway" onClick={() => window.location.href = "/home"}>SALTAR E IR A HOME</button>
            </div>
          </div>
        </div>
      )}

      <div className="onboarding-container">
        <button 
            className={`nav-arrow left ${step === 0 ? 'hidden' : ''}`} 
            onClick={() => changeStep(step - 1)}
        > 
            <span className="arrow-icon">&lt;</span>
            <span className="arrow-text">ANTERIOR</span>
        </button>

        <div className="onboarding-card">
          <div className="card-header">
            <h1 className="onboarding-title">{steps[step].pregunta}</h1>
            <p className="complice-box">{steps[step].complice}</p>
          </div>

          <div className="responses-zone">
            {steps[step].tipo === "autocomplete" && (
              <div className="autocomplete-wrapper">
                <input 
                  type="text"
                  className="onboarding-input"
                  placeholder={steps[step].placeholder}
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setShowOptions(true); }}
                  onFocus={() => setShowOptions(true)}
                />
                {showOptions && searchTerm && (
                  <div className="autocomplete-dropdown">
                    {filteredOptions.map(opt => (
                      <div key={opt} className="autocomplete-item" onClick={() => handleSelect(opt)}>
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {steps[step].tipo === "platforms" && (
              <div className="platforms-container">
                {platforms.map(p => (
                  <div key={p.id} className={`platform-card ${selections["plataformas"]?.includes(p.id) ? 'selected' : ''}`} onClick={() => {
                    const current = selections["plataformas"] || [];
                    const next = current.includes(p.id) ? current.filter(x => x !== p.id) : [...current, p.id];
                    setSelections({ ...selections, plataformas: next });
                  }}>
                    <div className="platform-img-wrapper"><img src={p.img} alt={p.name} className="platform-logo-img" /></div>
                    <span className="platform-name">{p.name}</span>
                  </div>
                ))}
              </div>
            )}

            {steps[step].tipo === "pills_grid" && (
              <div className="no-rotundos-layout">
                <div className="no-rotundos-grid">
                  {steps[step].opciones.slice(0, 9).map(opt => (
                    <button 
                      key={opt} 
                      className={`option-btn ${selections[steps[step].id]?.includes(opt) ? 'selected' : ''}`} 
                      onClick={() => handleSelect(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <button 
                  className={`option-btn btn-valiente ${selections[steps[step].id]?.includes("Ninguno, soy valiente") ? 'selected' : ''}`} 
                  onClick={() => handleSelect("Ninguno, soy valiente")}
                >
                  Ninguno, soy valiente
                </button>
              </div>
            )}

            {steps[step].tipo === "vertical" && (
              <div className="vertical-options">
                {steps[step].opciones.map(opt => (
                  <button key={opt} className={`option-btn-long ${selections[steps[step].id] === opt ? 'selected' : ''}`} onClick={() => handleSelect(opt)}>{opt}</button>
                ))}
              </div>
            )}
          </div>

          <div className="skip-footer">
            <button className="skip-btn" onClick={() => setShowSkipModal(true)}>SKIP</button>
          </div>
        </div>

        <button 
            className={`nav-arrow right ${isLastStep ? 'btn-finish' : ''}`} 
            onClick={() => isLastStep ? handleFinish() : changeStep(step + 1)}
        > 
            <span className="arrow-text">{isLastStep ? 'FINALIZAR' : 'SIGUIENTE'}</span>
            <span className="arrow-icon">{isLastStep ? '✓' : '>'}</span>
        </button>
      </div>
    </div>
  );
};

export default Onboarding;