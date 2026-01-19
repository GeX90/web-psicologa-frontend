import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import Loader from "../components/Loader";
import "./CreateCitasPage.css";

const API_URL = "http://localhost:5005";

function CreateCitasPage() {
    const { user, isLoggedIn, isLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        fecha: "",
        hora: "",
        motivo: ""
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [existingCitas, setExistingCitas] = useState([]);

    useEffect(() => {
        if (isLoading) return;
        
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }

        // Si viene una fecha seleccionada del calendario, prellenarla
        if (location.state?.selectedDate) {
            setFormData(prev => ({
                ...prev,
                fecha: location.state.selectedDate
            }));
        }

        // Obtener citas existentes para validación
        const storedToken = localStorage.getItem('authToken');
        axios
            .get(`${API_URL}/api/citas`, {
                headers: { Authorization: `Bearer ${storedToken}` }
            })
            .then((response) => {
                setExistingCitas(response.data);
            })
            .catch((err) => {
                console.error("Error obteniendo citas:", err);
            });
    }, [isLoggedIn, isLoading, navigate, location.state]);

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

        // Validar que no exista una cita en la misma fecha y hora
        const citaDuplicada = existingCitas.find((cita) => {
            const citaFecha = new Date(cita.fecha).toISOString().split('T')[0];
            return citaFecha === formData.fecha && cita.hora === formData.hora;
        });

        if (citaDuplicada) {
            setError("Ya existe una cita programada para esta fecha y hora. Por favor, selecciona otro horario.");
            setLoading(false);
            return;
        }

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
            setFormData({ fecha: "", hora: "", motivo: "" });
            navigate("/citas");
        } catch (err) {
            console.error("Error creating cita:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Error al crear la cita");
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return <Loader message="Autenticando..." />;
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
