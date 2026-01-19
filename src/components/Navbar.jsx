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
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">
          <img src="/icononeuroespacio.png" alt="Neuro Espacio Logo" />
        </Link>
        <span className="navbar-title">NEURO ESPACIO</span>
      </div>

      <div className="navbar-buttons">
        <Link to="/">
          <button>Home</button>
        </Link>
        
        {isLoggedIn && (
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
            
            <button onClick={logOutUser}>Logout</button>
            <span>{user && user.name}</span>
          </>
        )}

        {!isLoggedIn && (
          <>
            <Link to="/signup">
              <button>Pedir Cita</button>
            </Link>
            <Link to="/signup"> <button>Sign Up</button> </Link>
            <Link to="/login"> <button>Login</button> </Link>
          </>
        )}

        <Link to="/about">
          <button>About Us</button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

