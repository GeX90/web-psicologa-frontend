import "./HomePage.css";
import Calendar from "../components/Calendar";
import { Link } from "react-router-dom";

function HomePage() {
    
    return (
        <div className="HomePage">
            <div className="home-content">
                <div className="home-hero">
                    <h1>NEURO ESPACIO</h1>
                    <h2 className="home-main-message">Psicología para Ansiedad, Estrés y Autoestima</h2>
                    <p className="home-subtitle">Acompañamiento profesional y cercano</p>
                    
                    <div className="home-cta-buttons">
                        <Link to="/signup" className="btn-cta primary">
                            Pide tu Cita
                        </Link>
                        <Link to="/about" className="btn-cta secondary">
                            Conoce más
                        </Link>
                    </div>
                </div>

                <div className="professional-section">
                    <div className="professional-card">
                        <div className="professional-image">
                            <img src="/psicologaejemplo.jpg" alt="Psicóloga Profesional" />
                        </div>
                        <div className="professional-info">
                            <h3 className="professional-name">Dra. María Fernández</h3>
                            <p className="professional-title">Psicóloga Clínica y Neuropsicóloga</p>
                            
                            <div className="professional-credentials">
                                <div className="credential-item">
                                    <span className="credential-icon">🎓</span>
                                    <span>Licenciada en Psicología (UAM)</span>
                                </div>
                                <div className="credential-item">
                                    <span className="credential-icon">🧠</span>
                                    <span>Máster en Neuropsicología Clínica</span>
                                </div>
                                <div className="credential-item">
                                    <span className="credential-icon">📋</span>
                                    <span>Colegiada Nº M-12345</span>
                                </div>
                            </div>

                            <div className="professional-specialties">
                                <h4>Especialidades</h4>
                                <div className="specialty-tags">
                                    <span className="specialty-tag">Ansiedad</span>
                                    <span className="specialty-tag">Estrés</span>
                                    <span className="specialty-tag">Autoestima</span>
                                    <span className="specialty-tag">Depresión</span>
                                    <span className="specialty-tag">Terapia de Pareja</span>
                                    <span className="specialty-tag">Neuropsicología</span>
                                </div>
                            </div>

                            <p className="professional-bio">
                                Hola, soy María. Durante más de 10 años he acompañado a personas en sus procesos 
                                de cambio y crecimiento personal. Mi enfoque combina la psicología clínica con 
                                la neuropsicología para ofrecer un tratamiento integral y personalizado. 
                                Creo firmemente que cada persona tiene dentro de sí los recursos necesarios para 
                                superar sus dificultades, y mi papel es ayudarte a descubrirlos y potenciarlos. 
                                Trabajaremos juntos en un ambiente de confianza, respeto y calidez.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Servicios Principales */}
                <div className="services-section">
                    <h3 className="section-title">¿Cómo puedo ayudarte?</h3>
                    <p className="section-subtitle">Terapias especializadas adaptadas a tus necesidades</p>
                    
                    <div className="services-grid">
                        <div className="service-card">
                            <div className="service-icon">😟</div>
                            <h4>Ansiedad y Estrés</h4>
                            <p>Tratamiento especializado para manejar la ansiedad, ataques de pánico, estrés laboral y preocupaciones excesivas. Aprende técnicas efectivas para recuperar tu tranquilidad.</p>
                        </div>

                        <div className="service-card">
                            <div className="service-icon">💔</div>
                            <h4>Depresión y Estado de Ánimo</h4>
                            <p>Acompañamiento en momentos de tristeza profunda, pérdida de interés y desmotivación. Recupera tu energía y disfruta de nuevo de la vida.</p>
                        </div>

                        <div className="service-card">
                            <div className="service-icon">💪</div>
                            <h4>Autoestima y Crecimiento Personal</h4>
                            <p>Fortalece tu confianza, desarrolla una imagen positiva de ti mismo/a y alcanza tu máximo potencial. Construye la versión de ti que deseas ser.</p>
                        </div>

                        <div className="service-card">
                            <div className="service-icon">💑</div>
                            <h4>Terapia de Pareja</h4>
                            <p>Mejora la comunicación, resuelve conflictos y fortalece tu relación. Un espacio seguro para reconectar con tu pareja y construir juntos.</p>
                        </div>

                        <div className="service-card">
                            <div className="service-icon">🧠</div>
                            <h4>Neuropsicología</h4>
                            <p>Evaluación y rehabilitación de funciones cognitivas (memoria, atención, lenguaje). Especializado en daño cerebral, demencias y trastornos del desarrollo.</p>
                        </div>

                        <div className="service-card">
                            <div className="service-icon">🌱</div>
                            <h4>Duelo y Adaptación</h4>
                            <p>Apoyo en procesos de pérdida, cambios vitales importantes y adaptación a nuevas situaciones. Atraviesa el dolor con acompañamiento profesional.</p>
                        </div>
                    </div>

                    <div className="services-modality">
                        <p><strong>Modalidad:</strong> Sesiones presenciales en consulta y online (videollamada) | Duración: 50-60 minutos</p>
                    </div>
                </div>

                {/* A Quién Va Dirigida */}
                <div className="target-audience-section">
                    <h3 className="section-title">¿Es para ti esta terapia?</h3>
                    <p className="section-subtitle">Trabajamos con personas en diferentes etapas y situaciones de vida</p>
                    
                    <div className="audience-grid">
                        <div className="audience-card">
                            <div className="audience-icon">👤</div>
                            <h4>Adultos</h4>
                            <ul>
                                <li>Estrés laboral y burnout</li>
                                <li>Crisis vitales y cambios</li>
                                <li>Problemas de relación</li>
                                <li>Ansiedad y depresión</li>
                            </ul>
                        </div>

                        <div className="audience-card">
                            <div className="audience-icon">👥</div>
                            <h4>Parejas</h4>
                            <ul>
                                <li>Problemas de comunicación</li>
                                <li>Infidelidades y crisis</li>
                                <li>Decisiones importantes</li>
                                <li>Fortalecer la relación</li>
                            </ul>
                        </div>

                        <div className="audience-card">
                            <div className="audience-icon">🧑‍🦳</div>
                            <h4>Adultos Mayores</h4>
                            <ul>
                                <li>Problemas de memoria</li>
                                <li>Evaluación neuropsicológica</li>
                                <li>Adaptación al envejecimiento</li>
                                <li>Estimulación cognitiva</li>
                            </ul>
                        </div>

                        <div className="audience-card">
                            <div className="audience-icon">👨‍👩‍👧</div>
                            <h4>Familias</h4>
                            <ul>
                                <li>Conflictos familiares</li>
                                <li>Apoyo en duelos</li>
                                <li>Problemas de convivencia</li>
                                <li>Adaptación a cambios</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Testimonios */}
                <div className="testimonials-section">
                    <h3 className="section-title">Lo que dicen quienes han confiado en mí</h3>
                    
                    <div className="testimonials-grid">
                        <div className="testimonial-card">
                            <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
                            <p className="testimonial-text">
                                "Después de meses luchando con la ansiedad, finalmente encontré el apoyo que necesitaba. 
                                María me ayudó a entender mis emociones y a desarrollar herramientas prácticas. 
                                Ahora me siento mucho más tranquila y capaz de enfrentar el día a día."
                            </p>
                            <p className="testimonial-author">- Laura M., 34 años</p>
                        </div>

                        <div className="testimonial-card">
                            <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
                            <p className="testimonial-text">
                                "La terapia de pareja salvó nuestra relación. Aprendimos a comunicarnos de verdad 
                                y a entender las necesidades del otro. El ambiente profesional y cercano nos hizo 
                                sentir cómodos desde el primer día."
                            </p>
                            <p className="testimonial-author">- Carlos y Ana, terapia de pareja</p>
                        </div>

                        <div className="testimonial-card">
                            <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
                            <p className="testimonial-text">
                                "Mi madre comenzó a tener problemas de memoria y no sabíamos qué hacer. 
                                La evaluación neuropsicológica nos dio claridad y un plan de acción. 
                                Estamos muy agradecidos por el trato tan humano y profesional."
                            </p>
                            <p className="testimonial-author">- Roberto P., familiar de paciente</p>
                        </div>
                    </div>
                </div>

                <div className="home-calendar-section">
                    <h3 className="calendar-title">Consulta Disponibilidad</h3>
                    <Calendar />
                </div>
            </div>
        </div>
    )
}

export default HomePage;