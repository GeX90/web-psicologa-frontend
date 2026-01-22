# 🧠 Neuro Espacio - Frontend

Aplicación web para gestión de citas de psicología especializada en ansiedad, estrés y autoestima. Este proyecto proporciona una plataforma intuitiva para que los usuarios puedan reservar citas con profesionales de la salud mental.

## 🌐 Demo en Vivo

**[Ver Demo](https://neuro-espacio.vercel.app/)**

## 📋 Descripción

Neuro Espacio es una plataforma moderna y profesional que conecta a pacientes con servicios de psicología. La aplicación cuenta con dos tipos de usuarios con diferentes niveles de acceso:

### 👤 Usuarios / Pacientes
- Registrarse y acceder con autenticación segura
- Consultar disponibilidad mediante calendario interactivo
- Reservar citas seleccionando fecha y hora
- Ver listado de sus citas programadas
- Editar y cancelar citas (con 48h de anticipación)
- Acceder a información sobre los profesionales

### 👨‍💼 Administradores
- Panel administrativo completo
- Gestionar todos los usuarios registrados
- Ver y administrar todas las citas del sistema
- Editar y cancelar cualquier cita sin restricciones
- Vista de calendario con ocupación completa
- Estadísticas de citas (total, confirmadas, pendientes)

## ✨ Características

- **Autenticación de Usuarios**: Sistema completo de registro e inicio de sesión
- **Gestión de Citas**: Los usuarios pueden crear, editar y ver sus citas
- **Panel de Administración**: Área administrativa para gestionar usuarios y todas las citas
- **Rutas Protegidas**: Sistema de autorización con rutas privadas y públicas
- **Diseño Responsivo**: Interfaz adaptable a todos los dispositivos
- **Calendario Interactivo**: Visualización de disponibilidad y citas
- **Información Profesional**: Sección "Sobre Nosotros" con detalles del servicio

## 🛠️ Tecnologías

- **React 19** - Biblioteca de interfaz de usuario
- **React Router DOM 7** - Enrutamiento de la aplicación
- **Axios** - Cliente HTTP para consumir APIs
- **Vite** - Herramienta de construcción y desarrollo
- **CSS Modules** - Estilos modulares para componentes

## 📁 Estructura del Proyecto

```
neuro-espacio-project-frontend/
├── src/
│   ├── components/
│   │   ├── Calendar.jsx         # Componente de calendario
│   │   ├── Footer.jsx           # Pie de página
│   │   ├── Navbar.jsx           # Barra de navegación
│   │   ├── Loader.jsx           # Indicador de carga
│   │   ├── IsPrivate.jsx        # HOC para rutas privadas
│   │   └── IsAnon.jsx           # HOC para rutas públicas
│   ├── pages/
│   │   ├── HomePage.jsx         # Página de inicio
│   │   ├── SignupPage.jsx       # Registro de usuarios
│   │   ├── LoginPage.jsx        # Inicio de sesión
│   │   ├── CitasPage.jsx        # Listado de citas del usuario
│   │   ├── CitaDetailsPage.jsx  # Detalles de una cita
│   │   ├── CreateCitasPage.jsx  # Crear nueva cita
│   │   ├── EditCitasPage.jsx    # Editar cita existente
│   │   ├── AboutUsPage.jsx      # Información sobre el servicio
│   │   ├── AdminUsersPage.jsx   # Admin: gestión de usuarios
│   │   └── AdminCitasPage.jsx   # Admin: gestión de citas
│   ├── context/
│   │   └── auth.context.jsx     # Contexto de autenticación
│   ├── App.jsx                  # Componente principal
│   └── main.jsx                 # Punto de entrada
├── public/                      # Archivos estáticos
├── index.html
├── package.json
├── vite.config.js
└── vercel.json                  # Configuración de Vercel
```

## 🚀 Instalación y Uso

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn

### Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd neuro-espacio-project-frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
Crea un archivo `.env` en la raíz del proyecto y añade la URL de tu backend:
```env
VITE_API_URL=<url-de-tu-backend>
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

5. Abre tu navegador en `http://localhost:5173`

## 📦 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la construcción de producción
- `npm run lint` - Ejecuta el linter

## 🔐 Rutas de la Aplicación

### 🌐 Rutas Públicas (acceso sin autenticación)
- `/` - Página de inicio con información del servicio
- `/about` - Sobre nosotros - información de la profesional
- `/signup` - Registro de nuevo usuario
- `/login` - Inicio de sesión

### 🔒 Rutas Privadas - Usuarios (requieren autenticación)
- `/citas` - Listado de citas propias
- `/citas/:id` - Detalles completos de una cita
- `/citas/create` - Formulario para crear nueva cita
- `/citas/edit/:id` - Gestionar mis citas (editar/cancelar)

### 🔐 Rutas de Administrador (requieren rol ADMIN)
- `/admin/users` - Gestión de usuarios (lista completa con roles)
- `/admin/citas` - Gestión de todas las citas (editar/eliminar sin restricciones)
- `/calendar` - Vista de calendario con todas las citas del sistema

## ✨ Funcionalidades Detalladas

### 👤 Funcionalidades de Usuario

**Gestión de Citas:**
- ✅ Ver calendario con días disponibles marcados en verde
- ✅ Crear citas seleccionando fecha y hora (sesiones de 1 hora)
- ✅ Horarios disponibles: 09:00-14:00 y 16:00-21:00
- ✅ Ver lista de citas propias con filtros
- ✅ Acceder a detalles de cada cita (fecha, hora, motivo)
- ✅ Editar citas con 48 horas de anticipación mínima
- ✅ Cancelar citas con 48 horas de anticipación mínima
- ✅ Navegación intuitiva con botones de editar/eliminar

**Navegación:**
- Navbar con acceso a: Mis Citas, Nueva Cita, Sobre Nosotros
- Perfil con nombre de usuario y opción de cerrar sesión

### 👨‍💼 Funcionalidades de Administrador

**Panel Administrativo:**
- ✅ Acceso directo desde home a gestión de citas, usuarios y calendario
- ✅ Vista de todas las citas del sistema organizadas
- ✅ Editar cualquier cita sin restricción de tiempo
- ✅ Eliminar cualquier cita en cualquier momento
- ✅ Ver información del usuario asociado a cada cita

**Gestión de Usuarios:**
- ✅ Tabla completa con todos los usuarios registrados
- ✅ Visualización de nombre, email y rol de cada usuario
- ✅ Badges distintivos para diferenciar ADMIN de USER
- ✅ Contador total de usuarios

**Calendario Administrativo:**
- ✅ Vista mensual completa en página dedicada
- ✅ Días con citas marcados en azul
- ✅ Contador de citas por día
- ✅ Navegación entre meses
- ✅ Estadísticas: total de citas, confirmadas y pendientes
- ✅ Leyenda visual para identificar estados

**Navegación:**
- Navbar con acceso a: Gestionar Citas, Pacientes, Calendario, Sobre Nosotros
- Perfil con nombre de usuario y opción de cerrar sesión

## 🎨 Características de Diseño

- Diseño moderno y profesional
- Paleta de colores enfocada en bienestar y confianza
- Navegación intuitiva
- Feedback visual para acciones del usuario
- Componente de carga para mejorar la experiencia de usuario

## 🌐 Despliegue

La aplicación está desplegada en Vercel y se actualiza automáticamente con cada push a la rama principal.

**URL de producción**: https://neuro-espacio.vercel.app/

## 👨‍💻 Desarrollador

**Jorge Jiménez Morgado**
- GitHub: [GeX90](https://github.com/GeX90)

## 📄 Licencia

Este proyecto es privado y fue desarrollado como proyecto educativo.

## 🤝 Contribuciones

Este es un proyecto educativo. Para sugerencias o mejoras, por favor contacta al desarrollador.

---

⭐ Si te gusta este proyecto, dale una estrella en GitHub!
