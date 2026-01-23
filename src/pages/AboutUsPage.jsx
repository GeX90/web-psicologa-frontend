import "./AboutUsPage.css";

function AboutUsPage() {
  return (
    <div className="AboutUsPage">
      <div className="about-container">
        <h1>Sobre Nosotros</h1>
        <p>
          En Neuro Espacio, nos dedicamos a proporcionar servicios de salud mental de alta calidad
          y accesible para todos. Nuestro equipo de profesionales especializados está comprometido
          con tu bienestar y desarrollo personal.
        </p>

        <h2>Nuestra Misión</h2>
        <p>
          Ofrecer un espacio seguro y confidencial donde puedas explorar tus emociones,
          resolver conflictos internos y crecer como persona con el apoyo de profesionales
          calificados.
        </p>

        <h2>Nuestros Valores</h2>
        <ul>
          <li><strong>Confidencialidad:</strong> Tu privacidad es sagrada para nosotros</li>
          <li><strong>Profesionalismo:</strong> Contamos con especialistas altamente capacitados</li>
          <li><strong>Empatía:</strong> Nos importa genuinamente tu bienestar</li>
          <li><strong>Accesibilidad:</strong> Queremos que todos tengan acceso a salud mental de calidad</li>
        </ul>

        <h2>¿Por qué elegirnos?</h2>
        <p>
          Contamos con años de experiencia en el campo de la psicología y la salud mental.
          Nuestro enfoque es personalizado, adaptando cada sesión a tus necesidades específicas.
          Creemos en un ambiente de confianza y respeto mutuo.
        </p>

        <h2>Contacto</h2>
        <p>
          ¿Tienes preguntas? No dudes en contactarnos. Estamos aquí para ayudarte en tu
          camino hacia el bienestar mental.
        </p>

        <h2>Web Developer</h2>
        <p>
          <strong>Jorge Jiménez Morgado</strong>
        </p>
        <div className="developer-links">
          <a 
            href="https://github.com/GeX90" 
            target="_blank" 
            rel="noopener noreferrer"
            className="dev-link"
          >
            <span>GitHub</span>
          </a>
          <a 
            href="https://www.linkedin.com/in/jorge-jimenez-morgado/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="dev-link"
          >
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default AboutUsPage;
