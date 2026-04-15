import "../css/AboutScreen.css";

const TEAM = [
  {
    name: "Juan Rivero",
    role: "Full Stack Developer",
    avatar: "JR",
    color: "#e50914",
    tags: ["Backend", "Motor IA", "Arquitectura"],
    bio: "El cerebro detrás del motor de recomendación. Diseñó la arquitectura del sistema determinista, separó la lógica en módulos limpios y dejó la base técnica sobre la que todo el equipo construye. Si MoodFix recomienda bien, es gracias a Juan.",
  },
  {
    name: "José Angel Rodriguez",
    role: "Full Stack Developer",
    avatar: "JA",
    color: "#e87c2a",
    tags: ["Backend", "API", "Base de datos"],
    bio: "Arquitecto del backend. Construyó la integración con TMDb, diseñó el esquema de base de datos local y dejó los endpoints listos para que el frontend funcionara sin fricciones. El catálogo de 417 películas que alimenta MoodFix es trabajo suyo.",
  },
  {
    name: "Burcu Çukurluöz",
    role: "Full Stack Developer",
    avatar: "BÇ",
    color: "#9b59b6",
    tags: ["Frontend", "UI/UX", "Historial"],
    bio: "La responsable de que MoodFix sea bonito de usar. Implementó el historial, pulió la experiencia de usuario y se encargó de que cada pantalla tuviera coherencia visual. Tiene ojo para el detalle que no todo el mundo tiene.",
  },
  {
    name: "Lourdes Miranda",
    role: "Full Stack Developer",
    avatar: "LM",
    color: "#27ae60",
    tags: ["Frontend", "Backend", "Producto"],
    bio: "Full stack de verdad. Construyó el onboarding, la home privada, los endpoints de persistencia de sesión y dio varias vueltas al diseño hasta que quedó como tenía que quedar. La que conecta los puntos entre lo que el equipo construye y lo que el usuario experimenta.",
  },
];

export default function AboutScreen() {
  return (
    <section className="about-page">
      <div className="about-header">
        <span className="about-tag">EL EQUIPO</span>
        <h1 className="about-title">Cuatro personas.<br />Un problema resuelto.</h1>
        <p className="about-subtitle">
          Somos estudiantes de Full Stack Development en 4Geeks Academy. MoodFix nació de una pregunta simple: <br></br>¿por qué es tan difícil elegir qué ver?
        </p>
      </div>

      <div className="about-grid">
        {TEAM.map((member) => (
          <article className="about-card" key={member.name}>
            <div className="about-avatar" style={{ background: `${member.color}22`, borderColor: `${member.color}55` }}>
              <span className="about-avatar-initials" style={{ color: member.color }}>{member.avatar}</span>
            </div>
            <div className="about-card-body">
              <h2 className="about-name">{member.name}</h2>
              <p className="about-role">{member.role}</p>
              <div className="about-tags">
                {member.tags.map((tag) => (
                  <span className="about-tag-chip" key={tag}>{tag}</span>
                ))}
              </div>
              <p className="about-bio">{member.bio}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="about-footer-note">
        <p>Proyecto académico desarrollado en <strong>4Geeks Academy</strong> · 2026</p>
      </div>
    </section>
  );
}
