// src/pages/LoginPage.jsx

import { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import Loader from "../components/Loader";
import "./LoginPage.css";

const API_URL = import.meta.env.VITE_API_URL


function LoginPage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  
  const { storeToken, authenticateUser } = useContext(AuthContext);

  
  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(undefined);
    const requestBody = { email, password };

    axios.post(`${API_URL}/auth/login`, requestBody)
      .then((response) => {
        console.log('JWT token', response.data.authToken );
      
        // Save the token in the localStorage.      
        storeToken(response.data.authToken);
        
        // Verify the token by sending a request 
        // to the server's JWT validation endpoint. 
        return authenticateUser();
      })
      .then(() => {
        // Wait for authentication to complete and check if user is admin
        const storedToken = localStorage.getItem('authToken');
        
        return axios.get(`${API_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        });
      })
      .then((verifyResponse) => {
        const userData = verifyResponse.data;
        
        // If user is admin, redirect to admin panel
        if (userData.role === 'ADMIN') {
          navigate('/admin/users');
          return;
        }
        
        // If user is not admin, check if they have appointments
        const storedToken = localStorage.getItem('authToken');
        return axios.get(`${API_URL}/api/citas`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        })
        .then((citasResponse) => {
          // Redirect based on whether user has appointments
          if (citasResponse.data && citasResponse.data.length > 0) {
            navigate('/citas');
          } else {
            navigate('/crear-cita');
          }
        });
      })
      .catch((error) => {
        const errorDescription = error.response?.data?.message || "Error al iniciar sesión";
        setErrorMessage(errorDescription);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  return (
    <div className="LoginPage">
      {loading ? (
        <Loader message="Iniciando sesión..." />
      ) : (
        <>
          <h1>Iniciar Sesión</h1>

          <form onSubmit={handleLoginSubmit}>
            <label>Correo Electrónico:</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleEmail}
            />

            <label>Contraseña:</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handlePassword}
                style={{ paddingRight: '40px', flex: 1 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  top: '0',
                  color: '#666',
                  fontWeight: '500'
                }}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            <button type="submit">Iniciar Sesión</button>
          </form>
          { errorMessage && <p className="error-message">{errorMessage}</p> }

          <p>¿No tienes cuenta todavía?</p>
          <Link to="/signup"> Regístrate</Link>
        </>
      )}
    </div>
  )
}

export default LoginPage;

