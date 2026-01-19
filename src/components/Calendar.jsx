import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import "./Calendar.css";

const API_URL = "http://localhost:5005";

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener fechas disponibles del backend
    axios
      .get(`${API_URL}/api/citas/disponibles`)
      .then((response) => {
        // Convertir las fechas a formato YYYY-MM-DD para comparación
        const dates = response.data.map(fecha => 
          new Date(fecha).toISOString().split('T')[0]
        );
        setAvailableDates(dates);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error obteniendo fechas disponibles:", error);
        // Si falla, generamos fechas de ejemplo (próximos 30 días)
        const exampleDates = [];
        const today = new Date();
        for (let i = 1; i < 30; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          exampleDates.push(date.toISOString().split('T')[0]);
        }
        setAvailableDates(exampleDates);
        setLoading(false);
      });
  }, []);

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
    return availableDates.includes(dateStr);
  };

  const handleDayClick = (day) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const selectedDate = `${year}-${month}-${dayStr}`;

    if (isLoggedIn) {
      // Si está loggeado, ir a crear cita con la fecha seleccionada
      navigate('/crear-cita', { state: { selectedDate } });
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
      days.push(
        <div
          key={day}
          className={`calendar-day ${available ? 'available' : ''}`}
          title={available ? 'Click para pedir cita' : 'No disponible'}
          onClick={() => available && handleDayClick(day)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  if (loading) {
    return <div className="calendar-loading">Cargando disponibilidad...</div>;
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={previousMonth} className="calendar-nav">‹</button>
        <h2 className="calendar-month">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button onClick={nextMonth} className="calendar-nav">›</button>
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
