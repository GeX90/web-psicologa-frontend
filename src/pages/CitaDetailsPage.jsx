import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const API_URL = "http://localhost:5005";

function CitaDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, isLoading } = useContext(AuthContext);
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

    axios
      .get(`${API_URL}/api/citas/${id}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((res) => setCita(res.data))
      .catch((err) => {
        console.error("Error getting cita details:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Error al obtener la cita");
      });
  }, [id, isLoggedIn, isLoading, navigate]);

  if (isLoading) return <h1>Autenticando...</h1>;
  if (error) return <h1>Error: {error}</h1>;
  if (!cita) return <h1>Cargando detalles...</h1>;

  return (
    <div className="card" style={{ maxWidth: 600 }}>
      <h2>Detalles de la Cita</h2>
      <p><strong>Fecha:</strong> {formatFecha(cita.fecha)}</p>
      <p><strong>Hora:</strong> {cita.hora}</p>
      <p><strong>Motivo:</strong> {cita.motivo}</p>

      <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
        <button onClick={() => navigate("/editar-citas")}>Editar Cita</button>
        <Link to="/citas"><button>Volver</button></Link>
      </div>
    </div>
  );
}

export default CitaDetailsPage;
