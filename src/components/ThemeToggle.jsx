import { useTheme } from "../hooks/useTheme";
import "./ThemeToggle.css";

/**
 * Componente ThemeToggle - Botón para alternar entre modo claro y oscuro
 * Accesible, responsivo y con animaciones suaves
 */
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const handleClick = (e) => {
    toggleTheme();
    e.currentTarget.blur(); // Remove focus after click
  };

  return (
    <button
      onClick={handleClick}
      className="theme-toggle-button"
      aria-label={theme === "light" ? "Activar modo oscuro" : "Activar modo claro"}
      title={theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
      type="button"
    >
      <div className="theme-toggle-icon-wrapper">
        {theme === "light" ? (
          // Icono de Luna para modo oscuro
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="theme-icon moon-icon"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        ) : (
          // Icono de Sol para modo claro
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="theme-icon sun-icon"
          >
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        )}
      </div>
      <span className="theme-toggle-text">
        {theme === "light" ? "Modo Oscuro" : "Modo Claro"}
      </span>
    </button>
  );
}

export default ThemeToggle;
