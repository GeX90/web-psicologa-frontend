import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import Loader from "../components/Loader";
import "./AdminCitasPage.css";

const API_URL = import.meta.env.VITE_API_URL;

function AdminCitasPage() {
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

    useEffect(() => {
        if (isLoading) return;
        
        if (!isLoggedIn || !user) {
            navigate("/login");
            return;
        }

        if (!user.isAdmin) {
            navigate("/");
            return;
        }

        const storedToken = localStorage.getItem('authToken');
        
        axios
            .get(`${API_URL}/api/admin/citas`, {
                headers: { Authorization: `Bearer ${storedToken}` }
            })
            .then((response) => {
                console.log("Citas recibidas:", response.data);
                setCitas(response.data);
            })
            .catch((err) => {
                console.error("Error obteniendo citas:", err.response?.data || err.message);
                setError(err.response?.data?.message || "Error al obtener las citas");
            });
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
                `${API_URL}/api/admin/citas/${citaId}`,
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
            console.error("Error actualizando cita:", err.response?.data || err.message);
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
                    `${API_URL}/api/admin/citas/${citaId}`,
                    {
                        headers: { Authorization: `Bearer ${storedToken}` }
                    }
                );

                setCitas(citas.filter((cita) => cita._id !== citaId));
            } catch (err) {
                console.error("Error eliminando cita:", err.response?.data || err.message);
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
        <div className="admin-citas-container">
            <h1>Gestión de Todas las Citas</h1>
            <p className="subtitle">Total de citas: {citas.length}</p>
            {error && editingId && <p className="error">{error}</p>}
            
            {citas.length === 0 ? (
                <p>No hay citas registradas</p>
            ) : (
                <div className="citas-list">
                    {citas.map((cita) => {
                        const isEditing = editingId === cita._id;

                        return (
                            <div className="cita-card" key={cita._id}>
                                {isEditing ? (
                                    <div className="edit-form">
                                        <h3>Editar Cita</h3>
                                        <div className="user-info">
                                            <p><strong>Usuario:</strong> {cita.usuario?.name || 'N/A'}</p>
                                            <p><strong>Email:</strong> {cita.usuario?.email || 'N/A'}</p>
                                        </div>
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
                                            <input
                                                type="time"
                                                id={`hora-${cita._id}`}
                                                name="hora"
                                                value={formData.hora}
                                                onChange={handleChange}
                                                required
                                            />
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
                                        <div className="user-info">
                                            <p><strong>Usuario:</strong> {cita.usuario?.name || 'N/A'}</p>
                                            <p><strong>Email:</strong> {cita.usuario?.email || 'N/A'}</p>
                                        </div>
                                        <p><strong>Fecha:</strong> {formatFecha(cita.fecha)}</p>
                                        <p><strong>Hora:</strong> {cita.hora}</p>
                                        <p><strong>Motivo:</strong> {cita.motivo}</p>

                                        <div className="button-group">
                                            <button 
                                                onClick={() => handleEditClick(cita)}
                                                disabled={loading}
                                                className="btn-edit"
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteCita(cita._id)}
                                                disabled={loading}
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

export default AdminCitasPage;
