import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import "./Calendar.css";

const API_URL = import.meta.env.VITE_API_URL

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [disponibilidad, setDisponibilidad] = useState({});
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    cargarDisponibilidad();
  }, [currentDate]);

  const cargarDisponibilidad = async () => {
    setLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      const fechaInicio = new Date(year, month, 1).toISOString().split('T')[0];
      const fechaFin = new Date(year, month + 1, 0).toISOString().split('T')[0];

      // Timeout de 5 segundos para evitar esperas muy largas
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      );

      const fetchPromise = axios.get(
        `${API_URL}/api/citas/disponibilidad?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
      );

      const response = await Promise.race([fetchPromise, timeoutPromise]);

      // Agrupar por fecha para saber qué días tienen al menos un horario disponible
      const dispPorFecha = {};
      response.data.forEach(item => {
        const fecha = new Date(item.fecha).toISOString().split('T')[0];
        if (!dispPorFecha[fecha]) {
          dispPorFecha[fecha] = [];
        }
        dispPorFecha[fecha].push(item.hora);
      });

      setDisponibilidad(dispPorFecha);
    } catch (error) {
      console.error("Error obteniendo disponibilidad:", error);
      // No mostrar error al usuario, solo usar objeto vacío
      setDisponibilidad({});
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const isAvailable = (day) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayStr}`;
    return disponibilidad[dateStr] && disponibilidad[dateStr].length > 0;
  };

  const getHorariosDisponibles = (day) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayStr}`;
    return disponibilidad[dateStr] || [];
  };

  const handleDayClick = (day) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const selectedDate = `${year}-${month}-${dayStr}`;

    if (isLoggedIn) {
      // Si está loggeado, ir a crear cita con la fecha seleccionada
      navigate('/citas/create', { state: { selectedDate } });
    } else {
      // Si no está loggeado, ir a login (desde ahí pueden ir a signup)
      navigate('/login');
    }
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const days = [];

    // Espacios en blanco antes del primer día
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const available = isAvailable(day);
      const horariosDisp = getHorariosDisponibles(day);
      const cantidadHorarios = horariosDisp.length;
      
      days.push(
        <div
          key={day}
          className={`calendar-day ${available ? 'available' : 'unavailable'}`}
          title={available ? `${cantidadHorarios} horario${cantidadHorarios !== 1 ? 's' : ''} disponible${cantidadHorarios !== 1 ? 's' : ''}` : 'No disponible'}
          onClick={() => available && handleDayClick(day)}
        >
          <span className="day-number">{day}</span>
          {available && (
            <span className="horarios-count">{cantidadHorarios}</span>
          )}
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  if (initialLoad && loading) {
    return (
      <div className="calendar-container">
        <div className="calendar-loading">Cargando disponibilidad...</div>
      </div>
    );
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={previousMonth} className="calendar-nav">←</button>
        <h2 className="calendar-month">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button onClick={nextMonth} className="calendar-nav">→</button>
      </div>

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

      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-color available"></span>
          <span>Disponible</span>
        </div>
        <div className="legend-item">
          <span className="legend-color unavailable"></span>
          <span>No disponible</span>
        </div>
      </div>
    </div>
  );
}

export default Calendar;
