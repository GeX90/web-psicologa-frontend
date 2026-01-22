import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import Loader from "../components/Loader";
import "./EditCitasPage.css";

const API_URL = import.meta.env.VITE_API_URL

function EditCitasPage() {
    const { user, isLoggedIn, isLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [citas, setCitas] = useState(null);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        fecha: "",
        hora: "",
        motivo: ""
    });
    const [loading, setLoading] = useState(false);

    const formatFecha = (fecha) => {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Verifica si una cita puede ser editada/eliminada (dentro de 48 horas)
    const canEditCita = (fecha) => {
        const citaDate = new Date(fecha);
        const now = new Date();
        const diffMs = citaDate - now;
        const diffHours = diffMs / (1000 * 60 * 60);
        return diffHours >= 48;
    };

    useEffect(() => {
        if (isLoading) return;
        if (!isLoggedIn || !user) {
            navigate("/login");
            return;
        }

        const storedToken = localStorage.getItem('authToken');
        
        axios
            .get(`${API_URL}/api/citas`, {
                headers: { Authorization: `Bearer ${storedToken}` }
            })
            .then((response) => {
                console.log("Citas recibidas:", response.data);
                setCitas(response.data);
            })
            .catch((err) => {
                console.error("Error getting Citas:", err.response?.data || err.message);
                setError(err.response?.data?.message || "Error al obtener las citas");
            })
    }, [user, isLoggedIn, isLoading, navigate]);

    const handleEditClick = (cita) => {
        setEditingId(cita._id);
        setFormData({
            fecha: cita.fecha.split('T')[0], 
            hora: cita.hora,
            motivo: cita.motivo
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSaveEdit = async (citaId) => {
        setLoading(true);
        setError(null);

        try {
            const storedToken = localStorage.getItem('authToken');
            await axios.put(
                `${API_URL}/api/citas/${citaId}`,
                formData,
                {
                    headers: { Authorization: `Bearer ${storedToken}` }
                }
            );

            const updatedCitas = citas.map((cita) => 
                cita._id === citaId 
                    ? { ...cita, ...formData, fecha: new Date(formData.fecha).toISOString() }
                    : cita
            );
            setCitas(updatedCitas);
            setEditingId(null);
        } catch (err) {
            console.error("Error updating cita:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Error al actualizar la cita");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCita = async (citaId) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar esta cita?")) {
            setLoading(true);
            setError(null);

            try {
                const storedToken = localStorage.getItem('authToken');
                await axios.delete(
                    `${API_URL}/api/citas/${citaId}`,
                    {
                        headers: { Authorization: `Bearer ${storedToken}` }
                    }
                );

                setCitas(citas.filter((cita) => cita._id !== citaId));
            } catch (err) {
                console.error("Error deleting cita:", err.response?.data || err.message);
                setError(err.response?.data?.message || "Error al eliminar la cita");
            } finally {
                setLoading(false);
            }
        }
    };

    if (isLoading) {
        return <Loader message="Autenticando..." />;
    }

    if (citas === null) {
        return <Loader message="Cargando citas..." />;
    }

    if (error && !editingId) {
        return <h1>Error: {error}</h1>;
    }

    return (
        <div className="edit-citas-container">
            <h1>Gestionar Mis Citas</h1>
            {error && editingId && <p className="error">{error}</p>}
            
            {citas.length === 0 ? (
                <p>No tienes citas registradas</p>
            ) : (
                <div className="citas-list">
                    {citas.map((cita) => {
                        const canEdit = canEditCita(cita.fecha);
                        const isEditing = editingId === cita._id;

                        return (
                            <div className="cita-card" key={cita._id}>
                                {isEditing ? (
                                    <div className="edit-form">
                                        <h3>Editar Cita</h3>
                                        <div className="form-group">
                                            <label htmlFor={`fecha-${cita._id}`}>Fecha:</label>
                                            <input
                                                type="date"
                                                id={`fecha-${cita._id}`}
                                                name="fecha"
                                                value={formData.fecha}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor={`hora-${cita._id}`}>Hora:</label>
                                            <select
                                                id={`hora-${cita._id}`}
                                                name="hora"
                                                value={formData.hora}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Selecciona una hora</option>
                                                <option value="09:00">09:00 - 10:00</option>
                                                <option value="10:00">10:00 - 11:00</option>
                                                <option value="11:00">11:00 - 12:00</option>
                                                <option value="12:00">12:00 - 13:00</option>
                                                <option value="13:00">13:00 - 14:00</option>
                                                <option value="16:00">16:00 - 17:00</option>
                                                <option value="17:00">17:00 - 18:00</option>
                                                <option value="18:00">18:00 - 19:00</option>
                                                <option value="19:00">19:00 - 20:00</option>
                                                <option value="20:00">20:00 - 21:00</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor={`motivo-${cita._id}`}>Motivo:</label>
                                            <textarea
                                                id={`motivo-${cita._id}`}
                                                name="motivo"
                                                value={formData.motivo}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="button-group">
                                            <button 
                                                onClick={() => handleSaveEdit(cita._id)} 
                                                disabled={loading}
                                                className="btn-save"
                                            >
                                                {loading ? "Guardando..." : "Guardar"}
                                            </button>
                                            <button 
                                                onClick={() => setEditingId(null)}
                                                disabled={loading}
                                                className="btn-cancel"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="cita-info">
                                        <p><strong>Fecha:</strong> {formatFecha(cita.fecha)}</p>
                                        <p><strong>Hora:</strong> {cita.hora}</p>
                                        <p><strong>Motivo:</strong> {cita.motivo}</p>
                                        
                                        {!canEdit && (
                                            <p className="warning">
                                                ⚠️ No puedes editar esta cita (faltan menos de 48 horas)
                                            </p>
                                        )}

                                        <div className="button-group">
                                            <button 
                                                onClick={() => handleEditClick(cita)}
                                                disabled={!canEdit || loading}
                                                className="btn-edit"
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteCita(cita._id)}
                                                disabled={!canEdit || loading}
                                                className="btn-delete"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default EditCitasPage;
