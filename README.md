<div align="center">

# 🌐 DevCuenca Solutions

### Portafolio Digital para Desarrolladores

[![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![pnpm](https://img.shields.io/badge/pnpm-11-F69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io)

---

[![Universidad Politécnica Salesiana](https://img.shields.io/badge/UPS-Universidad_Politécnica_Salesiana-003087?style=flat-square)](https://www.ups.edu.ec)
![Materia](https://img.shields.io/badge/Materia-Programación_y_Plataformas_Web-4CAF50?style=flat-square)
![Período](https://img.shields.io/badge/Período-Marzo--Agosto_2026-FF9800?style=flat-square)
![Docente](https://img.shields.io/badge/Docente-Ing._Pablo_Torres-9C27B0?style=flat-square)

</div>

---

## 📋 Descripción

**DevCuenca Solutions** es una plataforma de portafolio digital diseñada para que desarrolladores de software exhiban sus proyectos y habilidades, mientras que usuarios externos pueden explorar su trabajo y enviar solicitudes de contacto o colaboración.

### 🎯 Objetivo Académico

Proyecto desarrollado como trabajo final de la materia **Programación y Plataformas Web** en la **Universidad Politécnica Salesiana** (período Marzo–Agosto 2026). El proyecto aplica conceptos modernos de desarrollo web: frameworks SPA, autenticación basada en la nube, bases de datos NoSQL en tiempo real y diseño responsive.

### 🏗️ Arquitectura General

La plataforma combina un frontend **Angular 21** con servicios de backend gestionados enteramente por **Firebase** (Authentication + Firestore), con integración futura a **Strapi CMS** para la gestión de contenido de los portafolios.

---

## ✨ Características

| Estado | Funcionalidad |
|--------|--------------|
| ✅ | Portafolio multiusuario (un perfil por programador) |
| ✅ | Autenticación con Firebase Authentication |
| ✅ | Gestión de solicitudes en Cloud Firestore |
| ✅ | Dashboard privado para programadores |
| ✅ | Dashboard para usuarios externos registrados |
| ✅ | Diseño responsive con TailwindCSS + DaisyUI |
| 🔄 | Integración con Strapi CMS *(en desarrollo)* |
| 🔄 | Deploy en Firebase Hosting *(en desarrollo)* |

---

## 🛠️ Tecnologías

| Tecnología | Versión | Uso |
|------------|---------|-----|
| [Angular](https://angular.dev) | 21.2 | Framework principal del frontend (SPA) |
| [TypeScript](https://www.typescriptlang.org) | 5.9 | Lenguaje de programación tipado |
| [TailwindCSS](https://tailwindcss.com) | 3.4 | Framework de estilos utilitarios |
| [DaisyUI](https://daisyui.com) | 3.9 | Biblioteca de componentes sobre Tailwind |
| [Firebase Authentication](https://firebase.google.com/products/auth) | 10+ | Autenticación de usuarios |
| [Cloud Firestore](https://firebase.google.com/products/firestore) | 10+ | Base de datos NoSQL en tiempo real |
| [Strapi](https://strapi.io) | 5+ | CMS headless *(próximamente)* |
| [Firebase Hosting](https://firebase.google.com/products/hosting) | — | Despliegue del frontend *(próximamente)* |
| [pnpm](https://pnpm.io) | 11 | Gestor de paquetes eficiente |
| [RxJS](https://rxjs.dev) | 7.8 | Programación reactiva y manejo de observables |

---

## 🏛️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE (Browser)                    │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   Angular 21 (SPA)                   │  │
│  │                                                      │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │  │
│  │  │  Auth Guard │  │  Componentes │  │  Servicios │  │  │
│  │  │  & Routing  │  │  & Vistas    │  │  Firebase  │  │  │
│  │  └──────┬──────┘  └──────┬───────┘  └─────┬──────┘  │  │
│  └─────────┼────────────────┼────────────────┼──────────┘  │
└────────────┼────────────────┼────────────────┼─────────────┘
             │                │                │
             ▼                ▼                ▼
┌────────────────────────────────────────────────────────────┐
│                    Google Firebase                         │
│                                                            │
│  ┌─────────────────┐         ┌──────────────────────────┐ │
│  │   Firebase Auth │         │     Cloud Firestore      │ │
│  │                 │         │                          │ │
│  │  • Email/Pass   │         │  /programadores/{uid}    │ │
│  │  • Google OAuth │         │  /usuarios/{uid}         │ │
│  │  • JWT Tokens   │         │  /solicitudes/{id}       │ │
│  └─────────────────┘         └──────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
             │
             ▼
┌───────────────────────────┐
│      Strapi CMS           │  ← Próximamente
│  (Gestión de contenido    │
│   de portafolios)         │
└───────────────────────────┘
```

---

## 📦 Requisitos Previos

Asegúrate de tener instaladas las siguientes herramientas antes de comenzar:

- **[Node.js](https://nodejs.org)** `>= 24.0.0`
- **[pnpm](https://pnpm.io/installation)** `>= 10.0.0`
- **[Angular CLI](https://angular.dev/tools/cli)** `>= 21.0.0`
- **Cuenta de [Firebase](https://console.firebase.google.com)** con un proyecto activo

Verificar versiones instaladas:

```bash
node --version    # v24.x.x
pnpm --version    # 11.x.x
ng version        # Angular CLI: 21.x.x
```

---

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/macobosf/DevCuenca-Solutions.git
cd DevCuenca-Solutions
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno de Firebase

Copia el archivo de ejemplo y completa con tus credenciales de Firebase:

```bash
cp src/environments/environment.example.ts src/environments/environment.ts
cp src/environments/environment.example.ts src/environments/environment.development.ts
```

Edita `src/environments/environment.ts` con los valores de tu proyecto Firebase (ver sección [Variables de Entorno](#-variables-de-entorno)).

### 4. Crear colecciones en Firestore

En la consola de Firebase, crea las siguientes colecciones con su estructura inicial:

- `programadores` — perfiles de desarrolladores registrados
- `usuarios` — usuarios externos registrados
- `solicitudes` — solicitudes de contacto/colaboración

### 5. Ejecutar en modo desarrollo

```bash
pnpm start
```

La aplicación estará disponible en `http://localhost:4200`.

---

## 🔑 Variables de Entorno

Crea el archivo `src/environments/environment.ts` con la siguiente estructura. **Nunca subas este archivo al repositorio** (ya está en `.gitignore`).

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: 'TU_API_KEY',
    authDomain: 'TU_PROJECT_ID.firebaseapp.com',
    projectId: 'TU_PROJECT_ID',
    storageBucket: 'TU_PROJECT_ID.appspot.com',
    messagingSenderId: 'TU_MESSAGING_SENDER_ID',
    appId: 'TU_APP_ID',
    measurementId: 'TU_MEASUREMENT_ID',
  },
};
```

> 💡 Encuentra estas credenciales en: **Firebase Console → Tu Proyecto → Configuración del proyecto → Tus apps → SDK de Firebase**

---

## 🔥 Configuración de Firebase

### Paso 1 — Crear proyecto en Firebase Console

1. Ve a [console.firebase.google.com](https://console.firebase.google.com)
2. Haz clic en **"Agregar proyecto"**
3. Asigna el nombre `devcuenca-solutions` y sigue los pasos

### Paso 2 — Habilitar Authentication

1. En el panel lateral: **Authentication → Comenzar**
2. Habilita el proveedor **"Correo electrónico/contraseña"**
3. (Opcional) Habilita **"Google"** como proveedor adicional

### Paso 3 — Crear base de datos Firestore

1. En el panel lateral: **Firestore Database → Crear base de datos**
2. Selecciona **"Comenzar en modo de producción"**
3. Elige la región más cercana (ej. `us-central1`)

### Paso 4 — Crear colecciones iniciales

En Firestore, crea los siguientes documentos de ejemplo para inicializar las colecciones:

**Colección `programadores`:**
```json
{
  "uid": "uid_de_firebase_auth",
  "nombre": "Marco Cobos",
  "email": "marco@example.com",
  "especialidad": "Full Stack Developer",
  "github": "macobosf",
  "portafolio": [],
  "creadoEn": "timestamp"
}
```

**Colección `solicitudes`:**
```json
{
  "programadorId": "uid_del_programador",
  "usuarioId": "uid_del_usuario",
  "mensaje": "Me interesa tu trabajo...",
  "estado": "pendiente",
  "creadoEn": "timestamp"
}
```

### Paso 5 — Reglas de seguridad de Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Programadores: solo el propio usuario puede escribir su perfil
    match /programadores/{uid} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == uid;
    }

    // Usuarios: solo el propio usuario puede escribir su perfil
    match /usuarios/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }

    // Solicitudes: usuarios autenticados pueden crear; el programador puede leer las suyas
    match /solicitudes/{solicitudId} {
      allow create: if request.auth != null;
      allow read, update: if request.auth != null &&
        (request.auth.uid == resource.data.programadorId ||
         request.auth.uid == resource.data.usuarioId);
    }
  }
}
```

---

## 📁 Estructura del Proyecto

```
DevCuenca-Solutions/
├── public/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── core/                    # Servicios singleton (auth, firestore)
│   │   ├── features/
│   │   │   ├── auth/                # Login, registro, guards
│   │   │   ├── dashboard-dev/       # Dashboard del programador
│   │   │   ├── dashboard-user/      # Dashboard del usuario externo
│   │   │   └── public/              # Páginas públicas (landing, portafolios)
│   │   ├── shared/                  # Componentes y pipes reutilizables
│   │   ├── app.config.ts            # Configuración de la app (providers)
│   │   ├── app.routes.ts            # Definición de rutas
│   │   ├── app.ts                   # Componente raíz
│   │   └── app.html                 # Template raíz
│   ├── environments/
│   │   ├── environment.ts           # Variables de producción (gitignored)
│   │   └── environment.development.ts
│   ├── index.html                   # HTML de entrada
│   ├── main.ts                      # Bootstrap de Angular
│   └── styles.css                   # Estilos globales + Tailwind directives
├── angular.json                     # Configuración del workspace Angular
├── tailwind.config.js               # Configuración de TailwindCSS + DaisyUI
├── postcss.config.js                # Configuración de PostCSS
├── tsconfig.json                    # Configuración base de TypeScript
├── package.json                     # Dependencias del proyecto
├── pnpm-lock.yaml                   # Lockfile de pnpm
└── README.md
```

---

## 👥 Roles y Permisos

| Rol | Acceso | Funcionalidades |
|-----|--------|-----------------|
| **Visitante Público** | Sin cuenta | Ver portafolios de programadores, explorar proyectos |
| **Usuario Externo** | Cuenta Firebase | Enviar solicitudes de contacto, ver historial de solicitudes, gestionar perfil |
| **Programador** | Cuenta Firebase + rol asignado | Gestionar portafolio personal, ver y responder solicitudes recibidas, administrar proyectos |

---

## 📖 Guía de Uso

### Como Visitante Público

1. Accede a la página principal de DevCuenca Solutions
2. Explora el listado de programadores disponibles
3. Visualiza el portafolio y proyectos de cada desarrollador
4. Regístrate para poder enviar solicitudes de contacto

### Como Usuario Externo Registrado

1. Crea una cuenta con tu email o inicia sesión con Google
2. Navega por los perfiles de los programadores
3. Envía solicitudes de contacto o colaboración
4. Gestiona y haz seguimiento de tus solicitudes desde tu dashboard

### Como Programador

1. Regístrate y solicita el rol de programador al administrador
2. Accede a tu dashboard privado
3. Gestiona tu perfil: foto, bio, habilidades y links
4. Publica y actualiza tus proyectos en tu portafolio
5. Revisa y responde las solicitudes entrantes de usuarios

---

## 🤝 Contribuidores

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/macobosf">
        <img src="https://github.com/macobosf.png" width="80px" alt="Marco Cobos"/><br/>
        <sub><b>Marco Antonio Cobos Farfán</b></sub>
      </a>
      <br/>
      <a href="https://github.com/macobosf">@macobosf</a>
    </td>
    <td align="center">
      <a href="https://github.com/christianastudillo">
        <img src="https://github.com/christianastudillo.png" width="80px" alt="Christian Astudillo"/><br/>
        <sub><b>Christian Ismael Astudillo Vásquez</b></sub>
      </a>
      <br/>
      <a href="https://github.com/christianastudillo">@christianastudillo</a>
    </td>
  </tr>
</table>

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](LICENSE) para más detalles.

```
MIT License — Copyright (c) 2026 DevCuenca Solutions
```

---

<div align="center">

Desarrollado con ❤️ en **Cuenca, Ecuador** · Universidad Politécnica Salesiana · 2026

</div>
