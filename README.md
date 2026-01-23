# 🧠 Neuro Espacio - Frontend

Aplicación web para gestión de citas neuropsicológicas con autenticación y panel administrativo.

🌐 **Demo**: [https://neuro-espacio.vercel.app/](https://neuro-espacio.vercel.app/)

## ✨ Características

- Sistema de autenticación con roles (USER/ADMIN)
- Gestión de citas con calendario interactivo
- Panel administrativo para usuarios y citas
- Diseño responsivo y rutas protegidas

## 🛠️ Tecnologías

- **React 19** - UI Library
- **React Router DOM 7** - Enrutamiento
- **Axios** - Cliente HTTP
- **Vite** - Build tool

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
```

## 🔐 Rutas

**Públicas**: `/`, `/about`, `/signup`, `/login`

**Usuarios** 🔒: `/citas`, `/citas/:id`, `/citas/create`, `/citas/edit/:id`

**Admin** 🔐: `/admin/users`, `/admin/citas`, `/calendar`

## 👨‍💻 Desarrollador

**Jorge Jiménez Morgado** - [GeX90](https://github.com/GeX90)
