import React, { useState, useEffect } from 'react';
import './Onboarding.css';

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);

  const platforms = [
    { id: 'netflix', name: 'Netflix', img: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
    { id: 'movistarplus', name: 'Movistar Plus+', img: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Movistar_Plus%2B_2023.png' },
    { id: 'max', name: 'HBO Max', img: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Max_logo.svg' },
    { id: 'disneyplus', name: 'Disney Plus', img: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg' },
    { id: 'primevideo', name: 'Prime Video', img: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg' },
    { id: 'filmin', name: 'Filmin', img: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Filmin_logo.svg' },
    { id: 'appletv', name: 'Apple TV+', img: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg' },
    { id: 'skyshowtime', name: 'SkyShowtime', img: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/SkyShowtime_logo.svg' },
    { id: 'rakutentv', name: 'Rakuten TV', img: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Rakuten_logo.svg' }
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
      placeholder: "Escribe un idioma (Español, Inglés...)",
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
      tipo: "pills",
      opciones: ["Terror extremo", "Gore", "Maltrato animal", "Drama lacrimógeno", "Ninguno, soy valiente"]
    }
  ];

  const handleSelect = (val) => {
    setSelections({ ...selections, [steps[step].id]: val });
    if (steps[step].tipo === "autocomplete") {
      setSearchTerm(val);
      setShowOptions(false);
    }
  };

  // Filtrado genérico para cualquier paso tipo autocomplete
  const filteredOptions = steps[step].opciones ? steps[step].opciones.filter(opt => 
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Función para navegar y resetear el buscador
  const changeStep = (newStep) => {
    setStep(newStep);
    // Si el nuevo paso tiene un valor guardado, lo ponemos en el buscador, si no, vacío.
    setSearchTerm(selections[steps[newStep].id] || "");
    setShowOptions(false);
  };

  return (
    <div className="onboarding-wrapper">
      
      {showSkipModal && (
        <div className="modal-overlay-fixed">
          <div className="modal-content-custom">
            <h2>¿Seguro que quieres saltar? 🛑</h2>
            <p>
              Si no completas el perfil ahora, tus recomendaciones serán genéricas. 
              Pero no te preocupes, <strong>siempre podrás completarlo más tarde desde tu perfil</strong> para descubrir joyas hechas a tu medida.
            </p>
            <div className="modal-actions-custom">
              <button className="modal-btn-back" onClick={() => setShowSkipModal(false)}>VOLVER AL TEST</button>
              <button className="modal-btn-skip-anyway" onClick={() => setShowSkipModal(false)}>SALTAR POR AHORA</button>
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
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map(opt => (
                        <div key={opt} className="autocomplete-item" onClick={() => handleSelect(opt)}>
                          {opt}
                        </div>
                      ))
                    ) : (
                      <div className="autocomplete-item no-results">No hay resultados</div>
                    )}
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
                    <div className="platform-img-wrapper">
                      <img src={p.img} alt={p.name} />
                    </div>
                    <span className="platform-name">{p.name}</span>
                  </div>
                ))}
              </div>
            )}

            {steps[step].tipo === "pills" && (
              <div className="options-grid">
                {steps[step].opciones.map(opt => (
                  <button key={opt} className={`option-btn ${selections[steps[step].id] === opt ? 'selected' : ''}`} onClick={() => handleSelect(opt)}>{opt}</button>
                ))}
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
            className={`nav-arrow right ${step === steps.length - 1 ? 'hidden' : ''}`} 
            onClick={() => changeStep(step + 1)}
        > 
            <span className="arrow-text">SIGUIENTE</span>
            <span className="arrow-icon">&gt;</span>
        </button>
      </div>
    </div>
  );
};

export default Onboarding;