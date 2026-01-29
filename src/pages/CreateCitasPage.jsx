import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import Loader from "../components/Loader";
import "./CreateCitasPage.css";

const API_URL = import.meta.env.VITE_API_URL

function CreateCitasPage() {
    const { user, isLoggedIn, isLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [step, setStep] = useState(1); // 1: seleccionar fecha/hora, 2: formulario con detalles
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedHora, setSelectedHora] = useState(null);
    const [formData, setFormData] = useState({
        fecha: "",
        hora: "",
        motivo: ""
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [existingCitas, setExistingCitas] = useState([]);
    const [disponibilidad, setDisponibilidad] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        if (isLoading) return;
        
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }

        cargarDisponibilidad();

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
    }, [isLoggedIn, isLoading, navigate]);

    const cargarDisponibilidad = async () => {
        try {
            const storedToken = localStorage.getItem('authToken');
            const response = await axios.get(
                `${API_URL}/api/citas/disponibilidad`,
                {
                    headers: { Authorization: `Bearer ${storedToken}` }
                }
            );
            setDisponibilidad(response.data);
        } catch (error) {
            console.error("Error cargando disponibilidad:", error);
            setError("Error al cargar la disponibilidad");
        }
    };

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

        // La fecha y hora ya están seleccionadas en el step 1
        const citaData = {
            fecha: selectedDate,
            hora: selectedHora,
            motivo: formData.motivo
        };

        try {
            const storedToken = localStorage.getItem('authToken');
            const response = await axios.post(
                `${API_URL}/api/citas`,
                citaData,
                {
                    headers: { Authorization: `Bearer ${storedToken}` }
                }
            );

            console.log("Cita creada:", response.data);
            setFormData({ fecha: "", hora: "", motivo: "" });
            setStep(1);
            setSelectedDate(null);
            setSelectedHora(null);
            navigate("/citas");
        } catch (err) {
            console.error("Error creating cita:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Error al crear la cita");
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek };
    };

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        setSelectedDate(null);
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        setSelectedDate(null);
    };

    const getFechaString = (dia) => {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const dayStr = String(dia).padStart(2, '0');
        return `${year}-${month}-${dayStr}`;
    };

    const getHorariosDisponibles = (fecha) => {
        return disponibilidad.filter(disp => {
            const dispFecha = new Date(disp.fecha).toISOString().split('T')[0];
            return dispFecha === fecha && disp.disponible;
        });
    };

    const isHoraReservada = (fecha, hora) => {
        return existingCitas.some(cita => {
            const citaFecha = new Date(cita.fecha).toISOString().split('T')[0];
            return citaFecha === fecha && cita.hora === hora;
        });
    };

    const handleDaySelect = (dia) => {
        const fecha = getFechaString(dia);
        const horariosDisp = getHorariosDisponibles(fecha);
        
        if (horariosDisp.length === 0) {
            setError("No hay horarios disponibles para este día");
            return;
        }

        setSelectedDate(fecha);
        setError(null);
    };

    const handleHoraSelect = (hora) => {
        if (isHoraReservada(selectedDate, hora)) {
            setError("Este horario ya está reservado. Por favor, selecciona otro.");
            return;
        }
        
        setSelectedHora(hora);
        setStep(2);
        setError(null);
    };

    const renderCalendar = () => {
        const { daysInMonth, startingDayOfWeek } = getDaysInMonth();
        const days = [];

        // Empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Actual days
        for (let day = 1; day <= daysInMonth; day++) {
            const fecha = getFechaString(day);
            const horariosDisp = getHorariosDisponibles(fecha);
            const hasAvailability = horariosDisp.length > 0;
            const isPast = new Date(fecha) < new Date(new Date().setHours(0, 0, 0, 0));

            days.push(
                <div
                    key={day}
                    className={`calendar-day ${!hasAvailability || isPast ? 'unavailable' : ''} ${selectedDate === fecha ? 'selected' : ''}`}
                    onClick={() => !isPast && hasAvailability && handleDaySelect(day)}
                >
                    <span className="day-number">{day}</span>
                    {hasAvailability && !isPast && (
                        <span className="availability-badge">{horariosDisp.length}</span>
                    )}
                </div>
            );
        }

        return days;
    };

    if (isLoading) {
        return <Loader message="Autenticando..." />;
    }

    return (
        <div className="create-citas-container">
            <h1>Crear Nueva Cita</h1>
            {error && <p className="error">{error}</p>}
            
            {step === 1 ? (
                <div className="availability-selection">
                    <div className="calendar-header">
                        <button onClick={previousMonth} className="month-nav-btn">←</button>
                        <h2>
                            {currentDate.toLocaleDateString('es-ES', { 
                                month: 'long', 
                                year: 'numeric' 
                            })}
                        </h2>
                        <button onClick={nextMonth} className="month-nav-btn">→</button>
                    </div>

                    <p className="instruction">Selecciona un día con disponibilidad:</p>

                    <div className="calendar-weekdays">
                        <div>Dom</div>
                        <div>Lun</div>
                        <div>Mar</div>
                        <div>Mié</div>
                        <div>Jue</div>
                        <div>Vie</div>
                        <div>Sáb</div>
                    </div>

                    <div className="calendar-grid">
                        {renderCalendar()}
                    </div>

                    {selectedDate && (
                        <div className="time-selection">
                            <h3>Horarios disponibles para {new Date(selectedDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}:</h3>
                            <div className="time-slots">
                                {getHorariosDisponibles(selectedDate).map((disp) => {
                                    const isReservada = isHoraReservada(selectedDate, disp.hora);
                                    return (
                                        <button
                                            key={disp.hora}
                                            className={`time-slot ${isReservada ? 'reserved' : ''}`}
                                            onClick={() => !isReservada && handleHoraSelect(disp.hora)}
                                            disabled={isReservada}
                                        >
                                            {disp.hora}:00 - {parseInt(disp.hora) + 1}:00
                                            {isReservada && <span className="reserved-label"> (Reservado)</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="details-form">
                    <div className="selected-info">
                        <p><strong>Fecha seleccionada:</strong> {new Date(selectedDate).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        <p><strong>Hora seleccionada:</strong> {selectedHora}:00 - {parseInt(selectedHora) + 1}:00</p>
                        <button onClick={() => { setStep(1); setSelectedHora(null); }} className="btn-change-time">
                            Cambiar fecha/hora
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="motivo">Motivo de la consulta:</label>
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
                            {loading ? "Creando cita..." : "Confirmar Cita"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default CreateCitasPage;
