import "../css/AboutScreen.css";
import fotoJuan from "../src/assets/platform/juan_huevo.png";
import fotoJose from "../src/assets/platform/jose_foto.jpg";
import fotoBurcu from "../src/assets/platform/Burcu_foto.jpg";
import fotoLourdes from "../src/assets/platform/Lour_foto.jpg";

const TEAM = [
  {
    name: "Juan Rivero",
    role: "Tech Lead",
    photo: fotoJuan,
    color: "#e50914",
    tags: ["Arquitectura", "Auth", "Base de datos"],
    bio: "Diseñó la arquitectura del proyecto desde cero: boilerplate inicial, sistema de autenticación con tokens y el esquema de base de datos que sostiene toda la app. La base técnica sobre la que el equipo construyó.",
  },
  {
    name: "José Angel Rodriguez",
    role: "Backend Lead",
    photo: fotoJose,
    color: "#e87c2a",
    tags: ["Motor determinista", "Refactor", "API"],
    bio: "Construyó el motor de recomendación determinista, refactorizó el backend para que fuera más claro y mantenible, y dejó los endpoints de sesión listos para conectar con el frontend. El catálogo de películas que alimenta MoodFix es trabajo suyo.",
  },
  {
    name: "Burcu Çukurluöz",
    role: "Frontend Lead",
    photo: fotoBurcu,
    color: "#9b59b6",
    tags: ["Historial", "Ver luego", "Responsive"],
    bio: "Implementó el historial de películas, la lista de ver luego y los favoritos. Se encargó del responsive de todas las pantallas para que la app funcione bien en cualquier dispositivo. Tiene ojo para el detalle que no todo el mundo tiene.",
  },
  {
    name: "Lourdes Miranda",
    role: "IA & Integración",
    photo: fotoLourdes,
    color: "#27ae60",
    tags: ["Claude Haiku", "Pregúntame", "Landing"],
    bio: "Integró la IA de Claude Haiku para elegir la película perfecta con una razón personalizada. Desarrolló el flujo Pregúntame, la landing page y los ajustes de CSS para que todo encajara. La que conecta lo técnico con lo que el usuario experimenta.",
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
            <div className="about-avatar" style={{ borderColor: `${member.color}55` }}>
              <img src={member.photo} alt={member.name} className="about-avatar-img" />
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
