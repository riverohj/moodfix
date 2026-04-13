import "../css/home.css";
import "../css/LandingPage.css";

export default function Home({ ctaLabel = "Encuentra tu Película", onPrimaryAction }) {

  const scrollToNext = () => {
    const nextSection = document.getElementById("stats-section");
    nextSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="landing-container">
      {/* 1. HERO JOSÉ */}
      <section className="home-page">
        <section className="home-card">
          <div className="home-copy">
            <h1>Demasiadas opciones?</h1>
            <p className="home-subtitle">No sabes que ver?</p>
            <p className="home-highlight">deja de hacer scroll</p>
            <p className="home-description">recibe una pelicula que realmente valga la pena.</p>
          </div>
          <button type="button" className="home-cta" onClick={onPrimaryAction}>{ctaLabel}</button>
        </section>
      </section>

      {/* 2. HERO SLOGAN */}
      <section className="landing-hero-slogan">
        <div className="top-recomendador">
          <span className="recomendador-line"></span>
          <span>TU RECOMENDADOR DE PELÍCULAS</span>
          <span className="recomendador-line"></span>
        </div>
        <div className="burger-emoji-main">🍔</div>
        <h2>
          Tu hamburguesa se enfría<br />
          mientras decides<br />
          <span className="red-text">qué ver.</span>
        </h2>
        <p className="slogan-description">
          El problema no es Netflix, es la decisión. MoodFix te da la película perfecta en 10 segundos basándose en cómo te sientes y cómo eres.
        </p>
        
        <div className="hero-vertical-cta-group">
          <button className="cta-scroll-btn-styled" onClick={scrollToNext}>Ver cómo funciona ↓</button>
          <div className="social-proof-row-fixed">
            <div className="proof-dots-container">
              {['😌', '🍿', '🍕', '🤩', '🔥'].map((emoji, i) => (
                <span key={i} className="proof-dot-item">{emoji}</span>
              ))}
              <span className="proof-dot-item dot-plus">+</span>
            </div>
            <p className="proof-text-label"><span>+2.400 personas</span> ya decidieron esta semana</p>
          </div>
        </div>
      </section>

      {/* 3. STATS */}
      <section id="stats-section" className="landing-stats-row">
        <div className="stat-box-unit">
          <span className="stat-number-big">+70%</span>
          <p>😩 del tiempo delante de Netflix para terminar sin elegir nada.</p>
        </div>
        <div className="stat-box-unit">
          <span className="stat-number-big">23 min</span>
          <p>⏰ de media perdidos buscando qué ver cada noche.</p>
        </div>
        <div className="stat-box-unit">
          <span className="stat-number-big">10 seg</span>
          <p>⚡ es lo que tarda MoodFix en darte la respuesta.</p>
        </div>
        <div className="stat-box-unit">
          <span className="stat-number-big">83%</span>
          <p>🍕 de pizzas y hamburguesas tristes se enfrían cada viernes</p>
        </div>
      </section>

      {/* 4. EL PROBLEMA */}
      <section className="landing-problem-split">
        <div className="problem-text-side">
          <span className="tag-red-label">EL PROBLEMA</span>
          <h2>El problema no es el contenido.</h2>
          <p>Es como tener un catálogo infinito y no saber qué elegir. Tienes acceso a miles de películas, pero cuantas más opciones, peor decides.</p>
        </div>
        <div className="problem-card-side">
          <div className="burger-quote-box">
            <div className="quote-burger-img">🍔</div>
            <div className="quote-body">
                <div className="quote-red-divider"></div>
                <p className="quote-main-text">
                  "Llevamos más de 40 minutos buscando algo que ver... <strong>y la hamburguesa ya está fría.</strong>"
                </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LA SOLUCIÓN */}
      <section className="landing-solution-section">
        <span className="tag-red-label">LA SOLUCIÓN</span>
        <div className="sol-header-area">
          <h2>No es buscar.<br />Es que aciertes sin buscar.</h2>
          <p>Sin listas interminables. Sin filtros. Sin debate. Tres pasos y listo.</p>
        </div>
        <div className="sol-cards-grid">
          <div className="sol-card-item">
            <div className="sol-card-emoji">😌</div>
            <div className="sol-card-number">1</div>
            <h4>Dices cómo te sientes</h4>
            <p>Relajado, con ganas de reír, algo intenso...</p>
          </div>
          <div className="sol-card-item">
            <div className="sol-card-emoji">⚡</div>
            <div className="sol-card-number">2</div>
            <h4>MoodFix decide</h4>
            <p>En segundos. Sin scroll. Sin debate por el mando.</p>
          </div>
          <div className="sol-card-item">
            <div className="sol-card-emoji">🍿</div>
            <div className="sol-card-number">3</div>
            <h4>Tú disfrutas</h4>
            <p>Con la hamburguesa todavía caliente. ¡Atracón!</p>
          </div>
        </div>
      </section>


      {/* 7. EXPERIENCIA GUIADA */}
      <section className="guided-exp-section">
        <div className="guided-text-container">
          <div className="guided-gray-titles">
            <p>No es un catálogo.</p>
            <p>No es un buscador.</p>
          </div>
          <h2 className="guided-white-title">No es un filtro más.</h2>
          <div className="guided-red-divider"></div>
          <h2 className="guided-red-main">Es una experiencia guiada<br />por tu estado.</h2>
          <p className="guided-footer-text">
            Reducimos el tiempo de decisión a <strong>segundos</strong>. Y<br />
            te devolvemos lo más importante: <strong>disfrutar</strong>.
          </p>
        </div>
      </section>

      {/* 8. MEMORIA (Bordes unificados) */}
      <section className="mem-memory-section">
        <span className="mem-tag-label">Y ADEMÁS</span>
        <h2 className="mem-main-title">Memoria cinematográfica externa.</h2>
        <p className="mem-main-subtitle">Para que no repitas los mismos errores (de película).</p>
        
        <div className="mem-cards-container">
          <div className="mem-card mem-card-red-border">
            <div className="mem-icon-box">⭐</div>
            <h4>Favoritas</h4>
            <p>Guarda las películas que realmente te gustaron. Sin perderlas nunca.</p>
          </div>
          <div className="mem-card mem-card-red-border">
            <div className="mem-icon-box">📜</div>
            <h4>Historial</h4>
            <p>Todo lo que has visto, guardado. Para no repetirte ni olvidarte de nada.</p>
          </div>
        </div>
      </section>

{/* --- ÚLTIMA SESIÓN: CIERRE FINAL (image_1210c3.png) --- */}
      <section className="final-cta-section">
        <div className="final-cta-content">
          <div className="final-cta-titles">
            <p className="final-title-dark">Esto no va de películas.</p>
            <h2 className="final-title-white">Va de salvar</h2>
            <h2 className="final-title-red">tus viernes.</h2>
          </div>

          <p className="final-cta-description">
            Crea tu cuenta gratis y decide qué ver en <br />
            menos de 10 segundos. Sin esfuerzo. Sin <br />
            debate. Sin hamburguesa fría.
          </p>

          <button className="final-register-btn" onClick={onPrimaryAction}>
            Crear cuenta gratis →
          </button>

          <div className="final-trust-badges">
            <span>Registro gratuito</span>
            <span className="trust-divider">•</span>
            <span>Sin tarjeta de crédito</span>
            <span className="trust-divider">•</span>
            <span>Cancela cuando quieras</span>
          </div>
        </div>
      </section>
    </div>
  );
}