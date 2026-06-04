import { Injectable, signal, computed } from '@angular/core';

export type UserRole = 'programmer' | 'user' | null;

export interface AuthUser {
  id: string;
  nombre: string;
  correo: string;
  rol: UserRole;
}

@Injectable({ providedIn: 'root' })
export class AuthMockService {
  private readonly _user = signal<AuthUser | null>(null);

  // asReadonly expone el signal sin permisos de escritura; solo este servicio puede mutar el estado de sesión
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);
  readonly isProgrammer = computed(() => this._user()?.rol === 'programmer');
  readonly isUser = computed(() => this._user()?.rol === 'user');

  loginAsProgrammer(): void {
    this._user.set({
      id: '1',
      nombre: 'Marco Cobos',
      correo: 'marcocobos15@gmail.com',
      rol: 'programmer',
    });
  }

  loginAsUser(): void {
    this._user.set({
      id: '2',
      nombre: 'Usuario Demo',
      correo: 'usuario@demo.com',
      rol: 'user',
    });
  }

  logout(): void {
    this._user.set(null);
  }
}
