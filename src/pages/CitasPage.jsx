import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import Loader from "../components/Loader";
import "./CitasPage.css";

const API_URL = import.meta.env.VITE_API_URL


function CitasPage() {
    const { user, isLoggedIn, isLoading } = useContext(AuthContext);
    const [citas, setCitas] = useState(null);
    const [error, setError] = useState(null);

    const formatFecha = (fecha) => {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    useEffect(() => {
        if (isLoading) return;
        if (!isLoggedIn || !user) return;

        const storedToken = localStorage.getItem('authToken');
        
        axios
            .get(`${API_URL}/api/citas`, {
                headers: { Authorization: `Bearer ${storedToken}` }
            })
            .then((response) => {
                console.log("Citas recibidas:", response.data);
                setCitas(response.data);
            })
            .catch((error) => {
                console.error("Error getting Listado de Citas:", error.response?.data || error.message);
                setError(error.response?.data?.message || "Error al obtener las citas");
            })
    }, [user, isLoggedIn, isLoading]);

    if (isLoading) {
        return <Loader message="Autenticando..." />;
    }

    if (!isLoggedIn) {
        return <h1>Por favor inicia sesión</h1>;
    }

    if (citas === null) {
        return <Loader message="Cargando citas..." />;
    }

    if (error) {
        return <h1>Error: {error}</h1>;
    }

    return (
        <div className="CitasPage">
            <div className="CitasPage-header">
                <h1>Mis Citas</h1>
                <p className="subtitle">{citas.length} {citas.length === 1 ? 'cita programada' : 'citas programadas'}</p>
            </div>
            
            {citas.length === 0 ? (
                <div className="CitasPage-empty">
                    <div className="CitasPage-empty-icon">📅</div>
                    <h2>No tienes citas programadas</h2>
                    <p>Comienza a gestionar tu salud mental reservando tu primera cita</p>
                    <Link to="/crear-cita" className="btn-create">Crear Nueva Cita</Link>
                </div>
            ) : (
                <div className="citas-grid">
                    {citas.map((elm) => {
                        const fecha = new Date(elm.fecha);
                        const dia = fecha.getDate();
                        
                        return (
                            <Link to={`/citas/${elm._id}`} key={elm._id} className="cita-card-link">
                                <div className="cita-card">
                                    <div className="cita-card-header">
                                        <div className="cita-card-icon">{dia}</div>
                                        <div className="cita-card-date">
                                            <p className="day">{fecha.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }).toUpperCase()}</p>
                                            <p className="full-date">{formatFecha(elm.fecha)}</p>
                                        </div>
                                    </div>
                                    <div className="cita-card-body">
                                        <div className="cita-card-time">{elm.hora}</div>
                                        <p className="cita-card-motivo">
                                            <strong>Motivo:</strong>
                                            {elm.motivo}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default CitasPage;