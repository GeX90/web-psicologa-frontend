import "./Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>BEATRIZ DE MERGELINA</h3>
          <p>Un entorno acogedor y sereno para tu bienestar emocional.</p>
        </div>

        <div className="footer-section">
          <h4>Navegación</h4>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/about">Sobre Mí</Link></li>
            <li><Link to="/signup">Pedir Cita</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contacto</h4>
          <p>Email: bdmm1993nps@gmail.com</p>
          <p>Teléfono: +34 623 054 187</p>
          <p>Horario: Lun-Vie 9:00 - 20:00</p>
        </div>

        <div className="footer-section">
          <h4>Síguenos</h4>
          <div className="social-links">
            <a href="https://www.instagram.com/beatrizdemergelina?igsh=MXAwMTJheml5bDg5bg==" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Beatriz de Mergelina. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
