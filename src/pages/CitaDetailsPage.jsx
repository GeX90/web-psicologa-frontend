import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import Loader from "../components/Loader";
import "./CitaDetailsPage.css";

const API_URL = import.meta.env.VITE_API_URL

function CitaDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, isLoading, user } = useContext(AuthContext);
  const [cita, setCita] = useState(null);
  const [error, setError] = useState(null);

  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    if (isLoading) return;
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const storedToken = localStorage.getItem("authToken");
    
    // Si el usuario es admin, usar la ruta de admin, sino usar la ruta normal
    const endpoint = user?.isAdmin 
      ? `${API_URL}/api/admin/citas/${id}` 
      : `${API_URL}/api/citas/${id}`;

    axios
      .get(endpoint, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((res) => setCita(res.data))
      .catch((err) => {
        console.error("Error getting cita details:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Error al obtener la cita");
      });
  }, [id, isLoggedIn, isLoading, navigate, user]);

  if (isLoading) return <Loader message="Autenticando..." />;
  if (error) return <h1>Error: {error}</h1>;
  if (!cita) return <Loader message="Cargando detalles..." />;

  return (
    <div className="CitaDetailsPage">
      <div className="cita-details-container">
        <div className="cita-details-header">
          <h2>Detalles de la Cita</h2>
          <p className="cita-details-subtitle">Información completa de tu cita programada</p>
        </div>

        <div className="cita-details-body">
          <div className="cita-detail-item">
            <div className="cita-detail-icon">📅</div>
            <div className="cita-detail-content">
              <p className="cita-detail-label">Fecha</p>
              <p className="cita-detail-value">{formatFecha(cita.fecha)}</p>
            </div>
          </div>

          <div className="cita-detail-item">
            <div className="cita-detail-icon">🕐</div>
            <div className="cita-detail-content">
              <p className="cita-detail-label">Hora</p>
              <p className="cita-detail-value">{cita.hora}</p>
            </div>
          </div>

          <div className="cita-detail-item">
            <div className="cita-detail-icon">📝</div>
            <div className="cita-detail-content">
              <p className="cita-detail-label">Motivo de la Consulta</p>
              <p className="cita-detail-value motivo-text">{cita.motivo}</p>
            </div>
          </div>
        </div>

        <div className="cita-details-actions">
          <button className="btn-editar" onClick={() => navigate("/editar-citas")}>Editar Cita</button>
          <Link to="/citas" className="btn-volver">Volver</Link>
        </div>
      </div>
    </div>
  );
}

export default CitaDetailsPage;
