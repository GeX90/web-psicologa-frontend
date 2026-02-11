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
                        <h1 className="neuro-espacio-title">BEATRIZ DE MERGELINA</h1>
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
                            <img src="/Beaprofileweb.png" alt="Psicóloga Profesional" />
                        </div>
                        <div className="professional-info">
                            <h3 className="professional-name">Beatriz de Mergelina</h3>
                            <p className="professional-title">Psicóloga Clínica y Neuropsicóloga</p>
                            
                            <div className="professional-specialties">
                                <div className="specialty-tags">
                                    <span className="specialty-tag">Daño Cerebral</span>
                                    <span className="specialty-tag">Neurodegenerativas</span>
                                    <span className="specialty-tag">Gestión Emocional</span>
                                    <span className="specialty-tag">Ansiedad</span>
                                    <span className="specialty-tag">Depresión</span>
                                    <span className="specialty-tag">Acompañamiento Familiar</span>
                                </div>
                            </div>

                            <p className="professional-bio">
                                Hola! Soy Beatriz de Mergelina, psicóloga y neuropsicóloga clínica. Mi trayectoria profesional se ha desarrollado en el ámbito del daño cerebral adquirido, las enfermedades neurodegenerativas y el acompañamiento familiar. En los últimos años he profundizado especialmente en gestión emocional, ansiedad, depresión y tolerancia a la frustración. Mi propósito en terapia es ofrecer un entorno acogedor, sereno y sin valoraciones, donde puedas entender con mayor profundidad lo que te sucede y descubrir recursos que te permitan seguir adelante con más lucidez y equilibrio.
                            </p>
                            
                            <Link to="/about" className="btn-learn-more">
                                Conoce más sobre Beatriz de Mergelina
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section className="services-section">
                    <h3 className="section-title">¿Cómo puedo ayudarte?</h3>
                    
                    <div className="services-grid">
                        <div className="service-card">
                            <div className="service-icon">🧠</div>
                            <h4>Daño Cerebral y Neurodegenerativas</h4>
                            <p>Evaluación, rehabilitación y acompañamiento en daño cerebral y enfermedades neurodegenerativas.</p>
                        </div>

                        <div className="service-card">
                            <div className="service-icon">💙</div>
                            <h4>Gestión Emocional</h4>
                            <p>Explorar y comprender tus emociones para avanzar con mayor equilibrio.</p>
                        </div>

                        <div className="service-card">
                            <div className="service-icon">😟</div>
                            <h4>Ansiedad y Depresión</h4>
                            <p>Acompañamiento cercano para recuperar tu tranquilidad y bienestar emocional.</p>
                        </div>

                        <div className="service-card">
                            <div className="service-icon">👨‍👩‍👧‍👦</div>
                            <h4>Acompañamiento Familiar</h4>
                            <p>Apoyo a familias en procesos complejos, parte fundamental de la terapia.</p>
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