# 🧠 Neuro Espacio - Frontend

Aplicación web para gestión de citas neuropsicológicas con autenticación, sistema de roles y panel administrativo completo.

🌐 **Demo**: [https://neuro-espacio.vercel.app/](https://neuro-espacio.vercel.app/)

## ✨ Características

- **Autenticación y autorización** - Sistema de roles (USER/ADMIN)
- **Gestión de citas** - Crear, editar, cancelar con validación de 48h
- **Calendario interactivo** - Visualización de disponibilidad y citas
- **Panel administrativo** - Gestión de usuarios, citas y disponibilidad
- **Dashboard con estadísticas** - Métricas de citas y pacientes
- **Diseño responsivo** - Rutas protegidas y navegación intuitiva

## 🛠️ Tecnologías

- **React 19** - UI Library
- **React Router DOM 7** - Enrutamiento con protección de rutas
- **Axios** - Cliente HTTP con interceptores
- **Vite** - Build tool y dev server
- **Context API** - Gestión de estado global

## 🚀 Instalación

```bash
npm install
```

Crea archivo `.env`:
```env
VITE_API_URL=<url-de-tu-backend>
```

Inicia desarrollo:
```bash
npm run dev  # http://localhost:5173
npm run build  # Producción
```

## 🔐 Rutas

**Públicas**: `/`, `/about`, `/signup`, `/login`

**Usuarios** 🔒: 
- `/citas` - Lista de citas personales
- `/citas/:id` - Detalle de cita
- `/citas/create` - Nueva cita
- `/citas/edit/:id` - Editar cita

**Admin** 🔐: 
- `/admin/users` - Gestión de usuarios
- `/admin/citas` - Gestión de todas las citas
- `/admin/disponibilidad` - Configurar horarios
- `/calendar` - Calendario completo del sistema

## 👨‍💻 Desarrollador

**Jorge Jiménez Morgado** - [GeX90](https://github.com/GeX90)
