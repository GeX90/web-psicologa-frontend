import { useContext, useState } from "react";
import { AuthContext } from "../context/auth.context";
import { useTheme } from "../hooks/useTheme";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const { 
    isLoggedIn,
    user,
    isAdmin,
    logOutUser              
  } = useContext(AuthContext);
  
  const { theme, toggleTheme } = useTheme();
  
  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleMenu = (e) => {
    setMenuOpen(!menuOpen);
    if (e?.currentTarget) {
      e.currentTarget.blur();
    }
  };
  
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav>
      <Link to="/" className="navbar-brand">
        <img src="/icononeuroespacio.png" alt="Beatriz de Mergelina Logo" className="navbar-logo" />
        <span className="navbar-title">BEATRIZ DE MERGELINA</span>
      </Link>

      <button className="navbar-burger" onClick={toggleMenu} aria-label="Menu">
        <span className={`burger-line ${menuOpen ? 'open' : ''}`}></span>
        <span className={`burger-line ${menuOpen ? 'open' : ''}`}></span>
        <span className={`burger-line ${menuOpen ? 'open' : ''}`}></span>
      </button>

      <div className={`navbar-navigation ${menuOpen ? 'mobile-open' : ''}`}>
        {!isLoggedIn && (
          <Link to="/signup" onClick={closeMenu} className="nav-link nav-link-cta">
            Reservar Cita
          </Link>
        )}

        {isLoggedIn && (
          <>
            {isAdmin ? (
              // Opciones para Admin
              <>
                <Link to="/admin/citas" onClick={closeMenu} className="nav-link">
                  Gestionar Citas
                </Link>

                <Link to="/admin/users" onClick={closeMenu} className="nav-link">
                  Pacientes
                </Link>

                <Link to="/calendar" onClick={closeMenu} className="nav-link">
                  Calendario
                </Link>
              </>
            ) : (
              // Opciones para Usuario normal
              <>
                <Link to="/citas" onClick={closeMenu} className="nav-link">
                  Mis Citas
                </Link>

                <Link to="/citas/create" onClick={closeMenu} className="nav-link nav-link-cta">
                  Nueva Cita
                </Link>
              </>
            )}
          </>
        )}

        <Link to="/about" onClick={closeMenu} className="nav-link">
          Sobre Mí
        </Link>
      </div>

      <div className="navbar-user-actions">
        <button 
          onClick={(e) => { toggleTheme(); e.currentTarget.blur(); }}
          className="theme-toggle-btn"
          aria-label={theme === "light" ? "Activar modo oscuro" : "Activar modo claro"}
          title={theme === "light" ? "Activar modo oscuro" : "Activar modo claro"}
        >
          {theme === "light" ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          )}
        </button>

        {isLoggedIn && (
          <>
            <span>{user && user.name}</span>
            <button onClick={(e) => { logOutUser(); closeMenu(); e.currentTarget.blur(); }}>Cerrar Sesión</button>
          </>
        )}

        {!isLoggedIn && (
          <>
            <Link to="/login" onClick={closeMenu} className="nav-btn">
              Iniciar Sesión
            </Link>
            <Link to="/signup" onClick={closeMenu} className="nav-btn">
              Crear Cuenta
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;