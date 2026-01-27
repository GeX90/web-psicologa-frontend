import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import Loader from "../components/Loader";
import "./CalendarPage.css";

const API_URL = import.meta.env.VITE_API_URL;

function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [citasData, setCitasData] = useState([]);
  const [allCitas, setAllCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('month'); // 'week' or 'month'
  const [filterPaciente, setFilterPaciente] = useState('');
  const [filterMotivo, setFilterMotivo] = useState('');
  const [tempFilterPaciente, setTempFilterPaciente] = useState('');
  const [tempFilterMotivo, setTempFilterMotivo] = useState('');
  const [pacientes, setPacientes] = useState([]);
  const { isLoggedIn, user, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn || !isAdmin) {
      navigate("/");
      return;
    }

    // Obtener todas las citas y pacientes
    const storedToken = localStorage.getItem('authToken');
    
    Promise.all([
      axios.get(`${API_URL}/api/admin/citas`, {
        headers: { Authorization: `Bearer ${storedToken}` }
      }),
      axios.get(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
    ])
      .then(([citasResponse, usersResponse]) => {
        setAllCitas(citasResponse.data);
        setCitasData(citasResponse.data);
        setPacientes(usersResponse.data.filter(u => u.role === 'USER'));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error obteniendo datos:", error);
        setLoading(false);
      });
  }, [isLoggedIn, isAdmin, navigate]);

  // Aplicar filtros cuando cambian los filtros activos
  useEffect(() => {
    let filtered = [...allCitas];

    if (filterPaciente) {
      filtered = filtered.filter(cita => 
        cita.usuario && cita.usuario._id === filterPaciente
      );
    }

    if (filterMotivo) {
      filtered = filtered.filter(cita => 
        cita.motivo.toLowerCase().includes(filterMotivo.toLowerCase())
      );
    }

    setCitasData(filtered);
  }, [filterPaciente, filterMotivo, allCitas]);

  const handleSearch = () => {
    setFilterPaciente(tempFilterPaciente);
    setFilterMotivo(tempFilterMotivo);
  };

  const handleClearFilters = () => {
    setTempFilterPaciente('');
    setTempFilterMotivo('');
    setFilterPaciente('');
    setFilterMotivo('');
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

  const getCitasForDay = (day) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayStr}`;
    
    return citasData.filter(cita => {
      const citaDate = new Date(cita.fecha).toISOString().split('T')[0];
      return citaDate === dateStr && cita.estado !== 'Cancelada';
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const previousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = currentDate.getDay();
    const diff = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
    startOfWeek.setDate(currentDate.getDate() + diff);
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day);
    }
    return weekDays;
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays();
    
    return weekDays.map((day, index) => {
      const dateStr = day.toISOString().split('T')[0];
      const dayCitas = citasData.filter(cita => {
        const citaDate = new Date(cita.fecha).toISOString().split('T')[0];
        return citaDate === dateStr && cita.estado !== 'Cancelada';
      });

      return (
        <div key={index} className="week-day-column">
          <div className="week-day-header">
            <div className="week-day-name">
              {day.toLocaleDateString('es-ES', { weekday: 'short' })}
            </div>
            <div className="week-day-number">{day.getDate()}</div>
          </div>
          <div className="week-day-citas">
            {dayCitas.length > 0 ? (
              dayCitas.map(cita => (
                <div key={cita._id} className="week-cita-card">
                  <div className="cita-time">{cita.hora}</div>
                  <div className="cita-patient">{cita.usuario?.name}</div>
                  <div className="cita-motivo">{cita.motivo}</div>
                </div>
              ))
            ) : (
              <div className="no-citas-day">Sin citas</div>
            )}
          </div>
        </div>
      );
    });
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
      const citas = getCitasForDay(day);
      const hasCitas = citas.length > 0;
      
      days.push(
        <div
          key={day}
          className={`calendar-day ${hasCitas ? 'has-citas' : 'no-citas'}`}
        >
          <span className="day-number">{day}</span>
          {hasCitas && (
            <div className="citas-indicator">
              <span className="citas-count">{citas.length}</span>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  if (loading) {
    return <Loader message="Cargando calendario..." />;
  }

  return (
    <div className="CalendarPage">
      <div className="calendar-page-container">
        <div className="calendar-page-header">
          <div>
            <h1>Calendario de Citas</h1>
            <p className="calendar-subtitle">Vista general de todas las citas programadas</p>
          </div>
          <Link to="/citas/create" className="btn-create-cita">
            + Nueva Cita
          </Link>
        </div>

        {/* Filtros */}
        <div className="calendar-filters">
          <div className="filter-group">
            <label htmlFor="filter-paciente">Paciente:</label>
            <select 
              id="filter-paciente"
              value={tempFilterPaciente} 
              onChange={(e) => setTempFilterPaciente(e.target.value)}
              className="filter-select"
            >
              <option value="">Todos los pacientes</option>
              {pacientes.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="filter-motivo">Buscar motivo:</label>
            <input 
              id="filter-motivo"
              type="text"
              value={tempFilterMotivo}
              onChange={(e) => setTempFilterMotivo(e.target.value)}
              placeholder="Ej: Ansiedad, Terapia..."
              className="filter-input"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <div className="filter-group">
            <label>Vista:</label>
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'week' ? 'active' : ''}`}
                onClick={() => setViewMode('week')}
              >
                Semanal
              </button>
              <button 
                className={`view-btn ${viewMode === 'month' ? 'active' : ''}`}
                onClick={() => setViewMode('month')}
              >
                Mensual
              </button>
            </div>
          </div>

          <div className="filter-actions">
            <button onClick={handleSearch} className="btn-search">
              🔍 Buscar
            </button>
            <button onClick={handleClearFilters} className="btn-clear">
              ✖️ Limpiar
            </button>
          </div>
        </div>

        {/* Feedback de filtros activos */}
        {(filterPaciente || filterMotivo) && (
          <div className="filter-feedback">
            <div className="filter-feedback-content">
              <span className="feedback-icon">🔍</span>
              <div className="feedback-text">
                <strong>Filtros activos:</strong>
                {filterPaciente && (
                  <span className="filter-tag">
                    Paciente: {pacientes.find(p => p._id === filterPaciente)?.name}
                  </span>
                )}
                {filterMotivo && (
                  <span className="filter-tag">
                    Motivo: "{filterMotivo}"
                  </span>
                )}
                <span className="results-count">
                  {citasData.length} cita{citasData.length !== 1 ? 's' : ''} encontrada{citasData.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="calendar-legend">
          <div className="legend-item">
            <div className="legend-color has-citas"></div>
            <span>Días con citas</span>
          </div>
          <div className="legend-item">
            <div className="legend-color no-citas"></div>
            <span>Días sin citas</span>
          </div>
        </div>

        {/* Vista Semanal */}
        {viewMode === 'week' && (
          <div className="calendar-week">
            <div className="calendar-header">
              <button onClick={previousWeek} className="calendar-nav">❮</button>
              <h2 className="calendar-month">
                Semana del {getWeekDays()[0].toLocaleDateString('es-ES')} - {getWeekDays()[6].toLocaleDateString('es-ES')}
              </h2>
              <button onClick={nextWeek} className="calendar-nav">❯</button>
            </div>
            <div className="week-view-grid">
              {renderWeekView()}
            </div>
          </div>
        )}

        {/* Vista Mensual */}
        {viewMode === 'month' && (
          <div className="calendar-large">
            <div className="calendar-header">
              <button onClick={previousMonth} className="calendar-nav">❮</button>
              <h2 className="calendar-month">
                {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
              </h2>
              <button onClick={nextMonth} className="calendar-nav">❯</button>
            </div>

            <div className="calendar-weekdays">
              <div className="weekday">Dom</div>
              <div className="weekday">Lun</div>
              <div className="weekday">Mar</div>
              <div className="weekday">Mié</div>
              <div className="weekday">Jue</div>
              <div className="weekday">Vie</div>
              <div className="weekday">Sáb</div>
            </div>

            <div className="calendar-grid">
              {renderCalendar()}
            </div>
          </div>
        )}

        <div className="calendar-stats">
          <div className="stat-card">
            <div className="stat-number">{citasData.length}</div>
            <div className="stat-label">Total de Citas</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {citasData.filter(c => c.estado === 'Confirmada').length}
            </div>
            <div className="stat-label">Confirmadas</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {citasData.filter(c => c.estado === 'Pendiente').length}
            </div>
            <div className="stat-label">Pendientes</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
