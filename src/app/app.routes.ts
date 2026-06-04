import { Routes } from '@angular/router';
import { authGuard, noAuthGuard, programmerGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
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
  {
    path: 'solicitud',
    loadComponent: () =>
      import('./pages/contact-request/contact-request.component').then(
        (m) => m.ContactRequestComponent,
      ),
  },
  {
    path: 'dashboard/programador',
    canActivate: [programmerGuard],
    loadComponent: () =>
      import(
        './pages/dashboard-programmer/dashboard-programmer.component'
      ).then((m) => m.DashboardProgrammerComponent),
  },
  {
    path: 'dashboard/usuario',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard-user/dashboard-user.component').then(
        (m) => m.DashboardUserComponent,
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
