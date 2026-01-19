import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const API_URL = "http://localhost:5005";

function CreateCitasPage() {
    const { user, isLoggedIn, isLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fecha: "",
        hora: "",
        motivo: ""
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isLoading) return;
        
        if (!isLoggedIn) {
            // Redirigir al login si no está logeado
            navigate("/login");
            return;
        }
    }, [isLoggedIn, isLoading, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const storedToken = localStorage.getItem('authToken');
            const response = await axios.post(
                `${API_URL}/api/citas`,
                formData,
                {
                    headers: { Authorization: `Bearer ${storedToken}` }
                }
            );

            console.log("Cita creada:", response.data);
            // Limpiar el formulario
            setFormData({ fecha: "", hora: "", motivo: "" });
            // Redirigir a la página de citas
            navigate("/citas");
        } catch (err) {
            console.error("Error creating cita:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Error al crear la cita");
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return <h1>Autenticando...</h1>;
    }

    return (
        <div className="create-citas-container">
            <h1>Crear Nueva Cita</h1>
            {error && <p className="error">{error}</p>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="fecha">Fecha:</label>
                    <input
                        type="date"
                        id="fecha"
                        name="fecha"
                        value={formData.fecha}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="hora">Hora:</label>
                    <input
                        type="time"
                        id="hora"
                        name="hora"
                        value={formData.hora}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="motivo">Motivo:</label>
                    <textarea
                        id="motivo"
                        name="motivo"
                        value={formData.motivo}
                        onChange={handleChange}
                        placeholder="Describe el motivo de la cita"
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Creando cita..." : "Crear Cita"}
                </button>
            </form>
        </div>
    );
}

export default CreateCitasPage;
