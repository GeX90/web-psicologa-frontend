import { useContext } from "react";
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

  return (
    <nav>
      <Link to="/" className="navbar-brand">
        <img src="/icononeuroespacio.png" alt="Neuro Espacio Logo" className="navbar-logo" />
        <span className="navbar-title">NEURO ESPACIO</span>
      </Link>

      <div className="navbar-navigation">
        {!isLoggedIn && (
          <Link to="/signup">
            <button>Reservar Cita</button>
          </Link>
        )}

        {isLoggedIn && (
          <>
            {isAdmin ? (
              // Opciones para Admin
              <>
                <Link to="/admin/citas">
                  <button>Gestionar Citas</button>
                </Link>

                <Link to="/admin/users">
                  <button>Pacientes</button>
                </Link>

                <Link to="/citas">
                  <button>Calendario</button>
                </Link>
              </>
            ) : (
              // Opciones para Usuario normal
              <>
                <Link to="/citas">
                  <button>Mis Citas</button>
                </Link>

                <Link to="/citas/create">
                  <button>Nueva Cita</button>
                </Link>
              </>
            )}
          </>
        )}

        <Link to="/about">
          <button>Sobre Nosotros</button>
        </Link>
      </div>

      <div className="navbar-user-actions">
        {isLoggedIn && (
          <>
            <span>{user && user.name}</span>
            <button onClick={logOutUser}>Cerrar Sesión</button>
          </>
        )}

        {!isLoggedIn && (
          <>
            <Link to="/login">
              <button>Iniciar Sesión</button>
            </Link>
            <Link to="/signup">
              <button>Crear Cuenta</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

