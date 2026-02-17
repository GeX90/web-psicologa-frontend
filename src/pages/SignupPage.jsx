import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import "./SignupPage.css";

const API_URL = import.meta.env.VITE_API_URL


function SignupPage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  
  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleName = (e) => setName(e.target.value);

  
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(undefined);
    // Create an object representing the request body
    const requestBody = { email, password, name };
 
    // Make an axios request to the API
    // If the POST request is a successful redirect to the login page
    // If the request resolves with an error, set the error message in the state
    axios.post(`${API_URL}/auth/signup`, requestBody, {
      withCredentials: true
    })
      .then((response) => {
        navigate('/login');
      })
      .catch((error) => {
        const errorDescription = error.response?.data?.message || "Error al crear la cuenta. Verifica tu conexión.";
        setErrorMessage(errorDescription);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  
  return (
    <div className="SignupPage">
      {loading ? (
        <Loader message="Creando cuenta..." />
      ) : (
        <>
          <h1>Registrarse</h1>

          <form onSubmit={handleSignupSubmit}>
            <label>Correo Electrónico:</label>
            <input 
              type="email"
              name="email"
              value={email}
              onChange={handleEmail}
            />

            <label>Contraseña:</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handlePassword}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle-btn"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? '�' : '👁️'}
              </button>
            </div>

            <label>Nombre:</label>
            <input 
              type="text"
              name="name"
              value={name}
              onChange={handleName}
            />

            <button type="submit">Registrarse</button>
          </form>

          { errorMessage && <p className="error-message">{errorMessage}</p> }

          <p>¿Ya tienes una cuenta?</p>
          <Link to="/login"> Iniciar Sesión</Link>
        </>
      )}
    </div>
  )
}

export default SignupPage;
