import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const API_URL = "http://localhost:5005";


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
        return <h1>Autenticando...</h1>;
    }

    if (!isLoggedIn) {
        return <h1>Por favor inicia sesión</h1>;
    }

    if (citas === null) {
        return <h1>Cargando citas...</h1>;
    }

    if (error) {
        return <h1>Error: {error}</h1>;
    }

    return (
        <div>
            <h1>Número de Citas: {citas.length}</h1>
            {citas.map((elm, i, arr) => {
                return (
                    <Link to={`/citas/${elm._id}`} key={elm._id} style={{ textDecoration: "none", color: "inherit" }}>
                        <div className="card" style={{ cursor: "pointer" }}>
                            <p>{formatFecha(elm.fecha)}</p>
                            <p>{elm.hora}</p>
                            <p>{elm.motivo}</p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}

export default CitasPage;