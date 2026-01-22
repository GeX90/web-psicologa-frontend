import { useContext, useState } from "react";
import { AuthContext } from "../context/auth.context"
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const { 
    isLoggedIn,
    user,
    isAdmin,
    logOutUser              
  } = useContext(AuthContext);
  
  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav>
      <Link to="/" className="navbar-brand">
        <img src="/icononeuroespacio.png" alt="Neuro Espacio Logo" className="navbar-logo" />
        <span className="navbar-title">NEURO ESPACIO</span>
      </Link>

      <button className="navbar-burger" onClick={toggleMenu} aria-label="Menu">
        <span className={`burger-line ${menuOpen ? 'open' : ''}`}></span>
        <span className={`burger-line ${menuOpen ? 'open' : ''}`}></span>
        <span className={`burger-line ${menuOpen ? 'open' : ''}`}></span>
      </button>

      <div className={`navbar-navigation ${menuOpen ? 'mobile-open' : ''}`}>
        {!isLoggedIn && (
          <Link to="/signup" onClick={closeMenu}>
            <button>Reservar Cita</button>
          </Link>
        )}

        {isLoggedIn && (
          <>
            {isAdmin ? (
              // Opciones para Admin
              <>
                <Link to="/admin/citas" onClick={closeMenu}>
                  <button>Gestionar Citas</button>
                </Link>

                <Link to="/admin/users" onClick={closeMenu}>
                  <button>Pacientes</button>
                </Link>

                <Link to="/calendar" onClick={closeMenu}>
                  <button>Calendario</button>
                </Link>
              </>
            ) : (
              // Opciones para Usuario normal
              <>
                <Link to="/citas" onClick={closeMenu}>
                  <button>Mis Citas</button>
                </Link>

                <Link to="/citas/create" onClick={closeMenu}>
                  <button>Nueva Cita</button>
                </Link>
              </>
            )}
          </>
        )}

        <Link to="/about" onClick={closeMenu}>
          <button>Sobre Nosotros</button>
        </Link>
      </div>

      <div className="navbar-user-actions">
        {isLoggedIn && (
          <>
            <span>{user && user.name}</span>
            <button onClick={() => { logOutUser(); closeMenu(); }}>Cerrar Sesión</button>
          </>
        )}

        {!isLoggedIn && (
          <>
            <Link to="/login" onClick={closeMenu}>
              <button>Iniciar Sesión</button>
            </Link>
            <Link to="/signup" onClick={closeMenu}>
              <button>Crear Cuenta</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;