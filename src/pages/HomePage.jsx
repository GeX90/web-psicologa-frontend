import "./HomePage.css";
import Calendar from "../components/Calendar";
import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/auth.context";
import axios from "axios";
import Loader from "../components/Loader";

const API_URL = import.meta.env.VITE_API_URL;

function HomePage() {
    const { isLoggedIn, user } = useContext(AuthContext);
    const [nextAppointment, setNextAppointment] = useState(null);
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [adminStats, setAdminStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(false);

    const isAdmin = user?.role?.toUpperCase() === 'ADMIN';

    // Fetch admin stats if admin
    useEffect(() => {
        if (isLoggedIn && isAdmin) {
            setLoadingStats(true);
            const storedToken = localStorage.getItem('authToken');
            
            axios.get(`${API_URL}/api/admin/stats`, {
                headers: { Authorization: `Bearer ${storedToken}` }
            })
            .then(response => {
                setAdminStats(response.data);
                setLoadingStats(false);
            })
            .catch(err => {
                console.log(err);
                setLoadingStats(false);
            });
        }
    }, [isLoggedIn, isAdmin]);

    // Fetch user's appointments if logged in (non-admin)
    useEffect(() => {
        if (isLoggedIn && user && !isAdmin) {
            const storedToken = localStorage.getItem('authToken');
            
            axios.get(`${API_URL}/api/citas`, {
                headers: { Authorization: `Bearer ${storedToken}` }
            })
            .then(response => {
                const citas = response.data;
                const now = new Date();
                const upcoming = citas
                    .filter(cita => new Date(cita.fecha) > now && cita.estado !== 'Cancelada')
                    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
                
                setUpcomingAppointments(upcoming);
                if (upcoming.length > 0) {
                    setNextAppointment(upcoming[0]);
                }
            })
            .catch(err => console.log(err));
        }
    }, [isLoggedIn, user, isAdmin]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };
    
    return (
        <div className="HomePage">
            <div className="home-content">
                {/* Hero Section - Solo para usuarios no admin */}
                {!isAdmin && (
                    <header className="home-hero">
                        <h1 className="neuro-espacio-title">NEURO ESPACIO</h1>
                        <h2 className="home-main-message">Psicología para tu Bienestar</h2>
                        <p className="home-subtitle">Acompañamiento profesional y cercano</p>
                        
                        <div className="home-cta-buttons">
                            {!isLoggedIn ? (
                                <>
                                    <Link to="/signup" className="btn-cta primary">
                                        Reservar Cita
                                    </Link>
                                    <Link to="/about" className="btn-cta secondary">
                                        Conoce más
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/citas/create" className="btn-cta primary">
                                        Reservar Cita
                                    </Link>
                                    <Link to="/citas" className="btn-cta secondary">
                                        Mis Citas
                                    </Link>
                                </>
                            )}
                        </div>
                    </header>
                )}

                {/* Admin Dashboard - Only for admin users */}
                {isLoggedIn && isAdmin && (
                    <>
                        <section className="admin-dashboard">
                            <h3 className="section-title-small">Dashboard Administrativo</h3>
                            
                            {loadingStats ? (
                                <Loader />
                            ) : adminStats ? (
                                <>
                                    {/* Estadísticas Grid */}
                                    <div className="stats-grid">
                                        <div className="stat-card today">
                                            <div className="stat-icon">📅</div>
                                            <div className="stat-content">
                                                <h4>Citas Hoy</h4>
                                                <p className="stat-number">{adminStats.citasHoy}</p>
                                            </div>
                                        </div>

                                        <div className="stat-card week">
                                            <div className="stat-icon">📊</div>
                                            <div className="stat-content">
                                                <h4>Esta Semana</h4>
                                                <p className="stat-number">{adminStats.citasSemana}</p>
                                            </div>
                                        </div>

                                        <div className="stat-card month">
                                            <div className="stat-icon">📈</div>
                                            <div className="stat-content">
                                                <h4>Este Mes</h4>
                                                <p className="stat-number">{adminStats.citasMes}</p>
                                            </div>
                                        </div>

                                        <div className="stat-card patients">
                                            <div className="stat-icon">👥</div>
                                            <div className="stat-content">
                                                <h4>Pacientes Activos</h4>
                                                <p className="stat-number">{adminStats.pacientesActivos}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Próxima Cita */}
                                    {adminStats.proximaCita && (
                                        <div className="next-appointment-card">
                                            <h4>📌 Próxima Cita Programada</h4>
                                            <div className="appointment-details">
                                                <p className="appointment-patient">
                                                    <strong>{adminStats.proximaCita.usuario.name}</strong>
                                                </p>
                                                <p className="appointment-date">
                                                    {formatDate(adminStats.proximaCita.fecha)} - {adminStats.proximaCita.hora}
                                                </p>
                                                <p className="appointment-motivo">{adminStats.proximaCita.motivo}</p>
                                                <Link 
                                                    to="/admin/citas" 
                                                    className="btn-view-all"
                                                >
                                                    Ver todas las citas
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p>No se pudieron cargar las estadísticas</p>
                            )}
                        </section>

                        {/* Accesos rápidos */}
                        <section className="admin-quick-actions">
                            <h3 className="section-title-small">Accesos Rápidos</h3>
                            
                            <div className="admin-grid">
                                <Link to="/calendar" className="admin-card primary">
                                    <span className="admin-icon">📆</span>
                                    <h4>Calendario</h4>
                                    <p>Vista semanal y mensual de citas</p>
                                </Link>

                                <Link to="/admin/disponibilidad" className="admin-card primary">
                                    <span className="admin-icon">⏰</span>
                                    <h4>Disponibilidad</h4>
                                    <p>Gestionar horarios disponibles</p>
                                </Link>

                                <Link to="/admin/citas" className="admin-card">
                                    <span className="admin-icon">📋</span>
                                    <h4>Gestionar Citas</h4>
                                    <p>Ver y administrar todas las citas</p>
                                </Link>

                                <Link to="/admin/users" className="admin-card">
                                    <span className="admin-icon">👥</span>
                                    <h4>Pacientes</h4>
                                    <p>Lista de pacientes registrados</p>
                                </Link>
                            </div>
                        </section>
                    </>
                )}

                {/* Usuario regular - Muestra servicios y calendario */}
                {!isAdmin && (
                    <>
                        {/* Therapist Info Section */}
                <section className="professional-section">
                    <div className="professional-card">
                        <div className="professional-image">
                            <img src="/psicologaejemplo.jpg" alt="Psicóloga Profesional" />
                        </div>
                        <div className="professional-info">
                            <h3 className="professional-name">Dra. María Fernández</h3>
                            <p className="professional-title">Psicóloga Clínica y Neuropsicóloga</p>
                            
                            <div className="professional-specialties">
                                <div className="specialty-tags">
                                    <span className="specialty-tag">Ansiedad</span>
                                    <span className="specialty-tag">Estrés</span>
                                    <span className="specialty-tag">Autoestima</span>
                                    <span className="specialty-tag">Depresión</span>
                                </div>
                            </div>

                            <p className="professional-bio">
                                Hola, soy María. Durante más de 10 años he acompañado a personas en sus procesos 
                                de cambio y crecimiento personal. Mi enfoque combina la psicología clínica con 
                                la neuropsicología para ofrecer un tratamiento integral y personalizado.
                            </p>
                            
                            <Link to="/about" className="btn-learn-more">
                                Conoce más sobre Neuro Espacio
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section className="services-section">
                    <h3 className="section-title">¿Cómo puedo ayudarte?</h3>
                    
                    <div className="services-grid">
                        <div className="service-card">
                            <div className="service-icon">😟</div>
                            <h4>Ansiedad y Estrés</h4>
                            <p>Técnicas efectivas para recuperar tu tranquilidad y bienestar.</p>
                        </div>

                        <div className="service-card">
                            <div className="service-icon">💪</div>
                            <h4>Autoestima</h4>
                            <p>Fortalece tu confianza y alcanza tu máximo potencial.</p>
                        </div>

                        <div className="service-card">
                            <div className="service-icon">💔</div>
                            <h4>Estado de Ánimo</h4>
                            <p>Recupera tu energía y disfruta de nuevo de la vida.</p>
                        </div>

                        <div className="service-card">
                            <div className="service-icon">🧠</div>
                            <h4>Neuropsicología</h4>
                            <p>Evaluación y rehabilitación de funciones cognitivas.</p>
                        </div>
                    </div>

                        <div className="services-modality">
                            <p>💻 Online • 🏥 Presencial • 50-60 minutos</p>
                        </div>
                    </section>

                    {/* Calendar Section - Only for non-admin users */}
                    <section className="home-calendar-section">
                        <h3 className="calendar-title">Consulta Disponibilidad</h3>
                        <p className="calendar-subtitle">
                            {isLoggedIn 
                                ? "Selecciona un día disponible para reservar tu cita" 
                                : "Días disponibles en verde. Regístrate para reservar tu cita"}
                        </p>
                        <Calendar />
                    </section>
                </>
                )}
            </div>
        </div>
    )
}

export default HomePage;