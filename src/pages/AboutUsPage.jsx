import "./AboutUsPage.css";

function AboutUsPage() {
  return (
    <div className="AboutUsPage">
      <div className="about-container">
        <h1>Sobre Mí</h1>
        <p>
          Hola! Soy Beatriz de Mergelina, psicóloga y neuropsicóloga clínica.
          Desde siempre me ha movido una mezcla de curiosidad y vocación: entender cómo pensamos, sentimos y nos adaptamos, y poder acompañar a las personas en momentos complejos de su vida.
        </p>

        <h2>Mi Trayectoria</h2>
        <p>
          Mi trayectoria profesional se ha desarrollado en el ámbito del daño cerebral adquirido, las enfermedades neurodegenerativas y los casos de infarto juvenil, trabajando tanto con las personas afectadas como con sus familias. Estas experiencias me han enseñado la importancia de un acompañamiento cercano, humano y respetuoso.
        </p>

        <h2>Áreas de Especialización</h2>
        <p>
          En los últimos años he profundizado especialmente en gestión emocional, ansiedad, depresión y tolerancia a la frustración, además del acompañamiento familiar, que considero una parte fundamental del proceso terapéutico.
          También siento un especial interés por el neurodesarrollo y las divergencias, áreas en las que sigo formándome con mucha ilusión.
        </p>

        <h2>Mi Enfoque Terapéutico</h2>
        <p>
          Mi propósito en terapia es ofrecer un entorno acogedor, sereno y sin valoraciones, donde puedas entender con mayor profundidad lo que te sucede, explorar tus emociones con tranquilidad y descubrir recursos que te permitan seguir adelante con más lucidez y equilibrio.
        </p>

        <h2>Contacto</h2>
        <p>
          ¿Tienes preguntas o quieres agendar una consulta? No dudes en contactarme. Estoy aquí para acompañarte en tu camino hacia el bienestar.
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
