import { useContext } from "react";
import { AuthContext } from "../context/auth.context"
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const { 
    isLoggedIn,
    user,                   
    logOutUser              
  } = useContext(AuthContext);

  return (
    <nav>
      <Link to="/" className="navbar-brand">
        <img src="/icononeuroespacio.png" alt="Neuro Espacio Logo" className="navbar-logo" />
        <span className="navbar-title">NEURO ESPACIO</span>
      </Link>

      <div className="navbar-buttons">
        <Link to="/">
          <button>Inicio</button>
        </Link>
        
        {isLoggedIn && (
          <>
            {user?.isAdmin ? (
              // Opciones para Admin
              <>
                <Link to="/admin/users">
                  <button>Usuarios</button>
                </Link>

                <Link to="/admin/citas">
                  <button>Todas las Citas</button>
                </Link>
              </>
            ) : (
              // Opciones para Usuario normal
              <>
                <Link to="/citas">
                  <button>Citas</button>
                </Link>

                <Link to="/crear-cita">
                  <button>Pedir Cita</button>
                </Link>

                <Link to="/editar-citas">
                  <button>Editar Cita</button>
                </Link>
              </>
            )}
            
            <button onClick={logOutUser}>Cerrar Sesión</button>
            <span>{user && user.name}</span>
          </>
        )}

        {!isLoggedIn && (
          <>
            <Link to="/signup">
              <button>Pedir Cita</button>
            </Link>
            <Link to="/signup"> <button>Registrarse</button> </Link>
            <Link to="/login"> <button>Iniciar Sesión</button> </Link>
          </>
        )}

        <Link to="/about">
          <button>Sobre Nosotros</button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

