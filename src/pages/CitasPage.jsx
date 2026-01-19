import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/auth.context";

const API_URL = "http://localhost:5005";


function CitasPage() {
    const { user, isLoggedIn, isLoading } = useContext(AuthContext);
    const [citas, setCitas] = useState(null);
    const [error, setError] = useState(null);

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

    return <h1>Número de Citas: {citas.length}</h1>
}

export default CitasPage;