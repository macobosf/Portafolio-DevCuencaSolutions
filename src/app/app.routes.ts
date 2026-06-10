/**
 * @description Definición de todas las rutas de la aplicación.
 *
 * Todas las rutas usan lazy loading (loadComponent) para dividir el bundle en
 * chunks por página, reduciendo el tiempo de carga inicial (Time to Interactive).
 * Angular solo descargará el código de una página cuando el usuario navegue a ella.
 */
import { Routes } from '@angular/router';
import { authGuard, noAuthGuard, programmerGuard } from './core/auth.guard';

export const routes: Routes = [
  // ─── Rutas públicas (sin guard) ───────────────────────────────────────────
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    // :slug permite identificar al programador por nombre-url en lugar de ID numérico
    path: 'programador/:slug',
    loadComponent: () =>
      import('./pages/programmer-profile/programmer-profile.component').then(
        (m) => m.ProgrammerProfileComponent,
      ),
  },
  {
    path: 'proyectos',
    loadComponent: () =>
      import('./pages/projects/projects.component').then(
        (m) => m.ProjectsComponent,
      ),
  },
  {
    path: 'proyectos/:slug',
    loadComponent: () =>
      import('./pages/project-detail/project-detail.component').then(
        (m) => m.ProjectDetailComponent,
      ),
  },

  // ─── Rutas solo para usuarios NO autenticados ─────────────────────────────
  // noAuthGuard redirige al home si el usuario ya tiene sesión activa,
  // evitando que un usuario logueado vea la pantalla de login innecesariamente.
  {
    path: 'login',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'registro',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./pages/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
  },

  // ─── Rutas para usuarios autenticados ────────────────────────────────────
  {
    // La validación de rol se hace dentro del componente (no guard) porque
    // la ruta es accesible a cualquier usuario logueado; el componente redirige
    // a programadores si intentan acceder.
    path: 'solicitud',
    loadComponent: () =>
      import('./pages/contact-request/contact-request.component').then(
        (m) => m.ContactRequestComponent,
      ),
  },
  {
    // programmerGuard: solo permite acceso a usuarios con rol 'programador'
    path: 'dashboard/programador',
    canActivate: [programmerGuard],
    loadComponent: () =>
      import(
        './pages/dashboard-programmer/dashboard-programmer.component'
      ).then((m) => m.DashboardProgrammerComponent),
  },
  {
    // authGuard: permite acceso a cualquier usuario autenticado (programador o externo)
    path: 'dashboard/usuario',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard-user/dashboard-user.component').then(
        (m) => m.DashboardUserComponent,
      ),
  },

  // ─── Ruta wildcard 404 ────────────────────────────────────────────────────
  // ** captura cualquier ruta no definida y muestra la página de error 404.
  // Debe ser siempre la última ruta del array para no interceptar rutas válidas.
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
